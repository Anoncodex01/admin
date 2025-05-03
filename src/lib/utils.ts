import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTZS(amount: number): string {
  // Format with Tanzanian Shilling currency format
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function generateCreatorId(index: number): string {
  const prefix = 'NIS';
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 9000) + 1000;
  const hash = Array.from(String(timestamp + random + index))
    .map(char => char.charCodeAt(0).toString(16))
    .join('')
    .toUpperCase()
    .slice(0, 6);

  return `${prefix}-${year}-${hash}`;
}

export function getAvatarUrl(url: string | null): string | null {
  if (!url) return null;
  // Extract just the filename from the URL
  const filename = url.split('/').pop();
  // Construct the correct URL with studio.nisapoti.com
  return `https://studio.nisapoti.com/uploads/avatars/${filename}`;
}