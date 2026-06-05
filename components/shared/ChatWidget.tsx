"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, Minimize2, Leaf } from "lucide-react";
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
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle open chat & load session
  const handleToggleOpen = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    if (!session && user) {
      setLoading(true);
      try {
        // Fetch or create chat session for logged in user
        const res = await fetch("/api/chat/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        
        if (data.success && data.session) {
          setSession(data.session);
          
          // Load existing messages
          const msgRes = await fetch(`/api/chat/messages?session_id=${data.session.id}`);
          const msgData = await msgRes.json();
          if (msgData.success) {
            setMessages(msgData.messages || []);
          }
        }
      } catch (err) {
        console.error("Failed to load chat session:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Subscribe to real-time messages
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel(`chat_messages:${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicate messages
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, supabase]);

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session) return;

    const content = input.trim();
    setInput("");

    try {
      // Optimistic message add
      const tempId = "temp-" + Date.now();
      const tempMsg: Message = {
        id: tempId,
        session_id: session.id,
        sender_id: null,
        sender_role: "customer",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.id,
          content,
          sender_role: "customer",
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
      console.error("Failed to send message:", err);
    }
  };

  // Hide on admin routes or if user is not logged in
  if (pathname?.startsWith("/admin") || !user) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* Chat window */}
      {isOpen && (
        <div
          className="w-[360px] max-w-[calc(100vw-32px)] h-[500px] max-h-[80vh] rounded-3xl overflow-hidden flex flex-col mb-4 transition-all duration-300"
          style={{
            background: "rgba(250, 248, 244, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(47, 86, 50, 0.15)",
            boxShadow: "0 12px 40px rgba(14, 26, 15, 0.15)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between text-white"
            style={{
              background: "linear-gradient(135deg, #1e3820, #2f5632)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                <Leaf size={14} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight text-stone-100">Hỗ trợ Mộc Sơn</h4>
                <p className="text-[10px] text-emerald-400/90 mt-0.5 leading-none">Thường trả lời trong vài phút</p>
              </div>
            </div>
            <button
              onClick={handleToggleOpen}
              className="text-stone-300 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-stone-400 gap-2">
                <div className="w-6 h-6 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold">Đang kết nối...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <span className="text-3xl mb-3">👋</span>
                <p className="font-bold text-stone-700 text-sm mb-1">Xin chào!</p>
                <p className="text-xs leading-relaxed max-w-[200px]">
                  Mộc Sơn có thể giúp gì cho bạn? Hãy để lại câu hỏi của bạn tại đây nhé.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.sender_role === "admin";
                return (
                  <div
                    key={msg.id}
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isAdmin
                        ? "self-start bg-white text-stone-800 rounded-tl-none shadow-sm border border-stone-200/50"
                        : "self-end bg-emerald-800 text-white rounded-tr-none shadow-sm"
                    }`}
                  >
                    {msg.content}
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isAdmin ? "text-stone-400" : "text-emerald-300"
                      }`}
                    >
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

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-stone-200/60 bg-white/50 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={loading}
              className="flex-1 px-4 py-2 text-xs rounded-xl outline-none border border-stone-200 focus:border-emerald-800 bg-white text-stone-800 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center hover:bg-emerald-900 disabled:bg-stone-200 disabled:text-stone-400 transition-all cursor-pointer"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={handleToggleOpen}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-950/20 hover:scale-105 transition-all cursor-pointer duration-300"
        style={{
          background: "linear-gradient(135deg, #1e3820, #2f5632)",
        }}
        aria-label="Chat support"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
