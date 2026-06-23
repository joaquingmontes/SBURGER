export const PRODUCT_CATEGORIES = [
  'Hamburguesas',
  'Papas',
  'Bebidas',
  'Postres',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
}
