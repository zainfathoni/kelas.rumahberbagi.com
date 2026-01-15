-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Consumption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PRISTINE',
    CONSTRAINT "Consumption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Consumption_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Consumption_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Consumption" ("contentId", "courseId", "createdAt", "id", "progress", "status", "updatedAt", "userId") SELECT "contentId", "courseId", "createdAt", "id", "progress", "status", "updatedAt", "userId" FROM "Consumption";
DROP TABLE "Consumption";
ALTER TABLE "new_Consumption" RENAME TO "Consumption";
CREATE UNIQUE INDEX "Consumption_userId_contentId_key" ON "Consumption"("userId", "contentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
