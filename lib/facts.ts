import factsData from '@/data/facts.json';
import type { Fact } from '@/types/fact';

export function getFacts(): Fact[] {
  return factsData as Fact[];
}
