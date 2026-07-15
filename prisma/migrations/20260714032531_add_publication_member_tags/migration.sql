-- CreateTable
CREATE TABLE "_MemberToPublication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemberToPublication_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MemberToPublication_B_index" ON "_MemberToPublication"("B");

-- AddForeignKey
ALTER TABLE "_MemberToPublication" ADD CONSTRAINT "_MemberToPublication_A_fkey" FOREIGN KEY ("A") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberToPublication" ADD CONSTRAINT "_MemberToPublication_B_fkey" FOREIGN KEY ("B") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
