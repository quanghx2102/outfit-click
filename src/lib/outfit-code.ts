import { randomInt } from 'crypto';
import { prisma } from '@/lib/db';

// Excludes ambiguous characters: 0, O, 1, I
const OUTFIT_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += OUTFIT_CODE_ALPHABET[randomInt(OUTFIT_CODE_ALPHABET.length)];
  }
  return result;
}

export async function generateOutfitCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = randomCode(6);
    const exists = await prisma.outfit.findUnique({ where: { outfitCode: code } });
    if (!exists) return code;
  }
  throw new Error('Cannot generate unique outfit code after 10 attempts');
}
