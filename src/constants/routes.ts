export const PUBLIC_ROUTES = {
  HOME: "/",
  OUTFITS: "/outfits",
  OUTFIT_DETAIL_PREFIX: "/outfit",
  REDIRECT_PREFIX: "/go",
} as const;

export const MANAGER_ROUTES = {
  LOGIN: "/manager/login",
  DASHBOARD: "/manager",
  PRODUCTS: "/manager/products",
  OUTFITS: "/manager/outfits",
  USERS: "/manager/users",
  ROLES: "/manager/roles",
  ANALYTICS: "/manager/analytics",
  SYNC_LOGS: "/manager/sync-logs",
} as const;

export const SEO_CONFIG = {
  SITE_NAME: "Affiliate Outfit Site",
  DEFAULT_TITLE: "Gợi ý phối đồ đẹp mỗi ngày",
  DEFAULT_DESCRIPTION:
    "Khám phá các outfit đẹp, dễ phối và các item gợi ý theo từng phong cách.",
  ROBOTS_INDEX_FOLLOW: "index, follow",
  ROBOTS_NOINDEX_NOFOLLOW: "noindex, nofollow",
} as const;
