-- Extend your existing E-commerce Orders Table with payment and timing fields
-- Run this in Supabase SQL Editor - NO DATA WILL BE LOST

-- Step 1: Add missing columns for payment
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity TEXT DEFAULT '1';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total TEXT DEFAULT '499';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Step 2: Fix created_at to be TIMESTAMPTZ (this fixes the null issue)
-- First check current type
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';

-- If created_at is text, convert it
ALTER TABLE orders ALTER COLUMN created_at TYPE TIMESTAMPTZ;

-- Update any null created_at values
UPDATE orders SET created_at = NOW() WHERE created_at IS NULL;

-- Set default value for new orders
ALTER TABLE orders ALTER COLUMN created_at SET DEFAULT NOW();

-- Step 3: Add updated_at column if missing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 4: Enable RLS if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies for the website
CREATE POLICY IF NOT EXISTS "Allow public inserts" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public reads" ON orders FOR SELECT TO anon USING (true);

-- Step 6: Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Step 7: Check sample data
SELECT order_id, created_at, status, payment FROM orders LIMIT 5;

