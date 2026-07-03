export const USER_STATUS = {
  ACTIVE: "active",
  DISABLED: "disabled",
  DELETED: "deleted",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  MISSING_FROM_SOURCE: "missing_from_source",
  DELETED: "deleted",
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const OUTFIT_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  HIDDEN: "hidden",
  DELETED: "deleted",
} as const;

export type OutfitStatus = (typeof OUTFIT_STATUS)[keyof typeof OUTFIT_STATUS];

export const SYNC_STATUS = {
  RUNNING: "running",
  SUCCESS: "success",
  PARTIAL_SUCCESS: "partial_success",
  FAILED: "failed",
} as const;

export type SyncStatus = (typeof SYNC_STATUS)[keyof typeof SYNC_STATUS];
