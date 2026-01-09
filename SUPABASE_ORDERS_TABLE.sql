-- SQL to create the orders table in Supabase
-- Run this in your Supabase SQL Editor

-- Drop the existing table if you want to recreate it (optional)
-- DROP TABLE IF EXISTS orders;

-- Create the orders table with proper timestamp type
CREATE TABLE IF NOT EXISTS orders (
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

-- Enable Row Level Security (optional)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts (for development - in production, you may want to restrict this)
CREATE POLICY "Allow public inserts" ON orders
    FOR INSERT
    WITH CHECK (true);

-- Create a policy to allow selects (for development)
CREATE POLICY "Allow public selects" ON orders
    FOR SELECT
    USING (true);

-- Create an index on order_id for faster lookups
CREATE INDEX idx_orders_order_id ON orders(order_id);

-- Create an index on created_at for sorting by date
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

