export interface Product {
  id: string;
  name: string;
  price: number;
  author: string;
  image: string; // This is the 'stamp' image URL
  description: string;
  baseColor: string; // Current selected hex
  stamp: string; // Path to the stamp image
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  size: string;
  customColor: string;
  colorName: string;
}

export type ViewState = 'gallery' | 'details' | 'cart' | 'checkout' | 'success';

export interface UserDetails {
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  neighborhood: string;
  city: string;
  province: string;
  zip: string;
}