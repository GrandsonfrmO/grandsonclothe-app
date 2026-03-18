import { NextRequest, NextResponse } from 'next/server';
import { getUserNotifications, getAdminNotifications, getUnreadNotificationCount } from '@/lib/notifications';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const adminId = searchParams.get('adminId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId && !adminId) {
      return NextResponse.json(
        { error: 'userId or adminId is required' },
        { status: 400 }
      );
    }

    let notifications;
    if (userId) {
      notifications = await getUserNotifications(parseInt(userId), limit);
    } else {
      notifications = await getAdminNotifications(parseInt(adminId!), limit);
    }

    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.isRead);
    }

    return NextResponse.json(notifications);
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
