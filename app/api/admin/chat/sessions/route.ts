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

    // Fetch all chat sessions, including their latest message to display in the list
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updated_at: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { created_at: 'desc' }
        },
        user: {
          select: { email: true }
        },
        _count: {
          select: {
            messages: {
              where: {
                sender_role: 'customer',
                is_read: false
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error: any) {
    console.error('Error fetching admin chat sessions:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
