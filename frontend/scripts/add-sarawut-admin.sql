-- Add ศราวุฒิ ปล้องสา as Admin User
-- Email: sarawutp65@nu.ac.th
-- Password: 65314812 (will be hashed by application)
-- Role: ADMIN

-- Note: Password needs to be hashed using bcrypt with salt rounds 10
-- The hash for '65314812' is: $2b$10$... (generate this in your app)

-- Step 1: Generate password hash (run this in Node.js/TypeScript first):
/*
const bcrypt = require('bcrypt');
const password = '65314812';
const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword);
*/

-- Step 2: Insert user with the hashed password
-- Password hash generated with bcrypt (salt rounds: 10)
-- Plain password: 65314812
-- Hashed password: $2b$10$VW8FTfzzSkBhDrZB6g8kge6DixYEjayV5fULHnNNIp89VQZnadUDm

INSERT INTO "User" (
  "id",
  "email",
  "username",
  "password",
  "firstName",
  "lastName",
  "role",
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'sarawutp65@nu.ac.th',
  'sarawutp65',
  '$2b$10$VW8FTfzzSkBhDrZB6g8kge6DixYEjayV5fULHnNNIp89VQZnadUDm',
  'ศราวุฒิ',
  'ปล้องสา',
  'ADMIN',
  true,
  NOW(),
  NOW()
)
ON CONFLICT ("email") 
DO UPDATE SET
  "password" = EXCLUDED."password",
  "firstName" = EXCLUDED."firstName",
  "lastName" = EXCLUDED."lastName",
  "role" = 'ADMIN',
  "isActive" = true,
  "updatedAt" = NOW();

-- Verify the user was created
SELECT 
  "id",
  "email",
  "username",
  "firstName",
  "lastName",
  "role",
  "isActive",
  "createdAt"
FROM "User"
WHERE "email" = 'sarawutp65@nu.ac.th';
