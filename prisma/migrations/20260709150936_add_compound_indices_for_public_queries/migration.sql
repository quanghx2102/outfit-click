-- CreateIndex
CREATE INDEX "outfit_types_status_deletedAt_idx" ON "outfit_types"("status", "deletedAt");

-- CreateIndex
CREATE INDEX "outfits_status_publishedAt_styleId_idx" ON "outfits"("status", "publishedAt", "styleId");

-- CreateIndex
CREATE INDEX "outfits_outfitCode_status_deletedAt_idx" ON "outfits"("outfitCode", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "styles_status_deletedAt_idx" ON "styles"("status", "deletedAt");
