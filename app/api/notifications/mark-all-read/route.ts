import { NextRequest, NextResponse } from 'next/server';
import { markAllNotificationsAsRead } from '@/lib/notifications';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, adminId } = body;

    if (!userId && !adminId) {
      return NextResponse.json(
        { error: 'userId or adminId is required' },
        { status: 400 }
      );
    }

    await markAllNotificationsAsRead(
      userId ? parseInt(userId) : undefined,
      adminId ? parseInt(adminId) : undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}
