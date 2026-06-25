-- AlterTable
-- ResearchFigure gains `wide`: when true the public Research gallery renders the
-- figure across the full row (emphasis) instead of one equal grid slot.
ALTER TABLE "ResearchFigure" ADD COLUMN "wide" BOOLEAN NOT NULL DEFAULT false;
