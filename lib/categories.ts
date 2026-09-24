import type { Category } from '@/types/fact';

export const categoryTokens: Record<Category, { bg: string; accent: string }> = {
  Science: { bg: '#DDD6FE', accent: '#8B5CF6' },
  Animals: { bg: '#BBF7D0', accent: '#22C55E' },
  Space: { bg: '#BFDBFE', accent: '#3B82F6' },
  History: { bg: '#FDE68A', accent: '#D97706' },
  Food: { bg: '#FECACA', accent: '#EF4444' },
  Culture: { bg: '#FBCFE8', accent: '#EC4899' },
  'Human Body': { bg: '#FED7AA', accent: '#F97316' },
  Earth: { bg: '#99F6E4', accent: '#14B8A6' },
  Language: { bg: '#D9F99D', accent: '#65A30D' },
  Technology: { bg: '#F5D0FE', accent: '#C026D3' },
};
