export type MenuCategory = 'burgers' | 'fries' | 'drinks' | 'desserts';

export type ProductStockStatus = 'activo' | 'sin_stock';

export interface Burger {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string;
  category: MenuCategory;
  stockStatus?: ProductStockStatus;
}
