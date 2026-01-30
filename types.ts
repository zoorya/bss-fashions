export interface Product {
  id: number;
  name: string;
  price: number;
  // Add other product fields as needed
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}