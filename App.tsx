import React, { useState, useMemo } from 'react';
import { ShoppingCart, User, Search, Menu, X, ArrowLeft, Trash2, Heart, ExternalLink, CheckCircle } from 'lucide-react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, ViewState, UserDetails } from './types';
import { Scene3D } from './components/Scene3D';

// --- Utility Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  fullWidth = false 
}: { 
  children?: React.ReactNode; 
  onClick?: React.MouseEventHandler<HTMLButtonElement>; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'; 
  className?: string;
  fullWidth?: boolean;
}) => {
  const baseStyle = "flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300";
  const variants = {
    primary: "bg-primary text-[#101818] hover:bg-[#33f5ff] shadow-[0_0_10px_rgba(0,242,255,0.2)] hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]",
    secondary: "bg-[#27393a] text-white hover:bg-[#344c4d] hover:text-primary",
    outline: "border border-primary text-primary hover:bg-primary/10",
    danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} h-10 px-5 ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs text-[#9ababc] uppercase font-bold tracking-wider">{label}</label>}
    <input 
      className="w-full bg-[#162121] border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-[#566e70]"
      {...props}
    />
  </div>
);

const QuickViewModal = ({ 
  product, 
  onClose, 
  onCustomize 
}: { 
  product: Product; 
  onClose: () => void; 
  onCustomize: () => void;
}) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#162121] border border-[#27393a] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.1)] flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-500/20 text-white hover:text-red-500 rounded-full transition-colors backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-[#0f1515] relative group shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#162121] to-transparent md:bg-gradient-to-r" />
          <div className="absolute bottom-4 left-4">
             <span className="bg-primary text-[#101818] text-xs font-bold px-2 py-1 rounded">Quick View</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col items-start overflow-y-auto">
          <div className="mb-auto">
             <div className="flex items-center gap-2 mb-2">
               <span className="text-[#9ababc] text-xs font-bold tracking-wider uppercase">Por {product.author}</span>
             </div>
             <h2 className="text-3xl font-black text-white mb-2 leading-tight">{product.name}</h2>
             <p className="text-primary text-2xl font-bold mb-6 shadow-primary/20 drop-shadow-lg">${product.price.toFixed(2)}</p>
             <p className="text-[#9ababc] mb-8 leading-relaxed text-sm md:text-base">{product.description}</p>
             
             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#101818] p-3 rounded-xl border border-[#27393a]">
                   <span className="block text-[#566e70] text-[10px] uppercase font-bold mb-1">Material</span>
                   <span className="text-white text-sm font-medium">100% Algodón Premium</span>
                </div>
                <div className="bg-[#101818] p-3 rounded-xl border border-[#27393a]">
                   <span className="block text-[#566e70] text-[10px] uppercase font-bold mb-1">Ajuste</span>
                   <span className="text-white text-sm font-medium">Regular / Unisex</span>
                </div>
             </div>
          </div>
          
          <div className="w-full flex gap-3 mt-4 pt-4 border-t border-[#27393a]">
             <Button variant="secondary" onClick={onClose} className="flex-1">
               Cerrar
             </Button>
             <Button variant="primary" onClick={onCustomize} className="flex-1">
               Personalizar
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Views ---

const GalleryView = ({ 
  onSelectProduct, 
  onAddToCart 
}: { 
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void; 
}) => {
  const [filter, setFilter] = useState('Todos');
  const [sortOption, setSortOption] = useState('popular');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const sortedProducts = useMemo(() => {
    const products = [...MOCK_PRODUCTS];
    if (sortOption === 'price_asc') {
      return products.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_desc') {
      return products.sort((a, b) => b.price - a.price);
    }
    // 'popular' keeps default order for this mock
    return products;
  }, [sortOption]);

  return (
    <div className="animate-fade-in">
       {/* Hero Section */}
       <section className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#162121] to-[#101818] border border-border-dark p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">Nueva Temporada</span>
          <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
            Galería de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Diseños</span>
          </h1>
          <p className="text-[#9ababc] text-lg font-normal leading-relaxed max-w-lg">
            Explora miles de diseños creados por la comunidad. Compra directamente o usa una base para personalizar tu propia obra maestra en 3D.
          </p>
        </div>
      </section>

      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 sticky top-[72px] z-40 bg-[#101818]/95 backdrop-blur py-2 -mx-2 px-2 md:mx-0 md:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {['Todos', 'Cyberpunk', 'Neon', 'Minimalista'].map((f) => (
             <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-xl text-sm font-bold transition-colors ${filter === f ? 'bg-primary text-[#101818] shadow-[0_0_10px_rgba(0,242,255,0.2)]' : 'bg-[#27393a] text-white hover:bg-[#344c4d] hover:text-primary'}`}
             >
              {f}
             </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[#9ababc] text-sm hidden sm:inline">Ordenar por:</span>
          <div className="relative">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-[#27393a] text-white text-sm border-none rounded-lg focus:ring-1 focus:ring-primary py-2 pl-3 pr-8 appearance-none cursor-pointer hover:bg-[#344c4d] transition-colors outline-none"
            >
              <option value="popular">Populares</option>
              <option value="price_asc">Precio: Bajo a Alto</option>
              <option value="price_desc">Precio: Alto a Bajo</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#9ababc]">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {sortedProducts.map((product) => (
          <div key={product.id} className="group relative flex flex-col gap-4 rounded-2xl bg-card-dark p-4 border border-border-dark hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,242,255,0.1)]">
            <div 
              className="relative w-full aspect-[4/5] bg-[#0f1515] rounded-xl overflow-hidden flex items-center justify-center group-hover:bg-black cursor-pointer"
              onClick={() => onSelectProduct(product)}
            >
              <div className="absolute top-3 right-3 z-20 text-white/50 hover:text-primary transition-colors">
                <Heart size={20} />
              </div>
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url("${product.image}")` }}
              ></div>
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
                <Button variant="secondary" fullWidth onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}>
                  Vista Rápida
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors truncate">{product.name}</h3>
                <p className="text-primary font-bold text-lg">${product.price.toFixed(2)}</p>
              </div>
              <p className="text-[#9ababc] text-xs">Por <span className="text-white hover:underline cursor-pointer">{product.author}</span></p>
            </div>

            <div className="flex gap-2 mt-auto pt-2 border-t border-border-dark/50">
              <Button variant="secondary" className="flex-1" onClick={() => onSelectProduct(product)}>Personalizar</Button>
              <Button variant="primary" className="w-10 px-0" onClick={() => onAddToCart(product)}><ShoppingCart size={20} /></Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
          onCustomize={() => {
            onSelectProduct(quickViewProduct);
            setQuickViewProduct(null);
          }}
        />
      )}
    </div>
  );
};

const ProductDetailsView = ({ 
  product, 
  onBack, 
  onAddToCart 
}: { 
  product: Product; 
  onBack: () => void; 
  onAddToCart: (p: Product, quantity: number, color: string, size: string) => void;
}) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [color, setColor] = useState(product.baseColor);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-8 h-full">
      {/* Left: 3D Visualizer */}
      <div className="lg:w-2/3 h-[50vh] lg:h-[70vh] bg-card-dark rounded-3xl border border-border-dark overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors bg-black/30 backdrop-blur px-3 py-1.5 rounded-lg">
            <ArrowLeft size={16} /> Volver
          </button>
        </div>
        <Scene3D color={color} imageUrl={product.image} />
        <div className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs pointer-events-none">
          Arrastra para rotar • Scroll para zoom
        </div>
      </div>

      {/* Right: Controls */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">{product.name}</h1>
          <p className="text-primary text-2xl font-bold">${product.price.toFixed(2)}</p>
          <p className="text-[#9ababc] text-sm mt-4 leading-relaxed">{product.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-[#9ababc] uppercase tracking-wider block mb-2">Color Base</span>
            <div className="flex gap-3">
              {['#000000', '#ffffff', '#1a1a1a', '#ff0055', '#00f2ff', '#3b3b3b'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'} transition-all`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="relative group">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <div className="w-8 h-8 rounded-full border border-border-dark bg-gradient-to-br from-red-500 via-green-500 to-blue-500 flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">+</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-[#9ababc] uppercase tracking-wider block mb-2">Talle</span>
            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL', '2XL'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${selectedSize === s ? 'bg-primary text-[#101818]' : 'bg-[#27393a] text-white hover:bg-[#344c4d]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-border-dark">
             <div className="flex items-center gap-4 mb-4">
               <span className="text-[#9ababc] text-sm">Cantidad</span>
               <div className="flex items-center bg-[#27393a] rounded-lg">
                 <button className="px-3 py-1 text-white hover:text-primary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                 <span className="text-white w-8 text-center">{quantity}</span>
                 <button className="px-3 py-1 text-white hover:text-primary" onClick={() => setQuantity(quantity + 1)}>+</button>
               </div>
             </div>
             <Button fullWidth onClick={() => onAddToCart(product, quantity, color, selectedSize)}>
                Agregar al Carrito - ${(product.price * quantity).toFixed(2)}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartView = ({ 
  cart, 
  onRemove, 
  onCheckout, 
  onBack 
}: { 
  cart: CartItem[]; 
  onRemove: (id: string) => void; 
  onCheckout: () => void;
  onBack: () => void;
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <ShoppingCart size={64} className="text-[#27393a]" />
        <h2 className="text-2xl font-bold text-white">Tu carrito está vacío</h2>
        <Button onClick={onBack}>Volver a la Galería</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-white mb-8">Tu Carrito</h1>
      
      <div className="grid gap-4 mb-8">
        {cart.map((item) => (
          <div key={item.cartId} className="bg-card-dark border border-border-dark p-4 rounded-xl flex items-center gap-4">
            <div className="w-20 h-20 bg-black rounded-lg overflow-hidden shrink-0">
               {/* In a real app we'd render the 3D snapshot here, using static image for now */}
               <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-white font-bold">{item.name}</h3>
              <div className="flex items-center gap-2 text-sm text-[#9ababc] mt-1">
                <span>Talle: {item.size}</span>
                <span className="w-1 h-1 rounded-full bg-[#9ababc]"></span>
                <div className="flex items-center gap-1">
                   Color: <div className="w-3 h-3 rounded-full border border-white/20" style={{backgroundColor: item.customColor}}></div>
                </div>
              </div>
            </div>

            <div className="text-right mr-4">
              <div className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</div>
              <div className="text-xs text-[#9ababc]">Cant: {item.quantity}</div>
            </div>

            <button 
              onClick={() => onRemove(item.cartId)}
              className="text-red-500/50 hover:text-red-500 p-2 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card-dark border border-border-dark p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[#9ababc]">Total Estimado</span>
          <span className="text-3xl font-black text-primary">${total.toFixed(2)}</span>
        </div>
        <Button fullWidth onClick={onCheckout}>Proceder al Pago</Button>
      </div>
    </div>
  );
};

const CheckoutView = ({ 
  cart, 
  onSuccess,
  onBack
}: { 
  cart: CartItem[]; 
  onSuccess: () => void; 
  onBack: () => void;
}) => {
  const [details, setDetails] = useState<UserDetails>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp Message
    const orderItems = cart.map(i => `- ${i.name} (x${i.quantity}) [${i.size}]`).join('%0A');
    const message = `Hola MedicaLife!!. Esta es mi consulta:%0A%0A*NUEVO PEDIDO*%0A------------------%0A${orderItems}%0A------------------%0ATotal: $${total.toFixed(2)}%0A%0A*DATOS DE ENVÍO*%0ACliente: ${details.fullName}%0AEmail: ${details.email}%0ADirección: ${details.address}, ${details.city} (${details.zip})`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+541124661859&text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    onSuccess();
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#9ababc] hover:text-white mb-6">
        <ArrowLeft size={16} /> Volver al Carrito
      </button>

      <div className="bg-card-dark border border-border-dark p-8 rounded-3xl">
        <h2 className="text-2xl font-black text-white mb-6">Finaliza tu Pedido</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input 
                label="Nombre Completo" 
                required 
                placeholder="Juan Pérez"
                value={details.fullName}
                onChange={e => setDetails({...details, fullName: e.target.value})}
             />
             <Input 
                label="Email" 
                type="email" 
                required 
                placeholder="tu@email.com"
                value={details.email}
                onChange={e => setDetails({...details, email: e.target.value})}
             />
          </div>
          <Input 
             label="Dirección" 
             required 
             placeholder="Av. Corrientes 1234"
             value={details.address}
             onChange={e => setDetails({...details, address: e.target.value})}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input 
                label="Ciudad" 
                required 
                placeholder="CABA"
                value={details.city}
                onChange={e => setDetails({...details, city: e.target.value})}
             />
             <Input 
                label="Código Postal" 
                required 
                placeholder="1043"
                value={details.zip}
                onChange={e => setDetails({...details, zip: e.target.value})}
             />
          </div>

          <div className="pt-6 border-t border-border-dark mt-6">
             <Button fullWidth className="h-14 text-lg">
                <span className="flex items-center gap-2">
                  <ExternalLink size={20} /> Enviar Pedido por WhatsApp
                </span>
             </Button>
             <p className="text-center text-xs text-[#566e70] mt-4">
               Serás redirigido a WhatsApp para confirmar los detalles del pago y envío con nuestro equipo.
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const SuccessView = ({ onReset }: { onReset: () => void }) => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
       <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,242,255,0.3)]">
         <CheckCircle size={48} className="text-primary" />
       </div>
       <h1 className="text-4xl font-black text-white mb-4">¡Pedido Iniciado!</h1>
       <p className="text-[#9ababc] text-lg mb-8">
         Gracias por tu compra. Hemos abierto un chat de WhatsApp para coordinar el pago y el envío. Si no se abrió automáticamente, verifica tus pop-ups.
       </p>
       <div className="flex gap-4">
         <Button onClick={onReset} fullWidth>Volver a la Galería</Button>
       </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [view, setView] = useState<ViewState>('gallery');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAnimatingCart, setIsAnimatingCart] = useState(false);

  const addToCart = (product: Product, quantity: number = 1, color: string, size: string) => {
    const newItem: CartItem = {
      ...product,
      cartId: Math.random().toString(36).substr(2, 9),
      quantity,
      size,
      customColor: color
    };
    setCart([...cart, newItem]);
    
    // Trigger animation
    setIsAnimatingCart(true);
    setTimeout(() => {
      setIsAnimatingCart(false);
    }, 500);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.cartId !== id));
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('details');
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#101818] text-white selection:bg-primary selection:text-[#101818]">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-solid border-border-dark bg-[#101818]/95 backdrop-blur-md px-4 lg:px-10 py-3">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 cursor-pointer" onClick={() => setView('gallery')}>
            <div className="flex items-center gap-3 text-white group">
              <div className="w-8 h-8 text-primary transition-transform group-hover:rotate-12">
                 <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                 </svg>
              </div>
              <h2 className="text-white text-xl font-black leading-tight tracking-[-0.015em]">Fatality.Co</h2>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 ml-4">
              <button onClick={() => setView('gallery')} className={`text-sm font-bold border-b-2 py-5 transition-colors ${view === 'gallery' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-primary'}`}>
                Galería
              </button>
              <button className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">Comunidad</button>
            </nav>
          </div>

          <div className="flex flex-1 justify-end items-center gap-4 lg:gap-6">
            {/* Search - Visual Only */}
            <label className="hidden lg:flex flex-col min-w-40 h-10 w-64 group relative">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-transparent group-focus-within:border-primary/50 transition-colors bg-[#27393a]">
                <div className="text-[#9ababc] flex items-center justify-center pl-4 pr-2">
                  <Search size={20} />
                </div>
                <input className="flex w-full min-w-0 flex-1 bg-transparent text-white border-none focus:ring-0 placeholder:text-[#9ababc] px-0 text-sm focus:outline-none" placeholder="Buscar diseños..." />
              </div>
            </label>

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                 onClick={() => setView('cart')}
                 className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[#27393a] text-white hover:bg-[#344c4d] hover:text-primary transition-all duration-300 relative ${isAnimatingCart ? 'scale-125 bg-[#344c4d] text-primary shadow-[0_0_20px_rgba(0,242,255,0.6)] ring-2 ring-primary/50' : ''}`}
              >
                <ShoppingCart size={20} className={`transition-transform duration-300 ${isAnimatingCart ? 'rotate-[-15deg]' : ''}`} />
                {cartItemCount > 0 && (
                   <span className={`absolute top-1 right-1 h-2.5 w-2.5 bg-primary rounded-full shadow-[0_0_8px_#00f2ff] flex items-center justify-center text-[8px] text-black font-bold transition-all ${isAnimatingCart ? 'scale-150' : 'animate-pulse'}`}>
                   </span>
                )}
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#27393a] text-white hover:bg-[#344c4d] hover:text-primary transition-colors">
                <User size={20} />
              </button>
              <button className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-[#27393a] text-white">
                 <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 lg:px-10 py-8">
        {view === 'gallery' && (
          <GalleryView 
            onSelectProduct={navigateToProduct} 
            onAddToCart={(p) => addToCart(p, 1, p.baseColor, 'M')} 
          />
        )}
        
        {view === 'details' && selectedProduct && (
          <ProductDetailsView 
            product={selectedProduct} 
            onBack={() => setView('gallery')}
            onAddToCart={addToCart}
          />
        )}

        {view === 'cart' && (
          <CartView 
            cart={cart}
            onRemove={removeFromCart}
            onCheckout={() => setView('checkout')}
            onBack={() => setView('gallery')}
          />
        )}

        {view === 'checkout' && (
          <CheckoutView 
            cart={cart}
            onBack={() => setView('cart')}
            onSuccess={() => {
              setCart([]);
              setView('success');
            }}
          />
        )}

        {view === 'success' && (
          <SuccessView onReset={() => setView('gallery')} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0d1212] border-t border-border-dark py-10 px-4 lg:px-10 mt-auto">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <span className="text-lg font-bold">Fatality.Co</span>
            </div>
            <p className="text-[#9ababc] text-sm">Diseño de camisetas 3D y marketplace.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-[#9ababc] hover:text-primary text-sm transition-colors" href="#">Términos</a>
            <a className="text-[#9ababc] hover:text-primary text-sm transition-colors" href="#">Privacidad</a>
            <a className="text-[#9ababc] hover:text-primary text-sm transition-colors" href="#">Soporte</a>
          </div>
          <div className="text-[#566e70] text-sm">
            © 2023 Fatality.Co
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;