import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Burger } from '../constants/mockData';

// Costo fijo de cada ingrediente extra
export const EXTRA_PRICE = 800;
// Costo de envío fijo (visto en los wireframes)
export const SHIPPING_PRICE = 500;

export interface Customizations {
  medallon: number;
  cheddar: number;
  panceta: number;
  cebolla: number;
}

export interface CartItem {
  id: string; // ID único auto-generado (combina burgerId + personalizaciones + notas)
  burger: Burger;
  quantity: number;
  customizations: Customizations;
  notes: string;
  itemPrice: number; // Precio unitario (base + extras)
  totalPrice: number; // Precio total (itemPrice * quantity)
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { burger: Burger; quantity: number; customizations: Customizations; notes: string } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addToCart: (burger: Burger, quantity: number, customizations: Customizations, notes: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Función auxiliar para calcular el precio de un ítem con sus adicionales
export const calculateItemPrice = (basePrice: number, customizations: Customizations): number => {
  const extrasCount =
    customizations.medallon +
    customizations.cheddar +
    customizations.panceta +
    customizations.cebolla;
  return basePrice + extrasCount * EXTRA_PRICE;
};

// Generar una clave única para agrupar ítems idénticos
const generateCartItemId = (burgerId: string, customizations: Customizations, notes: string): string => {
  const { medallon, cheddar, panceta, cebolla } = customizations;
  const cleanNotes = notes.trim().toLowerCase();
  return `${burgerId}-${medallon}-${cheddar}-${panceta}-${cebolla}-${cleanNotes}`;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { burger, quantity, customizations, notes } = action.payload;

      // RN-02: Límite estricto de extras por ítem (máximo 5 de cada tipo)
      const validatedCustomizations = {
        medallon: Math.min(5, Math.max(0, customizations.medallon)),
        cheddar: Math.min(5, Math.max(0, customizations.cheddar)),
        panceta: Math.min(5, Math.max(0, customizations.panceta)),
        cebolla: Math.min(5, Math.max(0, customizations.cebolla)),
      };

      // RN-03: Límite estricto de notas de cocina (máx 150 caracteres)
      const truncatedNotes = notes.substring(0, 150);

      const cartItemId = generateCartItemId(burger.id, validatedCustomizations, truncatedNotes);
      const existingItemIndex = state.items.findIndex(item => item.id === cartItemId);

      let newItems = [...state.items];

      const itemPrice = calculateItemPrice(burger.price, validatedCustomizations);

      if (existingItemIndex > -1) {
        // Si el producto con las mismas personalizaciones ya existe, sumamos la cantidad
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: itemPrice * newQuantity,
        };
      } else {
        // Si es nuevo, lo agregamos
        newItems.push({
          id: cartItemId,
          burger,
          quantity,
          customizations: validatedCustomizations,
          notes: truncatedNotes,
          itemPrice,
          totalPrice: itemPrice * quantity,
        });
      }

      return calculateTotals(newItems);
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      return calculateTotals(newItems);
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      // HU-04 / RF-05: Validar cantidad mínima de 1 unidad
      const validatedQuantity = Math.max(1, quantity);

      const newItems = state.items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity: validatedQuantity,
            totalPrice: item.itemPrice * validatedQuantity,
          };
        }
        return item;
      });

      return calculateTotals(newItems);
    }

    case 'CLEAR_CART':
      return {
        items: [],
        subtotal: 0,
        shipping: 0,
        total: 0,
      };

    default:
      return state;
  }
};

// Función auxiliar para recalcular subtotales y totales generales (RF-06)
const calculateTotals = (items: CartItem[]): CartState => {
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  
  // RN-01: Si el carrito está vacío, el envío y total son 0
  const shipping = subtotal > 0 ? SHIPPING_PRICE : 0;
  const total = subtotal + shipping;

  return {
    items,
    subtotal,
    shipping,
    total,
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  });

  const addToCart = (burger: Burger, quantity: number, customizations: Customizations, notes: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { burger, quantity, customizations, notes } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe utilizarse dentro de un CartProvider');
  }
  return context;
};
