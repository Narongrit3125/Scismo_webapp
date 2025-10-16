/*
  Warnings:

  - Added the required column `code` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "authorId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalBudget" REAL,
    "usedBudget" REAL NOT NULL DEFAULT 0,
    "objectives" TEXT,
    "targetGroup" TEXT,
    "expectedResults" TEXT,
    "sponsor" TEXT,
    "coordinator" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "projects_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_projects" ("authorId", "coordinator", "createdAt", "description", "endDate", "expectedResults", "id", "image", "isActive", "objectives", "priority", "shortDescription", "sponsor", "startDate", "status", "targetGroup", "title", "totalBudget", "updatedAt", "usedBudget", "year") SELECT "authorId", "coordinator", "createdAt", "description", "endDate", "expectedResults", "id", "image", "isActive", "objectives", "priority", "shortDescription", "sponsor", "startDate", "status", "targetGroup", "title", "totalBudget", "updatedAt", "usedBudget", "year" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
