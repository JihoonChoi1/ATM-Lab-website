-- CreateTable
CREATE TABLE "PublicationView" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "type" "PublicationType" NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublicationView_createdAt_idx" ON "PublicationView"("createdAt");

-- CreateIndex
CREATE INDEX "PublicationView_publicationId_idx" ON "PublicationView"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationView_visitorId_publicationId_key" ON "PublicationView"("visitorId", "publicationId");

-- AddForeignKey
ALTER TABLE "PublicationView" ADD CONSTRAINT "PublicationView_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
