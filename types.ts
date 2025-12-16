export interface Product {
  id: string;
  name: string;
  price: number;
  author: string;
  image: string; // Background image for the card
  description: string;
  baseColor: string; // Hex for 3D model
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  size: string;
  customColor?: string;
}

export type ViewState = 'gallery' | 'details' | 'cart' | 'checkout' | 'success';

export interface UserDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}