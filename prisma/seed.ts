import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';
import { PRODUCT_STATUS } from '@/constants/status';

// ─── Env Loading ──────────────────────────────────────────────────────────────
// `prisma db seed` calls `tsx prisma/seed.ts` which Prisma CLI wraps with only
// `.env` loaded — NOT `.env.local` (Next.js convention). This parser loads
// `.env.local` so devs don't need a separate `.env` file.
// Must run BEFORE `new PrismaClient()` because Prisma reads DATABASE_URL at
// construction time.

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    if (!key) continue;
    const raw = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding single or double quotes
    const value = raw.replace(/^(['"])(.*)\1$/, '$2');
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

if (!process.env.DATABASE_URL) {
  console.error(
    '\n❌  DATABASE_URL is not set.\n' +
      '    Set it in .env.local (or .env) and try again.\n' +
      '    Example: DATABASE_URL=postgresql://user:pass@localhost:5432/outfit_click\n',
  );
  process.exit(1);
}

// ─── Prisma Client ────────────────────────────────────────────────────────────

const prisma = new PrismaClient();

// ─── Password hashing ─────────────────────────────────────────────────────────
// Format: `${saltHex}:${derivedKeyHex}` — must stay compatible with auth.ts verifyPassword().
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
  return `${salt}:${derived}`;
}

// ─── Permissions ─────────────────────────────────────────────────────────────
// Keep in sync with src/constants/permissions.ts
const PERMISSION_DEFS: { code: string; name: string; module: string }[] = [
  { code: 'dashboard.view_all', name: 'View All Dashboard', module: 'dashboard' },
  { code: 'dashboard.view_own', name: 'View Own Dashboard', module: 'dashboard' },
  { code: 'users.view', name: 'View Users', module: 'users' },
  { code: 'users.create', name: 'Create Users', module: 'users' },
  { code: 'users.update', name: 'Update Users', module: 'users' },
  { code: 'users.delete', name: 'Delete Users', module: 'users' },
  { code: 'roles.view', name: 'View Roles', module: 'roles' },
  { code: 'roles.manage', name: 'Manage Roles', module: 'roles' },
  { code: 'products.view_all', name: 'View All Products', module: 'products' },
  { code: 'products.view_assigned', name: 'View Assigned Products', module: 'products' },
  { code: 'products.update', name: 'Update Products', module: 'products' },
  { code: 'products.update_dna', name: 'Update Product DNA', module: 'products' },
  { code: 'products.upload_mockup', name: 'Upload Product Mockup', module: 'products' },
  { code: 'products.assign', name: 'Assign Products', module: 'products' },
  { code: 'products.delete', name: 'Delete Products', module: 'products' },
  { code: 'outfits.view_all', name: 'View All Outfits', module: 'outfits' },
  { code: 'outfits.view_own', name: 'View Own Outfits', module: 'outfits' },
  { code: 'outfits.create', name: 'Create Outfits', module: 'outfits' },
  { code: 'outfits.update', name: 'Update Outfits', module: 'outfits' },
  { code: 'outfits.delete', name: 'Delete Outfits', module: 'outfits' },
  { code: 'outfits.publish', name: 'Publish Outfits', module: 'outfits' },
  { code: 'outfits.hide', name: 'Hide Outfits', module: 'outfits' },
  { code: 'outfits.add_product', name: 'Add Product to Outfit', module: 'outfits' },
  { code: 'outfits.remove_product', name: 'Remove Product from Outfit', module: 'outfits' },
  { code: 'analytics.view_all', name: 'View All Analytics', module: 'analytics' },
  { code: 'analytics.view_own', name: 'View Own Analytics', module: 'analytics' },
  { code: 'media.upload', name: 'Upload Media', module: 'media' },
  { code: 'media.delete', name: 'Delete Media', module: 'media' },
  { code: 'sync.view', name: 'View Sync Logs', module: 'sync' },
  { code: 'sync.run', name: 'Run Sync', module: 'sync' },
  { code: 'settings.manage', name: 'Manage Settings', module: 'settings' },
];

// ─── Roles ────────────────────────────────────────────────────────────────────
// Keep in sync with src/constants/roles.ts
const ROLE_DEFS: { code: string; name: string; description: string }[] = [
  { code: 'admin', name: 'Admin', description: 'Full system access' },
  { code: 'manager', name: 'Manager', description: 'Manage products, outfits, analytics' },
  { code: 'product_staff', name: 'Product Staff', description: 'Handle product DNA, mockup, product status' },
  { code: 'outfit_staff', name: 'Outfit Staff', description: 'Create/edit outfits, add products, upload cover' },
  { code: 'viewer', name: 'Viewer', description: 'View-only access to permitted data' },
];

// ─── Role-permission mapping ──────────────────────────────────────────────────
// Source: 04-permission-matrix.md — ✅ only (not Optional)
// Optional permissions (e.g. outfits.publish for manager) must be granted manually by admin.
const ROLE_PERMISSION_CODES: Record<string, string[]> = {
  admin: PERMISSION_DEFS.map((p) => p.code),
  manager: [
    'dashboard.view_all',
    'dashboard.view_own',
    'products.view_all',
    'products.view_assigned',
    'products.update',
    'products.update_dna',
    'products.upload_mockup',
    'products.assign',
    'products.delete',
    'outfits.view_all',
    'outfits.view_own',
    'outfits.create',
    'outfits.update',
    'outfits.delete',
    'outfits.add_product',
    'outfits.remove_product',
    'analytics.view_all',
    'analytics.view_own',
    'media.upload',
    'media.delete',
    'sync.view',
  ],
  product_staff: [
    'dashboard.view_own',
    'products.view_assigned',
    'products.update_dna',
    'products.upload_mockup',
    'outfits.view_own',
    'analytics.view_own',
    'media.upload',
  ],
  outfit_staff: [
    'dashboard.view_own',
    'products.view_assigned',
    'outfits.view_all',
    'outfits.view_own',
    'outfits.create',
    'outfits.update',
    'outfits.add_product',
    'outfits.remove_product',
    'analytics.view_own',
    'media.upload',
  ],
  viewer: [
    'dashboard.view_own',
    'products.view_assigned',
    'outfits.view_own',
    'analytics.view_own',
  ],
};

// ─── Sample products (development only) ──────────────────────────────────────
// Covers all badge variants in /manager/products:
//   status: active / inactive / missing_from_source
//   DNA:    present / missing
//   Mockup: present / missing
//   urlSuffix: 2 different sources
//
// Enable with: SEED_SAMPLE_DATA=true in .env.local
// Uses picsum.photos as deterministic placeholder images — dev only.

type SampleProduct = {
  urlSuffix: string;
  externalLinkId: string;
  externalItemId: string | null;
  externalGroupId: string;
  externalGroupName: string;
  name: string;
  imageUrl: string;
  mockupImageUrl: string | null;
  productDna: string | null;
  affiliateUrl: string | null;
  h5Link: string | null;
  status: string;
  lastSyncedAt: Date;
};

const SAMPLE_PRODUCTS: SampleProduct[] = [
  // teststore — active + has DNA + has Mockup
  {
    urlSuffix: 'teststore',
    externalLinkId: 'sp-ao-001',
    externalItemId: 'item-sp-001',
    externalGroupId: 'grp-ao',
    externalGroupName: 'Áo',
    name: 'Áo thun basic unisex cotton 100% form rộng thoáng mát mùa hè nhiều màu',
    imageUrl: 'https://picsum.photos/seed/sp1/300/400',
    mockupImageUrl: 'https://picsum.photos/seed/sp1m/300/400',
    productDna: 'Áo thun basic, chất liệu cotton 100%, form oversize phù hợp mọi vóc dáng, đi học đi chơi.',
    affiliateUrl: 'https://shopee.vn/product/sp-ao-001',
    h5Link: null,
    status: PRODUCT_STATUS.ACTIVE,
    lastSyncedAt: new Date(),
  },
  // teststore — active + has DNA + no Mockup
  {
    urlSuffix: 'teststore',
    externalLinkId: 'sp-quan-001',
    externalItemId: 'item-sp-002',
    externalGroupId: 'grp-quan',
    externalGroupName: 'Quần',
    name: 'Quần jean nữ ống rộng lưng cao thời trang phong cách Hàn Quốc',
    imageUrl: 'https://picsum.photos/seed/sp2/300/400',
    mockupImageUrl: null,
    productDna: 'Quần jean nữ ống rộng, lưng cao tôn dáng, chất liệu denim cao cấp, phù hợp đi làm đi chơi.',
    affiliateUrl: 'https://shopee.vn/product/sp-quan-001',
    h5Link: null,
    status: PRODUCT_STATUS.ACTIVE,
    lastSyncedAt: new Date(),
  },
  // teststore — active + no DNA + has Mockup
  {
    urlSuffix: 'teststore',
    externalLinkId: 'sp-vay-001',
    externalItemId: 'item-sp-003',
    externalGroupId: 'grp-vay',
    externalGroupName: 'Váy & Đầm',
    name: 'Váy midi hoa nhí vintage dáng xòe cúc bọc tiểu thư nhẹ nhàng',
    imageUrl: 'https://picsum.photos/seed/sp3/300/400',
    mockupImageUrl: 'https://picsum.photos/seed/sp3m/300/400',
    productDna: null,
    affiliateUrl: 'https://shopee.vn/product/sp-vay-001',
    h5Link: null,
    status: PRODUCT_STATUS.ACTIVE,
    lastSyncedAt: new Date(),
  },
  // teststore — active + no DNA + no Mockup (bare minimum)
  {
    urlSuffix: 'teststore',
    externalLinkId: 'sp-giay-001',
    externalItemId: null,
    externalGroupId: 'grp-giay',
    externalGroupName: 'Giày Dép',
    name: 'Giày thể thao nữ sneaker đế độn tăng chiều cao phong cách Ulzzang',
    imageUrl: 'https://picsum.photos/seed/sp4/300/400',
    mockupImageUrl: null,
    productDna: null,
    affiliateUrl: 'https://shopee.vn/product/sp-giay-001',
    h5Link: null,
    status: PRODUCT_STATUS.ACTIVE,
    lastSyncedAt: new Date(),
  },
  // teststore — inactive
  {
    urlSuffix: 'teststore',
    externalLinkId: 'sp-tui-001',
    externalItemId: 'item-sp-005',
    externalGroupId: 'grp-tui',
    externalGroupName: 'Túi Xách',
    name: 'Túi tote canvas đeo vai đơn giản basic nhiều màu sức chứa lớn',
    imageUrl: 'https://picsum.photos/seed/sp5/300/400',
    mockupImageUrl: null,
    productDna: null,
    affiliateUrl: null,
    h5Link: null,
    status: PRODUCT_STATUS.INACTIVE,
    lastSyncedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  // teststore — missing_from_source
  {
    urlSuffix: 'teststore',
    externalLinkId: 'sp-pk-001',
    externalItemId: 'item-sp-006',
    externalGroupId: 'grp-pk',
    externalGroupName: 'Phụ Kiện',
    name: 'Kính mát nữ gọng tròn retro vintage UV400 thời trang',
    imageUrl: 'https://picsum.photos/seed/sp6/300/400',
    mockupImageUrl: null,
    productDna: null,
    affiliateUrl: 'https://shopee.vn/product/sp-pk-001',
    h5Link: null,
    status: PRODUCT_STATUS.MISSING_FROM_SOURCE,
    lastSyncedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  // teststore2 — active + has DNA + has Mockup (different source)
  {
    urlSuffix: 'teststore2',
    externalLinkId: 'sp2-ao-001',
    externalItemId: 'item-sp2-001',
    externalGroupId: 'grp2-ao',
    externalGroupName: 'Áo',
    name: 'Áo polo nữ kẻ sọc tay ngắn cổ bẻ thanh lịch đi làm đi học',
    imageUrl: 'https://picsum.photos/seed/sp7/300/400',
    mockupImageUrl: 'https://picsum.photos/seed/sp7m/300/400',
    productDna: 'Áo polo nữ kẻ sọc, chất liệu cotton pique, form slim phù hợp đi làm và đi học.',
    affiliateUrl: 'https://shopee.vn/product/sp2-ao-001',
    h5Link: 'shopee://product/sp2-ao-001',
    status: PRODUCT_STATUS.ACTIVE,
    lastSyncedAt: new Date(),
  },
  // teststore2 — active + no DNA + no Mockup
  {
    urlSuffix: 'teststore2',
    externalLinkId: 'sp2-dam-001',
    externalItemId: 'item-sp2-002',
    externalGroupId: 'grp2-dam',
    externalGroupName: 'Đầm',
    name: 'Đầm wrap dress họa tiết hoa nữ tính dài tay thu đông phong cách sang trọng',
    imageUrl: 'https://picsum.photos/seed/sp8/300/400',
    mockupImageUrl: null,
    productDna: null,
    affiliateUrl: 'https://shopee.vn/product/sp2-dam-001',
    h5Link: null,
    status: PRODUCT_STATUS.ACTIVE,
    lastSyncedAt: new Date(),
  },
];

// ─── Seed functions ───────────────────────────────────────────────────────────

async function seedPermissions() {
  for (const def of PERMISSION_DEFS) {
    await prisma.permission.upsert({
      where: { code: def.code },
      update: { name: def.name, module: def.module },
      create: def,
    });
  }
  console.log(`✓ Seeded ${PERMISSION_DEFS.length} permissions`);
}

async function seedRoles() {
  for (const def of ROLE_DEFS) {
    await prisma.role.upsert({
      where: { code: def.code },
      update: { name: def.name, description: def.description },
      create: def,
    });
  }
  console.log(`✓ Seeded ${ROLE_DEFS.length} roles`);
}

async function seedRolePermissions() {
  let count = 0;
  for (const [roleCode, permCodes] of Object.entries(ROLE_PERMISSION_CODES)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { code: roleCode } });
    for (const permCode of permCodes) {
      const perm = await prisma.permission.findUniqueOrThrow({ where: { code: permCode } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
      count++;
    }
  }
  console.log(`✓ Seeded ${count} role-permission assignments`);
}

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? 'Admin';

  if (!email || !password) {
    console.log('⚠  Skipped admin user: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local');
    return;
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash: hashPassword(password), status: 'active' },
  });

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: 'admin' } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
    update: {},
    create: { userId: user.id, roleId: adminRole.id },
  });

  console.log(`✓ Admin user seeded: ${email}`);
}

async function seedStyles() {
  const items = [
    { name: 'Casual', slug: 'casual' },
    { name: 'Streetwear', slug: 'streetwear' },
    { name: 'Formal', slug: 'formal' },
    { name: 'Sporty', slug: 'sporty' },
    { name: 'Vintage', slug: 'vintage' },
    { name: 'Minimalist', slug: 'minimalist' },
    { name: 'Boho', slug: 'boho' },
  ];
  for (const item of items) {
    await prisma.style.upsert({
      where: { slug: item.slug },
      update: { name: item.name },
      create: item,
    });
  }
  console.log(`✓ Seeded ${items.length} styles`);
}

async function seedOutfitTypes() {
  const items = [
    { name: 'Đi học', slug: 'di-hoc' },
    { name: 'Đi chơi', slug: 'di-choi' },
    { name: 'Đi làm', slug: 'di-lam' },
    { name: 'Dự tiệc', slug: 'du-tiec' },
    { name: 'Đi biển', slug: 'di-bien' },
    { name: 'Hẹn hò', slug: 'hen-ho' },
    { name: 'Thể thao', slug: 'the-thao' },
  ];
  for (const item of items) {
    await prisma.outfitType.upsert({
      where: { slug: item.slug },
      update: { name: item.name },
      create: item,
    });
  }
  console.log(`✓ Seeded ${items.length} outfit types`);
}

async function seedProductCategories() {
  const items = [
    { name: 'Áo', slug: 'ao' },
    { name: 'Quần', slug: 'quan' },
    { name: 'Váy', slug: 'vay' },
    { name: 'Giày dép', slug: 'giay-dep' },
    { name: 'Túi xách', slug: 'tui-xach' },
    { name: 'Phụ kiện', slug: 'phu-kien' },
    { name: 'Đầm', slug: 'dam' },
  ];
  for (const item of items) {
    await prisma.productCategory.upsert({
      where: { slug: item.slug },
      update: { name: item.name },
      create: item,
    });
  }
  console.log(`✓ Seeded ${items.length} product categories`);
}

async function seedSampleProducts() {
  let count = 0;
  for (const p of SAMPLE_PRODUCTS) {
    await prisma.product.upsert({
      where: {
        urlSuffix_externalLinkId: {
          urlSuffix: p.urlSuffix,
          externalLinkId: p.externalLinkId,
        },
      },
      update: {},
      create: p,
    });
    count++;
  }
  console.log(`✓ Seeded ${count} sample products (teststore: 6, teststore2: 2)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Starting seed...\n');
  await seedPermissions();
  await seedRoles();
  await seedRolePermissions();
  await seedAdminUser();
  await seedStyles();
  await seedOutfitTypes();
  await seedProductCategories();
  if (process.env.SEED_SAMPLE_DATA === 'true') {
    await seedSampleProducts();
  } else {
    console.log('⚠  Skipped sample products: set SEED_SAMPLE_DATA=true to seed dev test data');
  }
  console.log('\nSeed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
