export type Category =
  | 'Science'
  | 'Animals'
  | 'Space'
  | 'History'
  | 'Food'
  | 'Culture'
  | 'Human Body'
  | 'Earth'
  | 'Language'
  | 'Technology';

export interface FactSource {
  name: string;
  url: string;
}

export interface Fact {
  id: string;
  // Permanent positive integer, never reused or renumbered: it's the fact's bit in the seen cookie.
  num: number;
  category: Category;
  title: string;
  explain: string;
  // Optional longer paragraph shown on the fact's own page.
  story?: string;
  source?: FactSource;
}
