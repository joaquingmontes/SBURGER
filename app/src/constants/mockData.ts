export type MenuCategory = 'burgers' | 'fries' | 'drinks' | 'desserts';

export interface Burger {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string;
  category: MenuCategory;
}
