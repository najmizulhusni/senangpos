-- =====================================================
-- VERIFY ADMIN STATUS
-- Run this to check if admin user exists and has is_admin = true
-- =====================================================

-- Check all users and their admin status
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.shop_name,
  p.is_admin,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- =====================================================
-- If admin@senangpos.com shows is_admin = false or NULL,
-- run this to make them admin:
-- =====================================================

UPDATE profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@senangpos.com');

-- =====================================================
-- Verify it worked
-- =====================================================

SELECT 
  u.email,
  p.is_admin
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'admin@senangpos.com';
