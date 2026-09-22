import type { Category } from '@/types/fact';

export const categoryTokens: Record<Category, { bg: string; accent: string }> = {
  Science: { bg: '#DDD6FE', accent: '#8B5CF6' },
  Nature: { bg: '#BBF7D0', accent: '#22C55E' },
  Space: { bg: '#BFDBFE', accent: '#3B82F6' },
  History: { bg: '#FDE68A', accent: '#D97706' },
  Food: { bg: '#FECACA', accent: '#EF4444' },
  Culture: { bg: '#FBCFE8', accent: '#EC4899' },
};
