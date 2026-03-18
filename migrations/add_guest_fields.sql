-- Migration: Add guest fields to orders table
-- Date: 2026-03-08

-- Add guest_email column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255);

-- Add guest_name column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255);
