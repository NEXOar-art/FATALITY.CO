import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, ArrowLeft, Trash2, Heart, ExternalLink, CheckCircle, Volume2, VolumeX, Plus, Minus } from 'lucide-react';
import { MOCK_PRODUCTS, COLOR_MAP } from './constants';
import { Product, CartItem, ViewState, UserDetails } from './types';
import { Scene3D } from './components/Scene3D';

// --- Global UI Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  fullWidth = false 
}: { 
  children?: React.ReactNode; 
  onClick?: React.MouseEventHandler<HTMLButtonElement>; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'nomad'; 
  className?: string;
  fullWidth?: boolean;
}) => {
  const baseStyle = "flex items-center justify-center rounded-lg text-sm font-extrabold transition-all duration-300 uppercase tracking-widest";
  const variants = {
    primary: "bg-[#ff3e3e] text-white hover:bg-white hover:text-[#ff3e3e] shadow-lg",
    secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20",
    outline: "border-2 border-white text-white hover:bg-white hover:text-black",
    danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20",
    nomad: "btn-nomad border border-white/20 text-white h-12"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} h-11 px-6 ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> & { label?: string }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-[10px] text-white/50 uppercase font-black tracking-widest ml-1">{label}</label>}
    {props.type === 'select' ? (
      <select 
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-all appearance-none"
        {...(props as any)}
      />
    ) : (
      <input 
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-all placeholder-white/20"
        {...props as any}
      />
    )}
  </div>
);

const TshirtSVG = ({ color, className = "" }: { color: string, className?: string }) => (
  <svg viewBox="0 0 512 512" className={`w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] ${className}`}>
    <defs>
      <linearGradient id="tshirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.85 }} />
      </linearGradient>
    </defs>
    <path fill="url(#tshirtGradient)" d="M378.5,64.5c-15.8,18.1-40.8,24.5-62.5,24.5c-22,0-47.8-6.8-63-25c-4-4.8-11-5.8-16.3-2.2l-96,64
    c-6.6,4.4-8.8,13.1-5,20.3l38.6,73.1c4.2,8,14.6,10.2,21.9,4.7l13.8-10.4v238.5c0,11,9,20,20,20h224c11,0,20-9,20-20V213.5l13.8,10.4
    c7.3,5.5,17.7,3.3,21.9-4.7l38.6-73.1c3.8-7.2,1.6-15.9-5-20.3l-96-64C417.5,58.3,407.5,55.8,378.5,64.5z" />
    <path fill="#000" opacity="0.12" style={{ mixBlendMode: 'multiply' }} d="M256,89c15.2,18.2,41,25,63,25s46.7-6.4,62.5-24.5l96,64l-38.6,73.1l-13.8-10.4v238.5H112V213.5l-13.8,10.4l-38.6-73.1l96-64c15.2,18.2,41,25,63,25S240.8,107.2,256,89z" />
  </svg>
);

// --- Sub-Views ---

const GalleryView = ({ onSelect }: { onSelect: (p: Product) => void }) => {
  return (
    <div className="animate-view">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4 uppercase leading-none">
          COLECCIÓN <span className="text-accent underline decoration-4 underline-offset-[12px]">RAMDOM</span>
        </h1>
        <p className="text-white/40 font-bold tracking-[0.5em] text-xs mt-4">STREETWEAR MINIMAL // BUENOS AIRES 2025</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {MOCK_PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            className="card-3d-container group"
            onClick={() => onSelect(product)}
          >
            <div className="card-3d-inner glass rounded-[32px] p-8 cursor-pointer flex flex-col items-center border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent">
              <div className="relative w-full aspect-[4/5] flex items-center justify-center mb-8 overflow-hidden rounded-2xl group">
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/[0.03] transition-colors duration-700 pointer-events-none z-0"></div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <TshirtSVG 
                    color="#ffffff" 
                    className="w-[92%] h-auto transition-all duration-700 group-hover:scale-105 group-hover:rotate-1" 
                  />
                </div>
                <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44%] aspect-square flex items-center justify-center z-20 pointer-events-none mt-1 transition-all duration-500 group-hover:scale-[1.15] group-hover:translate-y-[-5%] group-hover:brightness-125">
                  <img 
                    src={product.stamp} 
                    alt="Design" 
                    className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_20px_40px_rgba(255,62,62,0.4)] transition-all duration-700" 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.1] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
              
              <div className="w-full space-y-3 z-30">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-black text-lg italic uppercase truncate group-hover:text-accent transition-colors">{product.name}</h3>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Precio Final</span>
                    <span className="text-accent font-black text-3xl italic">${product.price.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="h-10 w-10 glass rounded-full flex items-center justify-center hover:bg-accent/20 transition-all hover:scale-110 active:scale-90">
                    <Heart size={16} className="text-white/40 group-hover:text-accent group-active:fill-accent" />
                  </div>
                </div>
              </div>
              <Button variant="nomad" fullWidth className="mt-8 transform transition-transform duration-500 group-hover:translate-z-[20px]">
                Personalizar 3D
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailsView = ({ 
  product, 
  onBack, 
  onAddToCart 
}: { 
  product: Product; 
  onBack: () => void; 
  onAddToCart: (p: Product, q: number, c: string, cn: string, s: string) => void;
}) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [colorName, setColorName] = useState('Blanco');
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="animate-view grid lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-8 glass h-[650px] rounded-[40px] relative overflow-hidden border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent shadow-2xl">
        <button onClick={onBack} className="absolute top-8 left-8 z-20 glass p-4 rounded-full hover:bg-white/20 transition-all hover:scale-110 active:scale-95">
          <ArrowLeft size={24} />
        </button>
        <Scene3D color={COLOR_MAP[colorName]} stampUrl={product.stamp} />
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20">Entorno 3D Interactivo // Motor 2.5</span>
        </div>
      </div>
      <div className="lg:col-span-4 space-y-10 py-4">
        <div>
          <span className="text-accent font-black tracking-[0.4em] text-[10px] uppercase mb-3 block">Fatality Ramdom // 2025</span>
          <h1 className="text-5xl font-black mb-2 uppercase italic leading-none">{product.name}</h1>
          <p className="text-accent text-4xl font-black mt-4 italic">${product.price.toLocaleString('es-AR')}</p>
          <div className="h-px bg-white/10 w-full my-8" />
          <p className="text-white/50 text-sm leading-relaxed font-medium">{product.description}</p>
        </div>
        <div className="space-y-8">
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-4 block">Seleccionar Color</label>
            <div className="flex gap-5">
              {Object.keys(COLOR_MAP).map((c) => (
                <button
                  key={c}
                  onClick={() => setColorName(c)}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-500 ${colorName === c ? 'border-accent scale-125 shadow-[0_0_20px_rgba(255,62,62,0.4)]' : 'border-white/10 hover:border-white/30'}`}
                  style={{ backgroundColor: COLOR_MAP[c] }}
                  title={c}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-4 block">Elegir Talle</label>
            <div className="grid grid-cols-5 gap-3">
              {['S', 'M', 'L', 'XL', '2XL'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`h-14 rounded-xl font-black text-xs transition-all duration-300 ${selectedSize === s ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'glass hover:bg-white/10'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-10">
             <Button 
                fullWidth 
                variant="primary" 
                className="h-16 text-xl italic"
                onClick={() => onAddToCart(product, quantity, COLOR_MAP[colorName], colorName, selectedSize)}
             >
                Agregar al Carrito
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
  onUpdateQuantity,
  onCheckout, 
  onBack 
}: { 
  cart: CartItem[]; 
  onRemove: (id: string) => void; 
  onUpdateQuantity: (id: string, newQty: number) => void;
  onCheckout: () => void;
  onBack: () => void;
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="animate-view flex flex-col items-center justify-center min-h-[50vh] gap-8">
        <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center">
          <ShoppingCart size={64} className="text-white/10" />
        </div>
        <h2 className="text-4xl font-black uppercase italic">El carrito está vacío</h2>
        <Button variant="outline" className="px-10" onClick={onBack}>Volver a la Galería</Button>
      </div>
    );
  }

  return (
    <div className="animate-view max-w-4xl mx-auto">
      <h1 className="text-5xl font-black uppercase italic mb-16 tracking-tighter">Mi Pedido</h1>
      <div className="space-y-6 mb-16">
        {cart.map((item) => (
          <div key={item.cartId} className="glass p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-8 border border-white/5 group hover:bg-white/[0.05] transition-all">
            <div className="w-28 h-28 glass rounded-2xl flex items-center justify-center shrink-0 p-2 overflow-hidden bg-white/[0.02]">
               <img src={item.stamp} alt={item.name} className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-black text-2xl uppercase italic leading-none mb-2">{item.name}</h3>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                  {item.colorName} // {item.size}
                </span>
                <div className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: item.customColor }} />
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4 bg-white/5 rounded-xl p-1 border border-white/10">
              <button 
                onClick={() => onUpdateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
                title="Restar unidad"
              >
                <Minus size={16} />
              </button>
              <span className="font-black text-lg w-8 text-center">{item.quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-accent/20 rounded-lg transition-colors text-white/50 hover:text-accent"
                title="Sumar unidad"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="text-right flex flex-col items-center sm:items-end gap-3 min-w-[150px]">
              <p className="text-accent font-black text-3xl italic tracking-tighter">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
              <button 
                onClick={() => onRemove(item.cartId)}
                className="text-white/10 hover:text-red-500 transition-all hover:scale-110"
                title="Eliminar producto"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="glass p-10 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-10 border border-white/5">
        <div className="text-center md:text-left">
          <p className="text-white/30 uppercase font-black tracking-[0.3em] text-[10px] mb-2">Resumen Total</p>
          <p className="text-5xl font-black text-accent italic tracking-tighter">${total.toLocaleString('es-AR')}</p>
        </div>
        <Button variant="primary" className="w-full md:w-auto px-16 h-16 text-xl italic" onClick={onCheckout}>Finalizar Compra</Button>
      </div>
    </div>
  );
};

const CheckoutView = ({ cart, onBack, onSuccess }: { cart: CartItem[]; onBack: () => void; onSuccess: () => void; }) => {
  const [details, setDetails] = useState<UserDetails>({
    fullName: '', dni: '', email: '', phone: '', neighborhood: '', city: '', province: '', zip: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let orderText = "🚀 *HOLA FATALITY!!! NUEVO PEDIDO CONFIRMADO* 🚀%0A%0A";
    
    orderText += "🛒 *PRODUCTOS*%0A";
    orderText += "-----------------------------------%0A";
    cart.forEach((item, index) => {
      orderText += `${index + 1}. 🔥 *${item.name}*%0A`;
      orderText += `   🎨 Color: ${item.colorName}%0A`;
      orderText += `   📏 Talle: ${item.size}%0A`;
      orderText += `   🔢 Cantidad: ${item.quantity}%0A`;
      orderText += `   💰 Subtotal: $${(item.price * item.quantity).toLocaleString('es-AR')}%0A`;
      orderText += "-----------------------------------%0A";
    });
    
    orderText += `%0A💰 *TOTAL A PAGAR: $${total.toLocaleString('es-AR')}*%0A%0A`;
    
    orderText += "📦 *DATOS PRECISOS DE ENVÍO*%0A";
    orderText += "-----------------------------------%0A";
    orderText += `👤 *Nombre:* ${details.fullName}%0A`;
    orderText += `🆔 *DNI:* ${details.dni}%0A`;
    orderText += `📧 *Email:* ${details.email}%0A`;
    orderText += `📱 *WhatsApp:* ${details.phone}%0A`;
    if (details.neighborhood) orderText += `🏘️ *Barrio/Zona:* ${details.neighborhood}%0A`;
    orderText += `🏙️ *Ciudad:* ${details.city}%0A`;
    orderText += `🌎 *Provincia:* ${details.province}%0A`;
    orderText += `📮 *C.P.:* ${details.zip}%0A`;
    orderText += "-----------------------------------%0A%0A";
    
    orderText += "💳 *MÉTODO DE PAGO:* Transferencia Inmediata%0A";
    orderText += "🏦 *ALIAS:* NEXOART%0A%0A";
    orderText += "🖤 *¡Quedo a la espera de la confirmación!*";

    const finalURL = `https://api.whatsapp.com/send?phone=+543489686939&text=${orderText}`;
    window.open(finalURL, '_blank');
    onSuccess();
  };

  return (
    <div className="animate-view max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-3 text-white/30 hover:text-white mb-10 group uppercase font-black tracking-widest text-[10px] transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Carrito
      </button>
      <div className="glass p-12 rounded-[40px] border border-white/5">
        <h2 className="text-4xl font-black italic uppercase mb-10 tracking-tighter">Detalles de Entrega</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <Input label="Nombre Completo *" required value={details.fullName} onChange={e => setDetails({...details, fullName: e.target.value})} />
          </div>
          <Input label="DNI *" required value={details.dni} onChange={e => setDetails({...details, dni: e.target.value})} />
          <Input label="Email *" type="email" required value={details.email} onChange={e => setDetails({...details, email: e.target.value})} />
          <Input label="WhatsApp *" required value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} />
          <Input label="Barrio / Zona" placeholder="Ej: Palermo" value={details.neighborhood} onChange={e => setDetails({...details, neighborhood: e.target.value})} />
          <Input label="Ciudad *" required value={details.city} onChange={e => setDetails({...details, city: e.target.value})} />
          <Input label="Provincia *" type="select" required value={details.province} onChange={e => setDetails({...details, province: (e.target as HTMLSelectElement).value})}>
            <option value="" disabled>Seleccionar provincia</option>
            {["CABA", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"].map(p => <option key={p} value={p}>{p}</option>)}
          </Input>
          <Input label="Código Postal *" required value={details.zip} onChange={e => setDetails({...details, zip: e.target.value})} />
          <div className="md:col-span-2 mt-6 space-y-8">
            <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 text-center">
              <p className="text-[9px] font-black text-white/40 mb-2 uppercase tracking-[0.4em]">Método de Pago</p>
              <p className="text-white/60 text-xs mb-2">Transferencia Inmediata</p>
              <p className="text-2xl font-black italic text-accent">Alias: NEXOART</p>
            </div>
            <Button fullWidth variant="primary" className="h-16 text-xl italic">Confirmar y Enviar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [view, setView] = useState<ViewState>('gallery');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Efecto para sincronizar el estado isMusicPlaying con el elemento de audio de forma segura
  useEffect(() => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (!audio) return;

    if (isMusicPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Ignoramos el AbortError que ocurre cuando una petición de play()
          // es interrumpida por una llamada a pause()
          if (error.name !== 'AbortError') {
            console.error("Playback failed:", error);
          }
        });
      }
      audio.volume = 0.4;
    } else {
      audio.pause();
    }
  }, [isMusicPlaying]);

  const toggleMusic = () => {
    setIsMusicPlaying(prev => !prev);
  };

  const addToCart = (product: Product, quantity: number, color: string, colorName: string, size: string) => {
    const newItem: CartItem = {
      ...product,
      cartId: Math.random().toString(36).substr(2, 9),
      quantity,
      size,
      customColor: color,
      colorName
    };
    setCart([...cart, newItem]);
    setView('cart');
  };

  const updateQuantity = (cartId: string, newQty: number) => {
    setCart(prevCart => prevCart.map(item => 
      item.cartId === cartId ? { ...item, quantity: newQty } : item
    ));
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent selection:text-white">
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-8 lg:px-16 py-6">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between">
          <div className="flex items-center gap-16 cursor-pointer" onClick={() => setView('gallery')}>
            <h1 className="text-4xl font-black italic tracking-tighter hover:text-accent transition-all hover:scale-105 active:scale-95">FATALITY</h1>
            <nav className="hidden md:flex gap-10 text-[10px] uppercase font-black tracking-[4px]">
              <button onClick={() => setView('gallery')} className={`hover:text-accent transition-colors ${view === 'gallery' ? 'text-accent' : 'text-white/40'}`}>Colección</button>
              <button className="hover:text-accent transition-colors text-white/20 cursor-not-allowed">Comunidad</button>
            </nav>
          </div>
          <div className="flex items-center gap-8">
            <button 
              onClick={toggleMusic}
              className="glass p-3.5 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
              title="Toggle Music"
            >
              {isMusicPlaying ? <Volume2 size={20} className="text-accent" /> : <VolumeX size={20} className="text-white/40" />}
            </button>
            <div className="relative cursor-pointer group p-2" onClick={() => setView('cart')}>
              <ShoppingCart size={24} className={`group-hover:text-accent transition-colors ${view === 'cart' ? 'text-accent' : ''}`} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#111] animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </div>
            <button className="md:hidden glass p-2 rounded-lg">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow w-full max-w-[1600px] mx-auto px-8 lg:px-16 py-16">
        {view === 'gallery' && <GalleryView onSelect={(p) => { setSelectedProduct(p); setView('details'); }} />}
        {view === 'details' && selectedProduct && <DetailsView product={selectedProduct} onBack={() => setView('gallery')} onAddToCart={addToCart} />}
        {view === 'cart' && <CartView cart={cart} onRemove={(id) => setCart(cart.filter(i => i.cartId !== id))} onUpdateQuantity={updateQuantity} onCheckout={() => setView('checkout')} onBack={() => setView('gallery')} />}
        {view === 'checkout' && <CheckoutView cart={cart} onBack={() => setView('cart')} onSuccess={() => { setCart([]); setView('success'); }} />}
        {view === 'success' && (
          <div className="animate-view flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
            <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(255,62,62,0.3)] border border-accent/20">
              <CheckCircle size={56} className="text-accent" />
            </div>
            <h1 className="text-6xl font-black italic uppercase mb-4 tracking-tighter">¡Pedido en Marcha!</h1>
            <p className="text-white/50 text-xl max-w-xl mx-auto mb-12 font-medium leading-relaxed">
              Hemos abierto WhatsApp para finalizar los detalles. Si la pestaña no se abrió automáticamente, asegúrate de permitir ventanas emergentes.
            </p>
            <Button variant="outline" className="px-16 h-16 text-lg italic" onClick={() => setView('gallery')}>Explorar más diseños</Button>
          </div>
        )}
      </main>
      <footer className="glass border-t border-white/5 py-20 px-8">
        <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black italic tracking-tighter mb-4">FATALITY</h2>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[6px]">Buenos Aires // Argentina</p>
          </div>
          <div className="flex gap-12">
            {['Instagram', 'Tiktok', 'WhatsApp'].map(social => (
              <a key={social} href="#" className="text-[10px] font-black uppercase tracking-[3px] text-white/30 hover:text-accent transition-colors">{social}</a>
            ))}
          </div>
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[4px]">© 2025 FATALITY // DISEÑADO PARA DURAR</p>
        </div>
      </footer>
    </div>
  );
};

export default App;