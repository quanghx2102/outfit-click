export const ROLE_CODES = {
  ADMIN: "admin",
  MANAGER: "manager",
  PRODUCT_STAFF: "product_staff",
  OUTFIT_STAFF: "outfit_staff",
  VIEWER: "viewer",
} as const;

export type RoleCode = (typeof ROLE_CODES)[keyof typeof ROLE_CODES];
