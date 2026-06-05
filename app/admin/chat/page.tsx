"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Message {
  id: string;
  session_id: string;
  sender_id: string | null;
  sender_role: string;
  content: string;
  created_at: string;
}

interface ChatSession {
  id: string;
  user_id: string | null;
  session_key: string;
  customer_name: string;
  created_at: string;
  updated_at: string;
  messages?: Message[]; // holds the latest message or complete list
  user?: { email: string | null };
  _count?: { messages: number };
}

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all chat sessions on mount
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/chat/sessions");
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to fetch chat sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch messages when active session changes
  useEffect(() => {
    if (!activeSession) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/chat/messages?session_id=${activeSession.id}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeSession]);

  const handleSelectSession = async (sess: ChatSession) => {
    setActiveSession(sess);
    
    // Optimistically update unread count for this session to 0
    setSessions(prev => prev.map(s => 
      s.id === sess.id ? { ...s, _count: { messages: 0 } } : s
    ));

    // Mark messages as read in DB
    try {
      await fetch('/api/chat/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sess.id, mark_role_as_read: 'customer' })
      });
    } catch (err) {
      console.error('Failed to mark messages as read', err);
    }
  };

  // Real-time messages subscription
  useEffect(() => {
    const channel = supabase
      .channel("admin_global_chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMsg = payload.new as Message;

          // Update active session messages
          if (activeSession && newMsg.session_id === activeSession.id) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            // If the message is from customer and session is active, mark it read immediately
            if (newMsg.sender_role === 'customer') {
              fetch('/api/chat/messages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: activeSession.id, mark_role_as_read: 'customer' })
              }).catch(console.error);
            }
          }

          // Update the sessions list and move the active session to the top
          setSessions((prevSessions) => {
            const index = prevSessions.findIndex((s) => s.id === newMsg.session_id);
            if (index !== -1) {
              const isActive = activeSession?.id === newMsg.session_id;
              const updatedSession = {
                ...prevSessions[index],
                updated_at: new Date().toISOString(),
                messages: [newMsg], // Update latest message snippet
                _count: {
                  messages: isActive || newMsg.sender_role === 'admin' 
                    ? 0 
                    : (prevSessions[index]._count?.messages || 0) + 1
                }
              };
              const newSessions = [...prevSessions];
              newSessions.splice(index, 1); // remove from current position
              return [updatedSession, ...newSessions]; // prepend to top
            } else {
              // If it's a new session we haven't loaded, fetch the sessions again
              fetchSessions();
              return prevSessions;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeSession, supabase]);

  // Send reply message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeSession) return;

    const content = input.trim();
    setInput("");

    try {
      // Optimistic message add
      const tempId = "temp-" + Date.now();
      const tempMsg: Message = {
        id: tempId,
        session_id: activeSession.id,
        sender_id: null,
        sender_role: "admin",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: activeSession.id,
          content,
          sender_role: "admin",
        }),
      });
      const data = await res.json();

      if (data.success && data.message) {
        // Replace optimistic message with actual DB message
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m))
        );
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-zinc-950 rounded-3xl border border-zinc-800/80 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <span>💬</span> Hỗ Trợ Khách Hàng Realtime
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Trả lời tin nhắn trực tiếp của khách viếng thăm và thành viên</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left pane: Session list */}
        <div className="w-80 border-r border-zinc-800/80 flex flex-col bg-zinc-950 shrink-0">
          <div className="p-4 border-b border-zinc-800/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Danh sách hội thoại
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading && sessions.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs gap-2">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-600">
                <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-semibold">Chưa có hội thoại nào</p>
              </div>
            ) : (
              sessions.map((sess) => {
                const isSelected = activeSession?.id === sess.id;
                const lastMsg = sess.messages && sess.messages[0];
                return (
                  <button
                    key={sess.id}
                    onClick={() => handleSelectSession(sess)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-start gap-3 border ${
                      isSelected
                        ? "bg-emerald-950/20 border-emerald-800/50 text-zinc-100"
                        : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
                      isSelected ? "bg-emerald-800/20 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                    }`}>
                      <User size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs truncate leading-snug">
                            {sess.customer_name}
                          </p>
                          {(sess._count?.messages ?? 0) > 0 && (
                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                          )}
                        </div>
                        <span className="text-[9px] text-zinc-600 font-semibold">
                          {sess.updated_at
                            ? new Date(sess.updated_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] text-zinc-500 truncate leading-normal">
                          {lastMsg ? lastMsg.content : "Bắt đầu cuộc trò chuyện"}
                        </p>
                        {sess.user?.email && (
                          <span className="text-[9px] text-zinc-600 font-medium truncate ml-2 max-w-[100px]">
                            {sess.user.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right pane: Chat Area */}
        <div className="flex-1 flex flex-col bg-zinc-900/30">
          {activeSession ? (
            <>
              {/* Active Header */}
              <div className="px-6 py-4.5 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-800/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    <User size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                      {activeSession.customer_name}
                      {activeSession.user?.email && (
                        <span className="text-[10px] font-normal text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full">
                          {activeSession.user.email}
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-none">Session ID: {activeSession.id}</p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                {loadingMessages ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-2">
                    <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs">Đang tải lịch sử...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-zinc-600 text-xs">
                    Chưa có tin nhắn trong cuộc hội thoại này.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdmin = msg.sender_role === "admin";
                    return (
                      <div
                        key={msg.id}
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          isAdmin
                            ? "self-end bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700/50"
                            : "self-start bg-emerald-900/85 text-emerald-100 rounded-tl-none border border-emerald-800/40"
                        }`}
                      >
                        {msg.content}
                        <div className="text-[9px] mt-1 text-zinc-500 text-right">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Reply Form */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-zinc-800/80 bg-zinc-950/40 flex gap-3 items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Phản hồi cho ${activeSession.customer_name}...`}
                  className="flex-1 px-4 py-3 text-xs rounded-xl outline-none border border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-800 transition-all placeholder-zinc-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all cursor-pointer shadow-md"
                  aria-label="Send reply"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-600">
              <span className="text-4xl mb-3">💬</span>
              <h3 className="font-bold text-zinc-400 text-sm mb-1">Hỗ trợ khách hàng</h3>
              <p className="text-xs leading-relaxed max-w-[280px]">
                Chọn một hội thoại từ danh sách bên trái để xem nội dung và bắt đầu hỗ trợ khách hàng.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
