ALTER TABLE "User"
  ALTER COLUMN "password" DROP NOT NULL,
  ADD COLUMN "googleId" TEXT,
  ADD COLUMN "avatarUrl" TEXT;

CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE INDEX "User_name_idx" ON "User"("name");
