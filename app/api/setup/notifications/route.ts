import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';

export async function POST() {
  try {
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE notification_type AS ENUM (
          'order_created',
          'order_processing',
          'order_shipped',
          'order_delivered',
          'order_cancelled',
          'payment_received',
          'new_order_admin',
          'low_stock_admin',
          'product_review'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        admin_id INTEGER REFERENCES users(id),
        type notification_type NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        is_read BOOLEAN DEFAULT false,
        action_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        read_at TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_admin_id ON notifications(admin_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
      CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
    `);

    return NextResponse.json({ success: true, message: 'Notifications table created' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
