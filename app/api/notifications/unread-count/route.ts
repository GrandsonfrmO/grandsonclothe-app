import { NextRequest, NextResponse } from 'next/server';
import { getUnreadNotificationCount } from '@/lib/notifications';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const adminId = searchParams.get('adminId');

    if (!userId && !adminId) {
      return NextResponse.json(
        { error: 'userId or adminId is required' },
        { status: 400 }
      );
    }

    const count = await getUnreadNotificationCount(
      userId ? parseInt(userId) : undefined,
      adminId ? parseInt(adminId) : undefined
    );

    return NextResponse.json({ unreadCount: count });
  } catch (error) {
    logger.error('Error fetching unread count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    );
  }
}
