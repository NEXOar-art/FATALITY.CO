import { Product } from './types';

// Using high-quality remote placeholders to avoid loading errors with missing local files.
// Each ID produces a different streetwear-style graphic.
const STAMP_IMAGES = [
  'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1503342452485-86b7f54547ee?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1589156206699-bc21e38c8a7d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80'
];

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 42 }).map((_, i) => {
  const stampUrl = STAMP_IMAGES[i % STAMP_IMAGES.length];
  return {
    id: (i + 1).toString(),
    name: `Fatality Ramdom #${i + 1}`,
    price: 15000 + (Math.floor(Math.random() * 5) * 1000),
    author: 'Fatality Ramdom',
    description: 'Prendas diseñadas para durar, inspiradas en el movimiento Ramdom. Streetwear minimal con actitud 100% algodón premium.',
    image: stampUrl,
    stamp: stampUrl,
    baseColor: '#ffffff'
  };
});

export const COLOR_MAP: Record<string, string> = {
  'Blanco': '#ffffff',
  'Negro': '#111111',
  'Rojo': '#ff3e3e',
  'Amarillo': '#f4d35e',
  'Azul': '#1d3557'
};