import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Bell, 
  Users,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useUserShopperz } from '@/context/user/UserShopperzContext';
import { RETAIL_CATEGORIES } from '@/data/shopperzData';

function ProductCard({ product, idx, addToCart }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    if (product.stockCount > 0) {
      addToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: idx * 0.05 }}
      className="group relative bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all"
    >
      {/* Stock Badge Layer */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.stockCount === 0 ? (
          <span className="px-3 py-1 bg-slate-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">SOLD OUT</span>
        ) : product.stockCount <= 5 ? (
          <span className="px-3 py-1 bg-orange-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest animate-pulse">ONLY {product.stockCount} LEFT</span>
        ) : product.totalSold > 100 ? (
          <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
            <Sparkles size={8} /> BESTSELLER
          </span>
        ) : null}
      </div>

      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stockCount === 0 ? 'grayscale opacity-50' : ''}`}
        />
        <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-6 space-y-4 text-left">
        <div>
          <div className="flex justify-between items-start">
            <h5 className="font-syne font-black text-sm uppercase italic tracking-tighter leading-none group-hover:text-orange-600 transition-colors">{product.name}</h5>
            <div className="flex items-center gap-1 text-slate-400">
              <Star size={10} fill={product.rating > 4.5 ? "#FF9500" : "transparent"} className={product.rating > 4.5 ? "text-orange-500" : ""} />
              <span className="text-[9px] font-black">{product.rating}</span>
            </div>
          </div>
          <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mt-2">₹{product.price}</p>
        </div>

        {product.bulkDeal && (
          <div className="p-3 bg-orange-50 dark:bg-orange-600/10 border border-orange-100 dark:border-orange-600/20 rounded-2xl flex items-center justify-between group/deal cursor-pointer hover:bg-orange-100 transition-all">
            <div className="flex items-center gap-2">
              <Users size={12} className="text-orange-600" />
              <p className="text-[8px] font-black uppercase tracking-widest text-orange-700 dark:text-orange-400">Group Deal: Buy {product.bulkDeal.min}+ → ₹{product.bulkDeal.price}</p>
            </div>
            <ChevronRight size={10} className="text-orange-300 group-hover/deal:translate-x-1 transition-transform" />
          </div>
        )}

        <button 
          onClick={handleAdd}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all ${
            product.stockCount === 0 
            ? 'bg-slate-100 dark:bg-white/5 text-slate-400' 
            : isAdded 
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white active:scale-95'
          }`}
        >
          {product.stockCount === 0 ? (
            <><Bell size={14} /> Notify Me</>
          ) : isAdded ? (
            <><CheckCircle2 size={14} /> Added!</>
          ) : (
            <><ShoppingCart size={14} /> Add to Cart</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function StoreSection({ searchQuery }) {
  const { products, addToCart } = useUserShopperz();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = products.filter(p => {
    const isVisible = p.isAvailable !== false;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return isVisible && matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
        {RETAIL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${
              activeCategory === cat 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
              : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            idx={idx} 
            addToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  );
}
