-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "lastLoginAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "module" VARCHAR(80) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "urlSuffix" VARCHAR(120) NOT NULL,
    "externalLinkId" VARCHAR(120) NOT NULL,
    "externalItemId" VARCHAR(120),
    "externalGroupId" VARCHAR(120),
    "externalGroupName" VARCHAR(255),
    "name" VARCHAR(500) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "mockupImageUrl" TEXT,
    "productDna" TEXT,
    "affiliateUrl" TEXT,
    "h5Link" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "assignedTo" UUID,
    "rawJson" JSONB,
    "lastSyncedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfits" (
    "id" UUID NOT NULL,
    "outfitCode" CHAR(6) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT NOT NULL,
    "styleId" UUID,
    "outfitTypeId" UUID,
    "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID,
    "publishedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "outfits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_products" (
    "id" UUID NOT NULL,
    "outfitId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "addedBy" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "outfit_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_view_logs" (
    "id" UUID NOT NULL,
    "outfitId" UUID NOT NULL,
    "outfitCode" CHAR(6) NOT NULL,
    "sessionId" VARCHAR(120),
    "cookieId" VARCHAR(120),
    "referrer" TEXT,
    "utmSource" VARCHAR(120),
    "utmMedium" VARCHAR(120),
    "utmCampaign" VARCHAR(120),
    "userAgent" TEXT,
    "ipHash" VARCHAR(255),
    "viewedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outfit_view_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "click_logs" (
    "id" UUID NOT NULL,
    "outfitId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "outfitCode" CHAR(6) NOT NULL,
    "urlSuffix" VARCHAR(120) NOT NULL,
    "sessionId" VARCHAR(120),
    "cookieId" VARCHAR(120),
    "redirectUrl" TEXT NOT NULL,
    "referrer" TEXT,
    "utmSource" VARCHAR(120),
    "utmMedium" VARCHAR(120),
    "utmCampaign" VARCHAR(120),
    "userAgent" TEXT,
    "ipHash" VARCHAR(255),
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "isSuspicious" BOOLEAN NOT NULL DEFAULT false,
    "invalidReason" VARCHAR(120),
    "clickedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "click_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_logs" (
    "id" UUID NOT NULL,
    "urlSuffix" VARCHAR(120) NOT NULL,
    "groupId" VARCHAR(120),
    "status" VARCHAR(30) NOT NULL,
    "totalFetched" INTEGER NOT NULL DEFAULT 0,
    "totalCreated" INTEGER NOT NULL DEFAULT 0,
    "totalUpdated" INTEGER NOT NULL DEFAULT 0,
    "totalDeactivated" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMPTZ NOT NULL,
    "finishedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" UUID NOT NULL,
    "mediaType" VARCHAR(80) NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "mimeType" VARCHAR(100),
    "fileSize" BIGINT,
    "width" INTEGER,
    "height" INTEGER,
    "uploadedBy" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "styles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "outfit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "products_urlSuffix_idx" ON "products"("urlSuffix");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_externalGroupId_idx" ON "products"("externalGroupId");

-- CreateIndex
CREATE INDEX "products_assignedTo_idx" ON "products"("assignedTo");

-- CreateIndex
CREATE INDEX "products_lastSyncedAt_idx" ON "products"("lastSyncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "products_urlSuffix_externalLinkId_key" ON "products"("urlSuffix", "externalLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "outfits_outfitCode_key" ON "outfits"("outfitCode");

-- CreateIndex
CREATE UNIQUE INDEX "outfits_slug_key" ON "outfits"("slug");

-- CreateIndex
CREATE INDEX "outfits_status_idx" ON "outfits"("status");

-- CreateIndex
CREATE INDEX "outfits_styleId_idx" ON "outfits"("styleId");

-- CreateIndex
CREATE INDEX "outfits_outfitTypeId_idx" ON "outfits"("outfitTypeId");

-- CreateIndex
CREATE INDEX "outfits_publishedAt_idx" ON "outfits"("publishedAt");

-- CreateIndex
CREATE INDEX "outfit_products_outfitId_idx" ON "outfit_products"("outfitId");

-- CreateIndex
CREATE INDEX "outfit_products_productId_idx" ON "outfit_products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "outfit_products_outfitId_productId_key" ON "outfit_products"("outfitId", "productId");

-- CreateIndex
CREATE INDEX "outfit_view_logs_outfitId_viewedAt_idx" ON "outfit_view_logs"("outfitId", "viewedAt");

-- CreateIndex
CREATE INDEX "click_logs_outfitId_clickedAt_idx" ON "click_logs"("outfitId", "clickedAt");

-- CreateIndex
CREATE INDEX "click_logs_productId_clickedAt_idx" ON "click_logs"("productId", "clickedAt");

-- CreateIndex
CREATE INDEX "click_logs_sessionId_idx" ON "click_logs"("sessionId");

-- CreateIndex
CREATE INDEX "click_logs_cookieId_idx" ON "click_logs"("cookieId");

-- CreateIndex
CREATE INDEX "click_logs_isValid_idx" ON "click_logs"("isValid");

-- CreateIndex
CREATE UNIQUE INDEX "styles_slug_key" ON "styles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "outfit_types_slug_key" ON "outfit_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_slug_key" ON "product_categories"("slug");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "styles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_outfitTypeId_fkey" FOREIGN KEY ("outfitTypeId") REFERENCES "outfit_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_products" ADD CONSTRAINT "outfit_products_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "outfits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_products" ADD CONSTRAINT "outfit_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_products" ADD CONSTRAINT "outfit_products_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_view_logs" ADD CONSTRAINT "outfit_view_logs_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "outfits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "click_logs" ADD CONSTRAINT "click_logs_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "outfits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "click_logs" ADD CONSTRAINT "click_logs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
