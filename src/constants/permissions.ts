export const PERMISSIONS = {
  DASHBOARD_VIEW_ALL: "dashboard.view_all",
  DASHBOARD_VIEW_OWN: "dashboard.view_own",

  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",

  ROLES_VIEW: "roles.view",
  ROLES_MANAGE: "roles.manage",

  PRODUCTS_VIEW_ALL: "products.view_all",
  PRODUCTS_VIEW_ASSIGNED: "products.view_assigned",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_UPDATE_DNA: "products.update_dna",
  PRODUCTS_UPLOAD_MOCKUP: "products.upload_mockup",
  PRODUCTS_ASSIGN: "products.assign",
  PRODUCTS_DELETE: "products.delete",

  OUTFITS_VIEW_ALL: "outfits.view_all",
  OUTFITS_VIEW_OWN: "outfits.view_own",
  OUTFITS_CREATE: "outfits.create",
  OUTFITS_UPDATE: "outfits.update",
  OUTFITS_DELETE: "outfits.delete",
  OUTFITS_PUBLISH: "outfits.publish",
  OUTFITS_HIDE: "outfits.hide",
  OUTFITS_ADD_PRODUCT: "outfits.add_product",
  OUTFITS_REMOVE_PRODUCT: "outfits.remove_product",

  ANALYTICS_VIEW_ALL: "analytics.view_all",
  ANALYTICS_VIEW_OWN: "analytics.view_own",

  MEDIA_UPLOAD: "media.upload",
  MEDIA_DELETE: "media.delete",

  SYNC_VIEW: "sync.view",
  SYNC_RUN: "sync.run",

  SETTINGS_MANAGE: "settings.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
