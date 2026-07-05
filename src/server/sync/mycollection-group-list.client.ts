const ENDPOINT = 'https://mycollection.shop/api/v3/gql/?q=storefrontGroupList';

const REQUEST_TIMEOUT_MS = 15_000;

const GQL_QUERY = `
  query StorefrontGroupListQuery(
    $urlSuffix: String
    $keyword: String
    $page: LinktreelandingpagePaginationInput
    $affiliateMeta: AffiliateMetaInput
    $uuId: String
    $deviceId: String
    $cid: String
    $language: String
  ) {
    storefrontGroupList(
      urlSuffix: $urlSuffix
      keyword: $keyword
      page: $page
      affiliateMeta: $affiliateMeta
      uuId: $uuId
      deviceId: $deviceId
      cid: $cid
      language: $language
    ) {
      groupList {
        groupId
        groupName
        groupType
        isPined
        groupStatus
        totalCount
      }
      pagination {
        offset
        limit
        hasMore
        totalCount
      }
    }
  }
`.trim();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FetchStorefrontGroupListInput {
  urlSuffix: string;
  affiliateId: string;
  affiliateUserId: string;
  uuId?: string;
  deviceId?: string;
  cid: string;
  language: string;
  offset: number;
  limit: number;
}

export interface StorefrontGroupItem {
  groupId: string;
  groupName: string;
  groupType: string;
  isPined: boolean;
  groupStatus: string;
  totalCount: number;
}

export interface StorefrontGroupListResult {
  groupList: StorefrontGroupItem[];
  pagination: {
    offset: number;
    limit: number;
    hasMore: boolean;
    totalCount: number;
  };
}

// ─── Client ───────────────────────────────────────────────────────────────────

export async function fetchStorefrontGroupList(
  input: FetchStorefrontGroupListInput,
): Promise<StorefrontGroupListResult> {
  const { urlSuffix, affiliateId, affiliateUserId, uuId, deviceId, cid, language, offset, limit } = input;

  const body = JSON.stringify({
    operationName: 'StorefrontGroupListQuery',
    query: GQL_QUERY,
    variables: {
      urlSuffix,
      keyword: '',
      affiliateMeta: { affiliateId, userId: affiliateUserId },
      ...(uuId ? { uuId } : {}),
      ...(deviceId ? { deviceId } : {}),
      cid,
      language,
      page: { offset: String(offset), limit: String(limit), hasMore: true },
    },
  });

  const ctx = `urlSuffix=${urlSuffix}, offset=${offset}`;

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    if (isTimeout) {
      throw new Error(`[mycollection-groups] Request timed out after ${REQUEST_TIMEOUT_MS}ms (${ctx})`);
    }
    throw new Error(
      `[mycollection-groups] Network error (${ctx}): ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    throw new Error(`[mycollection-groups] HTTP ${response.status} ${response.statusText} (${ctx})`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new Error(`[mycollection-groups] Invalid JSON response (${ctx})`);
  }

  if (hasGqlErrors(json)) {
    const messages = json.errors.map((e) => e.message ?? 'Unknown GQL error').join('; ');
    throw new Error(`[mycollection-groups] GraphQL errors (${ctx}): ${messages}`);
  }

  const data = extractResult(json);
  if (!data) {
    throw new Error(
      `[mycollection-groups] Unexpected response shape: missing storefrontGroupList (${ctx})`,
    );
  }

  return data;
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function hasGqlErrors(value: unknown): value is { errors: Array<{ message?: string }> } {
  if (typeof value !== 'object' || value === null) return false;
  const errors = (value as Record<string, unknown>).errors;
  return Array.isArray(errors) && errors.length > 0;
}

function extractResult(value: unknown): StorefrontGroupListResult | null {
  if (typeof value !== 'object' || value === null) return null;
  const data = (value as Record<string, unknown>).data;
  if (typeof data !== 'object' || data === null) return null;
  const result = (data as Record<string, unknown>).storefrontGroupList;
  if (typeof result !== 'object' || result === null) return null;
  return result as StorefrontGroupListResult;
}
