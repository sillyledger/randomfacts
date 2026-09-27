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

export function getFact(id: string): Fact | undefined {
  return facts.find((fact) => fact.id === id);
}

// The next `count` facts in the same category by num, wrapping around, so every build picks the same ones.
export function getRelatedFacts(fact: Fact, count: number): Fact[] {
  const sameCategory = facts.filter((other) => other.category === fact.category).sort((a, b) => a.num - b.num);
  const start = sameCategory.findIndex((other) => other.id === fact.id);
  const related: Fact[] = [];
  for (let step = 1; step < sameCategory.length && related.length < count; step++) {
    related.push(sameCategory[(start + step) % sameCategory.length]);
  }
  return related;
}
