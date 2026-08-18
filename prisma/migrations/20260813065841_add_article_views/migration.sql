-- CreateTable
CREATE TABLE "article_view" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "article_view_articleId_idx" ON "article_view"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "article_view_articleId_userId_key" ON "article_view"("articleId", "userId");

-- AddForeignKey
ALTER TABLE "article_view" ADD CONSTRAINT "article_view_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_view" ADD CONSTRAINT "article_view_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
