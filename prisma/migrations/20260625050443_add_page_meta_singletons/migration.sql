-- CreateTable
CREATE TABLE "MembersPageMeta" (
    "id" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "heroParagraph" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembersPageMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsPageMeta" (
    "id" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "heroParagraph" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectsPageMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationsPageMeta" (
    "id" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "heroParagraph" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicationsPageMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LecturesPageMeta" (
    "id" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "heroParagraph" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LecturesPageMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardPageMeta" (
    "id" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "heroParagraph" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardPageMeta_pkey" PRIMARY KEY ("id")
);
