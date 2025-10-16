/*
  Warnings:

  - You are about to drop the column `achievements` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `challenges` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `demoUrl` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `githubUrl` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `impact` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `targetUsers` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `projects` table. All the data in the column will be lost.
  - Added the required column `year` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Made the column `endDate` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "project_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "reportDate" DATETIME NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "attachments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "project_reports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "projectId" TEXT,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "location" TEXT,
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "requirements" TEXT,
    "budget" REAL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tags" TEXT,
    "image" TEXT,
    CONSTRAINT "activities_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_activities" ("authorId", "category", "createdAt", "currentParticipants", "description", "endDate", "id", "image", "isPublic", "location", "maxParticipants", "requirements", "startDate", "status", "tags", "title", "type", "updatedAt") SELECT "authorId", "category", "createdAt", "currentParticipants", "description", "endDate", "id", "image", "isPublic", "location", "maxParticipants", "requirements", "startDate", "status", "tags", "title", "type", "updatedAt" FROM "activities";
DROP TABLE "activities";
ALTER TABLE "new_activities" RENAME TO "activities";
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_projects" ("authorId", "createdAt", "description", "endDate", "id", "priority", "shortDescription", "sponsor", "startDate", "status", "title", "updatedAt") SELECT "authorId", "createdAt", "description", "endDate", "id", "priority", "shortDescription", "sponsor", "startDate", "status", "title", "updatedAt" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
