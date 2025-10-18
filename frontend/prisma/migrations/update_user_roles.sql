-- Migration Script: อัปเดต Role เดิมให้สอดคล้องกับระบบใหม่
-- วันที่: 18 ตุลาคม 2568
-- คำอธิบาย: แปลง EDITOR และ STAFF เป็น MEMBER

-- ========================================
-- ขั้นตอนที่ 1: ตรวจสอบข้อมูลปัจจุบัน
-- ========================================

-- ดูจำนวน users แต่ละ role
SELECT 
    "role", 
    COUNT(*) as "จำนวน"
FROM "users"
GROUP BY "role"
ORDER BY "role";

-- ========================================
-- ขั้นตอนที่ 2: Backup ข้อมูลก่อนแก้ไข
-- ========================================

-- สร้างตาราง backup (optional แต่แนะนำ)
CREATE TABLE IF NOT EXISTS "users_backup_20251018" AS 
SELECT * FROM "users";

-- ========================================
-- ขั้นตอนที่ 3: อัปเดต Role
-- ========================================

-- อัปเดต EDITOR เป็น MEMBER
UPDATE "users" 
SET "role" = 'MEMBER' 
WHERE "role" = 'EDITOR';

-- อัปเดต STAFF เป็น MEMBER  
UPDATE "users" 
SET "role" = 'STAFF'
WHERE "role" = 'STAFF';

-- ========================================
-- ขั้นตอนที่ 4: ตรวจสอบผลลัพธ์
-- ========================================

-- ดูจำนวน users หลังแก้ไข
SELECT 
    "role", 
    COUNT(*) as "จำนวน"
FROM "users"
GROUP BY "role"
ORDER BY "role";

-- ตรวจสอบว่าไม่มี EDITOR หรือ STAFF เหลืออยู่
SELECT * FROM "users" 
WHERE "role" IN ('EDITOR', 'STAFF');
-- ผลลัพธ์ควรเป็น 0 rows

-- ========================================
-- ขั้นตอนที่ 5: ตรวจสอบความสมบูรณ์
-- ========================================

-- ตรวจสอบว่า role ทั้งหมดถูกต้อง (ควรมีแค่ ADMIN, MEMBER, USER)
SELECT DISTINCT "role" FROM "users";

-- ========================================
-- (Optional) Rollback - กรณีต้องการยกเลิก
-- ========================================

/*
-- หากต้องการ rollback กลับไปสู่สถานะเดิม
TRUNCATE "users";
INSERT INTO "users" SELECT * FROM "users_backup_20251018";

-- ลบตาราง backup หลังใช้งานเสร็จ
DROP TABLE IF EXISTS "users_backup_20251018";
*/

-- ========================================
-- หมายเหตุ
-- ========================================

/*
คำแนะนำการใช้งาน:
1. Backup database ก่อนรันสคริปต์นี้
2. รันทีละขั้นตอน ตรวจสอบผลลัพธ์ก่อนไปขั้นตอนถัดไป
3. ตรวจสอบ application logs หลังอัปเดต
4. ทดสอบ login ด้วย user แต่ละ role

Role Mapping:
- ADMIN → ADMIN (ไม่เปลี่ยน)
- EDITOR → MEMBER (แปลงเป็นสมาชิกสโมสร)
- STAFF → MEMBER (แปลงเป็นสมาชิกสโมสร)  
- MEMBER → MEMBER (ไม่เปลี่ยน)
- *(ไม่มีข้อมูล)* → USER (สำหรับผู้ใช้ใหม่)
*/
