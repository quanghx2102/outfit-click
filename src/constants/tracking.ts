export const TRACKING_COOKIE = {
  USER_ID: "aos_uid",
  SESSION_ID: "aos_sid",
} as const;

export const TRACKING_CONFIG = {
  SESSION_TTL_MINUTES: 30,
  USER_COOKIE_TTL_DAYS: 365,
  DUPLICATE_CLICK_WINDOW_SECONDS: 30,
  MAX_CLICKS_PER_SESSION_PER_MINUTE: 20,
} as const;

export const CLICK_INVALID_REASON = {
  DUPLICATE_CLICK_30S: "duplicate_click_30s",
  BOT_USER_AGENT: "bot_user_agent",
  TOO_MANY_CLICKS_PER_SESSION: "too_many_clicks_per_session",
  MANAGER_PREVIEW: "manager_preview",
  PRODUCT_NOT_IN_OUTFIT: "product_not_in_outfit",
  PRODUCT_INACTIVE: "product_inactive",
  OUTFIT_INACTIVE: "outfit_inactive",
} as const;

export type ClickInvalidReason =
  (typeof CLICK_INVALID_REASON)[keyof typeof CLICK_INVALID_REASON];
