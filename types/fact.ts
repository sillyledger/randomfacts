export type Category = 'Science' | 'Nature' | 'Space' | 'History' | 'Food' | 'Culture';

export interface Fact {
  id: string;
  category: Category;
  title: string;
  explain: string;
}
