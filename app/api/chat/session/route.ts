import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Bạn cần đăng nhập để chat.' }, { status: 401 });
    }

    // Find session by user_id
    let session = await prisma.chatSession.findFirst({
      where: { user_id: user.id },
    });

    if (!session) {
      // Fetch user profile from database to get their full name
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id }
      });

      const name = userProfile?.full_name || user.user_metadata?.full_name || user.email || 'Khách hàng';

      // Create new session
      session = await prisma.chatSession.create({
        data: {
          user_id: user.id,
          session_key: `user-${user.id}`,
          customer_name: name
        }
      });
    }

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    console.error('Error in chat session API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
