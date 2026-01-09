-- Fix NULL timestamp issue in Supabase
-- Run this in your Supabase SQL Editor

-- Step 1: Check current column type
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'created_at';

-- Step 2: If data_type is 'text' or 'character varying', convert to TIMESTAMPTZ
ALTER TABLE orders ALTER COLUMN created_at TYPE TIMESTAMPTZ;

-- Step 3: Update any null values with current timestamp
UPDATE orders SET created_at = NOW() WHERE created_at IS NULL;

-- Step 4: Add default value for future inserts
ALTER TABLE orders ALTER COLUMN created_at SET DEFAULT NOW();

-- Step 5: Also fix updated_at if it exists and has same issue
-- (Run these if you have updated_at column)
-- ALTER TABLE orders ALTER COLUMN updated_at TYPE TIMESTAMPTZ;
-- UPDATE orders SET updated_at = NOW() WHERE updated_at IS NULL;
-- ALTER TABLE orders ALTER COLUMN updated_at SET DEFAULT NOW();

-- Step 6: Verify the fix
SELECT order_id, created_at, status FROM orders ORDER BY created_at DESC LIMIT 5;

