-- ============================================
-- Supabase RLS Policies for SCALP MAX Orders
-- ============================================

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous inserts (from website)
CREATE POLICY "Allow anonymous inserts" ON orders
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Allow public reads (for admin panel)
CREATE POLICY "Allow public reads" ON orders
FOR SELECT
TO anon
USING (true);

-- Policy 3: Allow public updates (for order status)
CREATE POLICY "Allow public updates" ON orders
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Verify policies created
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- ============================================
-- Test Insert (optional - run in SQL Editor)
-- ============================================
INSERT INTO orders (order_id, name, email, phone, address, city, state, pincode, quantity, total, payment, status, created_at, date, time)
VALUES ('TEST-123', 'Test Customer', 'test@example.com', '9876543210', 'Test Address', 'Mumbai', 'Maharashtra', '400001', '1', '499', 'COD', 'Test Order', NOW()::text, CURRENT_DATE::text, CURRENT_TIME::text);

