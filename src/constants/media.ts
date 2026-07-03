export const MEDIA_ENTITY_TYPE = {
  PRODUCT: "product",
  OUTFIT: "outfit",
} as const;

export type MediaEntityType =
  (typeof MEDIA_ENTITY_TYPE)[keyof typeof MEDIA_ENTITY_TYPE];

export const MEDIA_TYPE = {
  PRODUCT_MOCKUP: "product_mockup",
  PRODUCT_TRANSPARENT: "product_transparent",
  OUTFIT_COVER: "outfit_cover",
  OUTFIT_ANCHOR: "outfit_anchor",
} as const;

export type MediaType = (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];
