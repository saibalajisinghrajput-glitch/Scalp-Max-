-- Complete orders table recreation with all fields
-- Run this in Supabase SQL Editor - creates table with RLS policies

-- Step 1: Drop existing table if it exists (clears corrupted state)
DROP TABLE IF EXISTS orders CASCADE;

-- Step 2: Create fresh orders table with all required columns
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    quantity TEXT NOT NULL DEFAULT '1',
    total TEXT NOT NULL DEFAULT '499',
    payment TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 3: Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies for website access
CREATE POLICY "Allow public inserts" ON orders
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public reads" ON orders
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public updates" ON orders
    FOR UPDATE TO anon USING (true);

-- Step 5: Verify table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Step 6: Verify RLS policies
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'orders';

-- Step 7: Test the table (should return empty for now)
SELECT 'Table ready!' as status, NOW() as server_time;
