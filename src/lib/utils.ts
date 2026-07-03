import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProductDisplayImage(product: {
  mockupImageUrl: string | null;
  imageUrl: string;
}): string {
  return product.mockupImageUrl ?? product.imageUrl;
}
