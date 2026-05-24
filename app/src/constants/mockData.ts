export interface Burger {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string;
}

export const BURGER_MENU: Burger[] = [
  {
    id: '1',
    name: 'Stack Simple',
    description: 'Medallón de carne 120g, queso cheddar, lechuga, tomate y salsa stack.',
    ingredients: '1 Medallón de carne de 120g, Queso cheddar, Lechuga, Tomate, Salsa Stack, Pan brioche tostado con manteca.',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Stack Bacon & Cheddar',
    description: 'Doble medallón de carne, abundante panceta crocante y doble cheddar.',
    ingredients: '2 Medallones de carne de 120g, Doble queso cheddar, Abundante panceta crocante, Salsa Barbacoa ahumada.',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Stack Crispy Chicken',
    description: 'Pechuga de pollo súper crocante, aderezo alioli, lechuga y pepinillos.',
    ingredients: 'Pechuga de pollo apanada súper crocante, Aderezo Alioli casero, Lechuga iceberg rallada, Pepinillos agridulces.',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Stack Veggie Premium',
    description: 'Medallón de garbanzos y quinoa, queso provolone, rúcula y cebollas caramelizadas.',
    ingredients: 'Medallón casero de garbanzos, quinoa y hierbas, Queso provolone fundido, Rúcula fresca, Cebollas caramelizadas al malbec.',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
  },
];
