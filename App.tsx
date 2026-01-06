
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Leaf, 
  Plus, 
  Minus, 
  Trash2, 
  MessageCircle, 
  X, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  RotateCcw,
  User,
  Mail,
  Lock,
  Phone,
  Chrome
} from 'lucide-react';
import { Product, Category, CartItem, ChatMessage } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import { getShoppingAdvice } from './geminiService';

// --- Types for Animation ---
interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
  image: string;
}

// --- Sub-components ---

const Navbar: React.FC<{ 
  cartCount: number; 
  onCartClick: () => void;
  onAuthClick: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onFilterToggle: () => void;
  cartRef: React.RefObject<HTMLButtonElement | null>;
  isPulsing: boolean;
}> = ({ cartCount, onCartClick, onAuthClick, searchQuery, setSearchQuery, onFilterToggle, cartRef, isPulsing }) => (
  <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
            FreshKart
          </span>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search organic groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onFilterToggle}
            className="md:hidden p-2.5 rounded-full hover:bg-emerald-50 text-slate-600 transition-all"
          >
            <Filter size={24} />
          </button>
          
          <button 
            onClick={onAuthClick}
            className="p-2.5 rounded-full hover:bg-emerald-50 text-slate-600 transition-all"
          >
            <User size={24} />
          </button>

          <button 
            ref={cartRef}
            onClick={onCartClick}
            className="relative p-2.5 rounded-full hover:bg-emerald-50 text-slate-600 transition-all group"
          >
            <motion.div
              animate={isPulsing ? { 
                scale: [1, 1.4, 1],
                rotate: [0, -10, 10, 0],
                color: ['#475569', '#059669', '#475569']
              } : {}}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ShoppingCart size={24} />
            </motion.div>
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                  <p className="text-sm text-slate-500 mt-1">Join our organic community today.</p>
                </div>
                <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Register
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-sm" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-sm" />
                </div>
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="tel" placeholder="Phone Number" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-sm" />
                  </motion.div>
                )}
              </div>

              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold mt-8 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                {isLogin ? 'Sign In' : 'Join Now'} <ChevronRight size={18} />
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest text-slate-400">
                  <span className="bg-white px-4">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-sm font-medium">
                  <Chrome size={18} className="text-emerald-600" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-sm font-medium">
                  <Phone size={18} className="text-slate-600" /> Phone
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const FilterSidebar: React.FC<{
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  onClear: () => void;
}> = ({ activeCategory, setActiveCategory, priceRange, setPriceRange, maxPrice, onClear }) => (
  <div className="space-y-8 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm sticky top-28">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-slate-800">Filters</h3>
      <button 
        onClick={onClear}
        className="text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded-xl transition-all flex items-center gap-1.5 text-sm font-medium"
      >
        <RotateCcw size={14} /> Reset
      </button>
    </div>

    <div>
      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</h4>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
            activeCategory === 'All' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
              : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          All Items
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
              activeCategory === cat 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>

    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Price Range</h4>
        <span className="text-sm font-bold text-emerald-600">₹0 - ₹{priceRange[1]}</span>
      </div>
      <input 
        type="range"
        min="0"
        max={maxPrice}
        step="10"
        value={priceRange[1]}
        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        <span>₹0</span>
        <span>₹{maxPrice}</span>
      </div>
    </div>
  </div>
);

const ProductCard: React.FC<{ 
  product: Product; 
  onAdd: (p: Product, e: React.MouseEvent) => void;
}> = ({ product, onAdd }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -4 }}
    className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
  >
    <div className="relative overflow-hidden rounded-2xl aspect-square mb-4">
      <img 
        src={product.image} 
        alt={product.name}
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-2 right-2">
        <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          {product.category}
        </span>
      </div>
    </div>
    
    <div className="space-y-1">
      <h3 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
        {product.name}
      </h3>
      <p className="text-xs text-slate-500">{product.description}</p>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <div>
        <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
        <span className="text-xs text-slate-400 ml-1">/ {product.unit}</span>
      </div>
      <button
        onClick={(e) => onAdd(product, e)}
        className="bg-emerald-50 text-emerald-600 p-2.5 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90 shadow-sm"
      >
        <Plus size={20} />
      </button>
    </div>
  </motion.div>
);

// --- Main App Component ---

export default function App() {
  const maxProductPrice = Math.max(...PRODUCTS.map(p => p.price));
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxProductPrice]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Animation State
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [isCartPulsing, setIsCartPulsing] = useState(false);
  const cartIconRef = useRef<HTMLButtonElement | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [activeCategory, searchQuery, priceRange]);

  const addToCart = useCallback((product: Product, e: React.MouseEvent) => {
    // Start Animation
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newItem: FlyingItem = {
      id: Date.now(),
      startX: rect.left,
      startY: rect.top,
      image: product.image
    };
    setFlyingItems(prev => [...prev, newItem]);

    // Update Cart State
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Landing Effect (approx at the end of animation)
    setTimeout(() => {
      setIsCartPulsing(true);
      setTimeout(() => setIsCartPulsing(false), 500);
    }, 700);

    // Cleanup flying item
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== newItem.id));
    }, 1000);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearFilters = () => {
    setActiveCategory('All');
    setPriceRange([0, maxProductPrice]);
    setSearchQuery('');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newUserMsg: ChatMessage = { role: 'user', text: chatInput };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const aiResponse = await getShoppingAdvice(updatedHistory, PRODUCTS, cart);
      if (aiResponse) {
        setChatHistory(prev => [...prev, { role: 'model', text: aiResponse }]);
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting. Please try again later." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Refined Animation Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <AnimatePresence>
          {flyingItems.map((item) => {
            const cartRect = cartIconRef.current?.getBoundingClientRect();
            // Fallback if ref not ready, but usually it is.
            const targetX = cartRect ? cartRect.left + 12 : window.innerWidth - 60;
            const targetY = cartRect ? cartRect.top + 12 : 20;

            return (
              <motion.div
                key={item.id}
                initial={{ 
                  left: item.startX, 
                  top: item.startY, 
                  scale: 0.5, 
                  opacity: 0,
                  rotate: 0 
                }}
                animate={{ 
                  left: [item.startX, item.startX - 40, targetX], 
                  top: [item.startY, item.startY - 150, targetY],
                  scale: [0.5, 1.2, 0.4],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 45, 180, 360]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.9, 
                  times: [0, 0.4, 1],
                  ease: "easeInOut" 
                }}
                className="fixed w-14 h-14 rounded-2xl border-2 border-emerald-500 bg-white shadow-2xl overflow-hidden"
              >
                <img src={item.image} className="w-full h-full object-cover" alt="" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        cartRef={cartIconRef}
        isPulsing={isCartPulsing}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hero Section */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-200"
          >
            <div className="relative z-10 md:max-w-xl">
              <span className="bg-emerald-500/50 backdrop-blur-md border border-emerald-400/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                Fresh & Organic 🌿
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                Grab Fresh Groceries <br className="hidden md:block" />
                <span className="text-emerald-100">Deliver To Home</span>
              </h1>
              <p className="text-emerald-50/80 mb-8 text-lg">
                Your one-stop destination for farm-fresh organic produce and daily essentials.
              </p>
              <button className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-all active:scale-95 group shadow-xl">
                Shop Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:flex items-center justify-center opacity-20 pointer-events-none">
               <Leaf size={300} strokeWidth={1} />
            </div>
          </motion.div>
        </section>

        <div className="flex gap-8 relative">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <FilterSidebar 
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxProductPrice}
              onClear={clearFilters}
            />
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-2xl flex flex-col md:hidden p-6"
                >
                   <div className="flex items-center justify-between mb-8">
                     <h2 className="text-xl font-bold text-slate-800">Filters</h2>
                     <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-slate-100 rounded-full">
                       <X size={20} />
                     </button>
                   </div>
                   <FilterSidebar 
                    activeCategory={activeCategory}
                    setActiveCategory={(cat) => {
                      setActiveCategory(cat);
                      setIsFilterOpen(false);
                    }}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    maxPrice={maxProductPrice}
                    onClear={clearFilters}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {activeCategory === 'All' ? 'Our Products' : activeCategory}
                <span className="ml-3 text-sm font-medium text-slate-400">({filteredProducts.length} items)</span>
              </h2>
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode='popLayout'>
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={addToCart} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <Search className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-medium">No groceries found matches your search or filters.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-emerald-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-2 rounded-xl">
                    <ShoppingCart className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">My Basket</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="bg-slate-50 p-6 rounded-full mb-4">
                      <ShoppingCart size={48} />
                    </div>
                    <p className="font-medium">Your basket is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-emerald-600 font-bold hover:underline"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group"
                    >
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-slate-500 mb-2">₹{item.price} / {item.unit}</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Delivery</span>
                      <span className="text-emerald-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>₹{cartTotal}</span>
                    </div>
                  </div>
                  <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]">
                    Proceed to Checkout <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Floating Assistant */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isAiOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-emerald-100 flex flex-col overflow-hidden"
            >
              <div className="p-5 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">FreshKart AI</h3>
                    <p className="text-[10px] text-emerald-100 opacity-80 uppercase tracking-widest font-bold">Smart Shopping Assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAiOpen(false)}
                  className="p-2 hover:bg-black/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
                {chatHistory.length === 0 && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm text-emerald-600">
                      <MessageCircle size={32} />
                    </div>
                    <p className="text-slate-500 font-medium px-4">
                      Hello! I'm your AI assistant. Need recipe ideas or help finding ingredients?
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
                      {['Recipe for pasta?', 'Today specials?', 'Low carb diet?'].map(chip => (
                        <button 
                          key={chip}
                          onClick={() => setChatInput(chip)}
                          className="bg-white border border-slate-200 text-[11px] font-bold text-slate-600 px-3 py-1.5 rounded-full hover:border-emerald-500 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex gap-1">
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 py-1"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isAiLoading}
                    className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-colors ${
            isAiOpen ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white'
          }`}
        >
          {isAiOpen ? <X size={32} /> : <MessageCircle size={32} />}
        </motion.button>
      </div>
    </div>
  );
}
