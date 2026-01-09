-- Run this in Supabase SQL Editor to replace the E-commerce template table
-- This creates the exact table our website needs

-- Step 1: Drop the existing E-commerce table
DROP TABLE IF EXISTS orders CASCADE;

-- Step 2: Create the orders table with correct columns for our website
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
    payment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 3: Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies (allows website to insert orders)
CREATE POLICY "Allow public inserts" ON orders
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public reads" ON orders
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public updates" ON orders
    FOR UPDATE
    USING (true);

-- Step 5: Verify the table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

