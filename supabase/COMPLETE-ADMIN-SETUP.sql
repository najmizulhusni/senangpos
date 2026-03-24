-- =====================================================
-- COMPLETE ADMIN SETUP FOR SENANGPOS
-- Run this ENTIRE script in Supabase SQL Editor
-- This will fix the is_admin column error
-- =====================================================

-- STEP 1: Add is_admin column to existing profiles table
-- (This fixes the "column is_admin does not exist" error)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- STEP 2: Create support_tickets table if not exists
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- STEP 3: Enable RLS on support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create policy for support_tickets
DROP POLICY IF EXISTS "Allow all on support_tickets" ON support_tickets;
CREATE POLICY "Allow all on support_tickets" ON support_tickets FOR ALL USING (true);

-- STEP 5: Update admin policy for profiles (so admins can see all users)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- =====================================================
-- VERIFY: Check that is_admin column was added
-- =====================================================
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'is_admin';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- If you see "is_admin | boolean | false" above, the setup is complete!
-- 
-- NEXT STEPS:
-- 1. Create an account in the app with email: admin@senangpos.com
-- 2. Run the SQL below to make that user an admin:
--
-- UPDATE profiles 
-- SET is_admin = true 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@senangpos.com');
--
-- 3. Login with admin@senangpos.com to access Admin panel
-- =====================================================
