-- =====================================================
-- SenangPOS Complete Database Schema for Supabase
-- Run this ENTIRE script in your Supabase SQL Editor
-- =====================================================

-- 1. PROFILES TABLE (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(255),
  shop_name VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'main',
  icon VARCHAR(50) DEFAULT 'nasi-lemak',
  is_available BOOLEAN DEFAULT true,
  stock_qty INTEGER DEFAULT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number SERIAL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  item_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SUPPORT TICKETS TABLE (for admin monitoring)
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all on menu_items" ON menu_items;
DROP POLICY IF EXISTS "Allow all on orders" ON orders;
DROP POLICY IF EXISTS "Allow all on order_items" ON order_items;
DROP POLICY IF EXISTS "Allow all on support_tickets" ON support_tickets;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Allow all policies for other tables (for demo purposes)
CREATE POLICY "Allow all on menu_items" ON menu_items FOR ALL USING (true);
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all on order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all on support_tickets" ON support_tickets FOR ALL USING (true);

-- =====================================================
-- TRIGGER: Auto-create profile on user signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, shop_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'shop_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- DEFAULT MENU ITEMS (Malaysian Pasar Tani dishes)
-- =====================================================

INSERT INTO menu_items (name, price, category, icon, is_available, stock_qty) VALUES
  ('Nasi Lemak Ayam', 7.00, 'main', 'nasi-lemak', true, 50),
  ('Nasi Lemak Telur', 5.00, 'main', 'nasi-lemak', true, 50),
  ('Nasi Ayam Goreng Berempah', 7.00, 'main', 'chicken', true, 40),
  ('Nasi Ayam', 7.00, 'main', 'chicken', true, 40),
  ('Laksa Penang', 6.00, 'main', 'noodle', true, 30),
  ('Laksa Johor', 6.00, 'main', 'noodle', true, 30),
  ('Ayam Laksa', 6.00, 'main', 'noodle', true, 30),
  ('Mee Kari', 5.00, 'main', 'noodle', true, 35),
  ('Lontong Kering', 6.00, 'main', 'rice-box', true, 25),
  ('Soto', 6.00, 'main', 'soup', true, 30),
  ('Telur Goreng', 1.00, 'addon', 'egg', true, 100),
  ('Telur Rebus', 1.00, 'addon', 'boiled-egg', true, 100),
  ('Extra Ayam', 4.00, 'addon', 'chicken', true, 50),
  ('Extra Daging', 4.00, 'addon', 'meat', true, 30),
  ('Sambal Extra', 0.50, 'addon', 'chili', true, NULL),
  ('Keropok', 1.00, 'addon', 'cracker', true, 100)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE ADMIN USER
-- After running this schema, create an account with email:
-- admin@senangpos.my
-- Then run this to make them admin:
-- =====================================================

-- UPDATE profiles 
-- SET is_admin = true 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@senangpos.my');
