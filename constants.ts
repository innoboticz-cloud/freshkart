
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Organic Tomatoes',
    price: 45,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1546473427-e1ad6c628257?auto=format&fit=crop&q=80&w=400',
    unit: 'kg',
    description: 'Ripe, juicy organic tomatoes harvested from local farms.'
  },
  {
    id: '2',
    name: 'Green Crunchy Spinach',
    price: 30,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400',
    unit: 'bunch',
    description: 'Fresh nutrient-rich spinach leaves.'
  },
  {
    id: '3',
    name: 'Royal Gala Apples',
    price: 120,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&q=80&w=400',
    unit: 'kg',
    description: 'Sweet and crispy Royal Gala apples.'
  },
  {
    id: '4',
    name: 'Organic Bananas',
    price: 60,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?auto=format&fit=crop&q=80&w=400',
    unit: 'doz',
    description: 'Energy-packed organic yellow bananas.'
  },
  {
    id: '5',
    name: 'Fresh Whole Milk',
    price: 55,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1563636619-e9108b055f52?auto=format&fit=crop&q=80&w=400',
    unit: 'liter',
    description: 'Pasteurized farm-fresh whole milk.'
  },
  {
    id: '6',
    name: 'Artisan Sourdough',
    price: 90,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08?auto=format&fit=crop&q=80&w=400',
    unit: 'loaf',
    description: 'Handcrafted sourdough bread with a crispy crust.'
  },
  {
    id: '7',
    name: 'Greek Yogurt',
    price: 75,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
    unit: 'cup',
    description: 'Thick and creamy plain Greek yogurt.'
  },
  {
    id: '8',
    name: 'Cold Brew Coffee',
    price: 150,
    category: Category.BEVERAGES,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400',
    unit: 'bottle',
    description: 'Smooth cold-steeped artisan coffee.'
  }
];

export const CATEGORIES = Object.values(Category);
