-- Demo reset: empty every content + demo-generated analytics/audit table so the
-- committed seed (prisma/seed-data.sql) can be reloaded on top, returning the
-- public demo to a known-good state on a schedule (see
-- .github/workflows/demo-reset.yml).
--
-- Deliberately does NOT touch "User" (the demo admin account) or
-- _prisma_migrations. CASCADE frees us from FK ordering; RESTART IDENTITY is a
-- no-op here (all PKs are cuid text) but harmless.
--
-- Run as the first file of a single transaction, immediately before the seed:
--   psql "$URL" -v ON_ERROR_STOP=1 --single-transaction \
--     -f prisma/demo-reset.sql -f prisma/seed-data.sql
TRUNCATE TABLE
  public."Member",
  public."Publication",
  public."ResearchTopic",
  public."ResearchSubsection",
  public."ResearchFigure",
  public."Lecture",
  public."News",
  public."Project",
  public."GalleryItem",
  public."ResearchPageMeta",
  public."MembersPageMeta",
  public."ProjectsPageMeta",
  public."PublicationsPageMeta",
  public."LecturesPageMeta",
  public."BoardPageMeta",
  public."_MemberToPublication",
  public."PublicationView",
  public."PageView",
  public."LoginAttempt",
  public."AuditLog"
RESTART IDENTITY CASCADE;
