import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import type { ProductUpsertData } from './product.mapper';

export interface UpsertProductResult {
  wasCreated: boolean;
}

export async function upsertProductFromSource(
  data: ProductUpsertData,
): Promise<UpsertProductResult> {
  const existing = await prisma.product.findUnique({
    where: {
      urlSuffix_externalLinkId: {
        urlSuffix: data.urlSuffix,
        externalLinkId: data.externalLinkId,
      },
    },
    select: { id: true },
  });

  if (!existing) {
    await prisma.product.create({
      data: {
        urlSuffix: data.urlSuffix,
        externalLinkId: data.externalLinkId,
        externalItemId: data.externalItemId,
        externalGroupId: data.externalGroupId,
        externalGroupName: data.externalGroupName,
        name: data.name,
        imageUrl: data.imageUrl,
        affiliateUrl: data.affiliateUrl,
        h5Link: data.h5Link,
        rawJson: data.rawJson as Prisma.InputJsonValue,
        status: data.status,
        lastSyncedAt: data.lastSyncedAt,
      },
    });
    return { wasCreated: true };
  }

  await prisma.product.update({
    where: { id: existing.id },
    data: {
      externalItemId: data.externalItemId,
      externalGroupId: data.externalGroupId,
      externalGroupName: data.externalGroupName,
      name: data.name,
      imageUrl: data.imageUrl,
      affiliateUrl: data.affiliateUrl,
      h5Link: data.h5Link,
      rawJson: data.rawJson as Prisma.InputJsonValue,
      status: data.status,
      lastSyncedAt: data.lastSyncedAt,
    },
  });

  return { wasCreated: false };
}
