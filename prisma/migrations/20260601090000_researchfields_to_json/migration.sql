-- AlterTable
-- Member.researchFields changes from text[] to jsonb so it can hold the grouped
-- structure ([{ group, items: [{ label, subs }] }]), consistent with the other
-- professor-only JSON columns. The professor row is re-seeded after this runs.
ALTER TABLE "Member" DROP COLUMN "researchFields",
ADD COLUMN     "researchFields" JSONB;
