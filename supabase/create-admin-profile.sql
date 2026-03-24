-- =====================================================
-- CREATE ADMIN PROFILE
-- Run this if admin user exists but profile doesn't
-- =====================================================

-- Get the admin user ID and create profile
INSERT INTO profiles (id, full_name, shop_name, is_admin)
SELECT id, 'Admin', 'SenangPOS Admin', true
FROM auth.users
WHERE email = 'admin@senangpos.com'
AND id NOT IN (SELECT id FROM profiles);

-- Verify it worked
SELECT id, full_name, shop_name, is_admin 
FROM profiles 
WHERE email = (SELECT email FROM auth.users WHERE email = 'admin@senangpos.com');

-- If the above doesn't work, use this instead:
-- SELECT p.id, p.full_name, p.shop_name, p.is_admin, u.email
-- FROM profiles p
-- JOIN auth.users u ON p.id = u.id
-- WHERE u.email = 'admin@senangpos.com';
