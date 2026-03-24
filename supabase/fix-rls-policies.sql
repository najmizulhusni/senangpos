-- =====================================================
-- FIX RLS POLICIES FOR PROFILES TABLE
-- This fixes the 500 error when fetching profiles
-- =====================================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create simple permissive policies
CREATE POLICY "Allow users to view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Allow admins to view all profiles" ON profiles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Verify policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'profiles';
