-- Create notification_type enum
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

-- Create notifications table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_admin_id ON notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
