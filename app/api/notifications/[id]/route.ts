import { NextRequest, NextResponse } from 'next/server';
import { markNotificationAsRead, deleteNotification } from '@/lib/notifications';
import { logger } from '@/lib/logger';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isRead } = body;

    if (isRead === undefined) {
      return NextResponse.json(
        { error: 'isRead field is required' },
        { status: 400 }
      );
    }

    if (isRead) {
      const updated = await markNotificationAsRead(parseInt(id));
      return NextResponse.json(updated);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteNotification(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
