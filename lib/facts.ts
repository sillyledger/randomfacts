import factsData from '@/data/facts.json';
import type { Fact } from '@/types/fact';

const facts = factsData as Fact[];

// The seen cookie stores one bit per `num`, so a duplicate would silently merge two facts.
const nums = new Set<number>();
for (const fact of facts) {
  if (!Number.isInteger(fact.num) || fact.num < 1 || nums.has(fact.num)) {
    throw new Error(`Fact "${fact.id}" needs a unique positive integer num (got ${fact.num})`);
  }
  nums.add(fact.num);
}

export function getFacts(): Fact[] {
  return facts;
}
