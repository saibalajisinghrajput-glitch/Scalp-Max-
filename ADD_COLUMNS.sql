-- ============================================
-- Add Missing Columns to Orders Table
-- ============================================

-- Add missing columns (if they don't exist)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS time TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment TEXT;

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Test insert with all columns
INSERT INTO orders (order_id, name, email, phone, address, city, state, pincode, quantity, total, payment, status, created_at, date, time)
VALUES ('TEST-FINAL', 'Final Test', 'final@example.com', '9876543210', 'Test Address', 'Mumbai', 'Maharashtra', '400001', '1', '499', 'COD', 'Final Test', NOW()::text, CURRENT_DATE::text, CURRENT_TIME::text);

-- Verify insert
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

