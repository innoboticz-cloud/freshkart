
export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  unit: string;
  description: string;
}

export enum Category {
  VEGETABLES = 'Vegetables',
  FRUITS = 'Fruits',
  DAIRY = 'Dairy & Eggs',
  BAKERY = 'Bakery',
  PANTRY = 'Pantry',
  BEVERAGES = 'Beverages'
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
