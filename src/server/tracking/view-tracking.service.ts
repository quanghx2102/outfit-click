import { prisma } from '@/lib/db';

export interface OutfitViewLogInput {
  outfitId: string;
  outfitCode: string;
  sessionId: string | null;
  cookieId: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  userAgent: string | null;
  ipHash: string | null;
}

export async function recordOutfitView(input: OutfitViewLogInput): Promise<void> {
  await prisma.outfitViewLog.create({ data: input });
}
