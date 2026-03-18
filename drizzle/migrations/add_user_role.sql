-- Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'buyer';

-- Create the enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'buyer', 'guest');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
