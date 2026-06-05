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

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Fetch total count of unread messages from customers
    const unreadCount = await prisma.chatMessage.count({
      where: {
        sender_role: 'customer',
        is_read: false
      }
    });

    return NextResponse.json({ success: true, count: unreadCount });
  } catch (error: any) {
    console.error('Error fetching unread chat count:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
