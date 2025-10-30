-- Remove userId column from members table
ALTER TABLE members DROP COLUMN IF EXISTS "userId";
