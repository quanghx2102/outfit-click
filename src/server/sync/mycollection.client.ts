const ENDPOINT =
  'https://mycollection.shop/api/v3/gql/?q=storefrontGroupProductList';

const REQUEST_TIMEOUT_MS = 15_000;

// Minimal GQL query — only fields used by the sync mapping in 06-cron-sync-products.md.
// groupId variable uses Long scalar as required by the MyCollection schema.
const GQL_QUERY = `
  query StorefrontGroupProductListQuery(
    $urlSuffix: String
    $groupId: Long
    $page: LinktreelandingpagePaginationInput
    $affiliateMeta: AffiliateMetaInput
    $cid: String
    $language: String
  ) {
    storefrontGroupProductList(
      urlSuffix: $urlSuffix
      groupId: $groupId
      page: $page
      affiliateMeta: $affiliateMeta
      cid: $cid
      language: $language
    ) {
      itemList {
        linkId
        link
        linkName
        image
        linkType
        itemId
        isPined
        h5Link
        itemCard
      }
      groupList {
        groupId
        groupName
        groupType
        isPined
        groupStatus
        itemList {
          linkId
          link
          linkName
          image
          linkType
          itemId
          isPined
          h5Link
        }
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

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface FetchStorefrontGroupProductListInput {
  urlSuffix: string;
  groupId: string;
  affiliateId: string;
  affiliateUserId: string;
  cid: string;
  language: string;
  offset: number;
  limit: number;
}

export interface MyCollectionProductItemBasic {
  linkId: string;
  link: string;
  linkName: string;
  image: string;
  linkType: string;
  itemId: string;
  isPined: boolean;
  h5Link: string | null;
}

// Top-level itemList items include itemCard (raw extra data for raw_json storage).
export interface MyCollectionProductItem extends MyCollectionProductItemBasic {
  itemCard: unknown;
}

export interface MyCollectionGroupItem {
  groupId: string;
  groupName: string;
  groupType: string;
  isPined: boolean;
  groupStatus: string;
  itemList: MyCollectionProductItemBasic[];
  totalCount: number;
}

export interface MyCollectionPagination {
  offset: number;
  limit: number;
  hasMore: boolean;
  totalCount: number;
}

export interface StorefrontGroupProductListResult {
  itemList: MyCollectionProductItem[];
  groupList: MyCollectionGroupItem[];
  pagination: MyCollectionPagination;
}

// ─── Client function ──────────────────────────────────────────────────────────

export async function fetchStorefrontGroupProductList(
  input: FetchStorefrontGroupProductListInput,
): Promise<StorefrontGroupProductListResult> {
  const { urlSuffix, groupId, affiliateId, affiliateUserId, cid, language, offset, limit } =
    input;

  // page.offset and page.limit must be strings per API contract (observed from api-get-data.md).
  const body = JSON.stringify({
    operationName: 'StorefrontGroupProductListQuery',
    query: GQL_QUERY,
    variables: {
      urlSuffix,
      groupId,
      affiliateMeta: { affiliateId, userId: affiliateUserId },
      cid,
      language,
      page: { offset: String(offset), limit: String(limit), hasMore: true },
    },
  });

  // Context string used in error messages — never includes affiliateId/affiliateUserId.
  const ctx = `urlSuffix=${urlSuffix}, groupId=${groupId}, offset=${offset}`;

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
      throw new Error(
        `[mycollection] Request timed out after ${REQUEST_TIMEOUT_MS}ms (${ctx})`,
      );
    }
    throw new Error(
      `[mycollection] Network error (${ctx}): ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `[mycollection] HTTP ${response.status} ${response.statusText} (${ctx})`,
    );
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new Error(`[mycollection] Invalid JSON response (${ctx})`);
  }

  if (hasGqlErrors(json)) {
    const messages = json.errors.map((e) => e.message ?? 'Unknown GQL error').join('; ');
    throw new Error(`[mycollection] GraphQL errors (${ctx}): ${messages}`);
  }

  const data = extractResult(json);
  if (!data) {
    throw new Error(
      `[mycollection] Unexpected response shape: missing storefrontGroupProductList (${ctx})`,
    );
  }

  return data;
}

// ─── Private type guards ──────────────────────────────────────────────────────

function hasGqlErrors(
  value: unknown,
): value is { errors: Array<{ message?: string }> } {
  if (typeof value !== 'object' || value === null) return false;
  const errors = (value as Record<string, unknown>).errors;
  return Array.isArray(errors) && errors.length > 0;
}

function extractResult(value: unknown): StorefrontGroupProductListResult | null {
  if (typeof value !== 'object' || value === null) return null;
  const data = (value as Record<string, unknown>).data;
  if (typeof data !== 'object' || data === null) return null;
  const result = (data as Record<string, unknown>).storefrontGroupProductList;
  if (typeof result !== 'object' || result === null) return null;
  return result as StorefrontGroupProductListResult;
}
