-- Manual Postgres migration: add PendingProduct table
CREATE TABLE IF NOT EXISTS "PendingProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "basePrice" REAL NOT NULL DEFAULT 0,
    "image" TEXT,
    "storageTemp" TEXT,
    "shelfLifeDays" INTEGER NOT NULL DEFAULT 3,
    "categoryId" TEXT,
    "farmId" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PendingProduct_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PendingProduct_slug_key" ON "PendingProduct"("slug");
