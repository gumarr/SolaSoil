import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'session_id is required' }, { status: 400 });
    }

    // Basic check: admin can view any, user can only view their own session
    const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }
    
    const userProfile = await prisma.user.findUnique({ where: { id: user.id } });
    if (userProfile?.role !== 'admin' && session.user_id !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' }
    });

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { session_id, content, sender_role } = body;

    if (!session_id || !content || !sender_role) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    let senderId: string = user.id;

    if (sender_role === 'admin') {
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id }
      });

      if (userProfile?.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    }

    // Create the message and update the session's updated_at timestamp in a transaction
    const [message] = await prisma.$transaction([
      prisma.chatMessage.create({
        data: {
          session_id,
          content,
          sender_role,
          sender_id: senderId
        }
      }),
      prisma.chatSession.update({
        where: { id: session_id },
        data: { updated_at: new Date() }
      })
    ]);

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { session_id, mark_role_as_read } = body;

    if (!session_id || !mark_role_as_read) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // If mark_role_as_read === 'customer', we are marking customer's messages as read (by an admin).
    // Let's verify admin permission
    if (mark_role_as_read === 'customer') {
      const userProfile = await prisma.user.findUnique({ where: { id: user.id } });
      if (userProfile?.role !== 'admin') {
         return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    }

    await prisma.chatMessage.updateMany({
      where: {
        session_id,
        sender_role: mark_role_as_read,
        is_read: false
      },
      data: {
        is_read: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating messages:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
