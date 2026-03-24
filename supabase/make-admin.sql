-- =====================================================
-- MAKE USER AN ADMIN
-- Run this AFTER creating an account with the email below
-- =====================================================

-- Step 1: Create an account in the app with email: admin@senangpos.com
-- Step 2: Run this SQL to make that user an admin:

UPDATE profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@senangpos.com');

-- =====================================================
-- OR: Make any existing user an admin by their email
-- Replace 'your-email@example.com' with the actual email
-- =====================================================

-- UPDATE profiles 
-- SET is_admin = true 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');

-- =====================================================
-- VERIFY: Check who is admin
-- =====================================================

SELECT 
  p.id,
  p.full_name,
  p.shop_name,
  p.is_admin,
  u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;
