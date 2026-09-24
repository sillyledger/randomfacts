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

export interface Fact {
  id: string;
  category: Category;
  title: string;
  explain: string;
}
