/*
  Warnings:

  - The values [MEMBER] on the enum `OrgRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrgRole_new" AS ENUM ('OWNER', 'ADMIN', 'MARKETING');
ALTER TABLE "organizer_teams" ALTER COLUMN "role" DROP DEFAULT;
UPDATE "organizer_teams" SET "role" = 'ADMIN' WHERE "role"::text = 'MEMBER';
ALTER TABLE "organizer_teams" ALTER COLUMN "role" TYPE "OrgRole_new" USING ("role"::text::"OrgRole_new");
ALTER TYPE "OrgRole" RENAME TO "OrgRole_old";
ALTER TYPE "OrgRole_new" RENAME TO "OrgRole";
DROP TYPE "OrgRole_old";
ALTER TABLE "organizer_teams" ALTER COLUMN "role" SET DEFAULT 'MARKETING';
COMMIT;

-- AlterTable
ALTER TABLE "organizer_teams" ALTER COLUMN "role" SET DEFAULT 'MARKETING';
