-- Extend your existing E-commerce Orders Table with payment and timing fields
-- Run this in Supabase SQL Editor - NO DATA WILL BE LOST

-- Step 1: Add missing columns for payment
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity TEXT DEFAULT '1';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total TEXT DEFAULT '499';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Step 2: Fix created_at to be TIMESTAMPTZ (this fixes the null issue)
-- This converts the column type so timestamps work properly
ALTER TABLE orders ALTER COLUMN created_at TYPE TIMESTAMPTZ;

-- Update any null created_at values with current time
UPDATE orders SET created_at = NOW() WHERE created_at IS NULL;

-- Set default value for new orders (this ensures new orders get timestamps automatically)
ALTER TABLE orders ALTER COLUMN created_at SET DEFAULT NOW();

-- Step 3: Add updated_at column if missing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 4: Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Step 5: Check sample data with timestamps
SELECT order_id, created_at, status, payment FROM orders LIMIT 5;

