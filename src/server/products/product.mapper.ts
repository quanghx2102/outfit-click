import type { MyCollectionProductItem } from '@/server/sync/mycollection.client';
import { PRODUCT_STATUS } from '@/constants/status';

// Context fields that come from sync config, not from the API item itself.
export interface ProductMappingContext {
  urlSuffix: string;
  groupId: string;
  groupName: string;
}

// Shape used for Prisma upsert — only contains sync-managed fields.
// Staff-managed fields (mockupImageUrl, productDna, assignedTo) are intentionally absent.
export interface ProductUpsertData {
  urlSuffix: string;
  externalLinkId: string;
  externalItemId: string | null;
  externalGroupId: string;
  externalGroupName: string;
  name: string;
  imageUrl: string;
  affiliateUrl: string | null;
  h5Link: string | null;
  rawJson: unknown;
  status: string;
  lastSyncedAt: Date;
}

export function mapApiItemToProductUpsertData(
  item: MyCollectionProductItem,
  context: ProductMappingContext,
): ProductUpsertData {
  return {
    urlSuffix: context.urlSuffix,
    externalLinkId: item.linkId,
    externalItemId: item.itemId || null,
    externalGroupId: context.groupId,
    externalGroupName: context.groupName,
    name: item.linkName,
    imageUrl: item.image,
    affiliateUrl: item.link || null,
    h5Link: item.h5Link,
    rawJson: item,
    status: PRODUCT_STATUS.ACTIVE,
    lastSyncedAt: new Date(),
  };
}
