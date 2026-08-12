import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Search, 
  MapPin, 
  Plus, 
  MessageSquare, 
  Clock, 
  ChevronRight,
  Filter,
  CheckCircle,
  Image as ImageLucide,
  DollarSign,
  Box,
  X,
  Send
} from 'lucide-react';
import { useUserShopperz } from '@/context/user/UserShopperzContext';
import { MARKET_CATEGORIES } from '@/data/shopperzData';

export default function MarketSection({ searchQuery }) {
  const { marketListings, reserveItem, addMarketListing, user } = useUserShopperz();
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Listing Modal State
  const [showModal, setShowModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [sortByPrice, setSortByPrice] = useState('none'); // 'none' | 'asc' | 'desc'
  
  // Form State
  const [formData, setFormData] = useState({ title: '', price: '', location: '' });
  const [uploadImage, setUploadImage] = useState(null);

  // Chat Modal State
  const [activeChat, setActiveChat] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  
  // To avoid SSR issues with createPortal
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filteredListings = (marketListings || [])
    .filter(l => {
      const matchesSearch = l.title.toLowerCase().includes((searchQuery || '').toLowerCase());
      const matchesCategory = activeCategory === 'All' || l.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortByPrice === 'asc') return a.price - b.price;
      if (sortByPrice === 'desc') return b.price - a.price;
      return 0;
    });

  const handleReserve = async (item) => {
    if (!user) {
      alert("Please login to reserve items.");
      return;
    }
    if (window.confirm(`Are you sure you want to reserve "${item.title}"? \n\nThis will lock the item for 2 hours while you connect with the seller.`)) {
      const success = await reserveItem(item.id, user.id);
      if (success) {
        setStatusMessage(`Success! You have reserved "${item.title}".`);
        setTimeout(() => setStatusMessage(null), 5000);
      } else {
        alert("Failed to reserve item. It might have been taken.");
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitListing = () => {
    if (!formData.title || !formData.price) {
      alert("Please fill out the title and price.");
      return;
    }
    
    addMarketListing({
      title: formData.title,
      price: Number(formData.price),
      location: formData.location || 'Campus Wide',
      image: uploadImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
      category: activeCategory === 'All' ? 'Electronics' : activeCategory,
      condition: 'Like New',
      negotiable: true,
      originalPrice: null,
      semester: null
    });
    
    setShowModal(false);
    setFormData({ title: '', price: '', location: '' });
    setUploadImage(null);
    setStatusMessage("Listing posted successfully!");
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const openChat = (item) => {
    setActiveChat(item);
    setChatMessages([
      { id: 1, sender: item.seller?.name || 'Seller', text: `Hi, you interested in the ${item.title}?`, time: 'Just now' }
    ]);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: chatInput, time: 'Just now' }]);
    setChatInput('');
    
    // Simulate seller reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now()+1, sender: activeChat.seller?.name || 'Seller', text: 'Sounds good! Where do you want to meet?', time: 'Just now' }]);
    }, 1500);
  };

  const toggleSort = () => {
    setSortByPrice(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-8 pb-20 relative">
      
      {/* Toast Notification */}
      {mounted && createPortal(
        <AnimatePresence>
          {statusMessage && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[3000] bg-slate-900 border border-orange-600 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center">
                <CheckCircle size={16} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">{statusMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
            {MARKET_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                  : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-3">
            <div 
              onClick={toggleSort}
              className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border ${
                sortByPrice !== 'none' 
                ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 border-transparent'
              }`}
            >
               <Filter size={12} /> {sortByPrice === 'none' ? 'Filter' : sortByPrice === 'asc' ? 'Price ↑' : 'Price ↓'}
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-slate-900 transition-all"
            >
               <Plus size={14} /> Sell Something
            </button>
         </div>
      </div>

      {/* Listings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredListings.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`group bg-white dark:bg-slate-900 rounded-[40px] border p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition-all ${
              item.status === 'Reserved' ? 'border-orange-600/50 bg-orange-50/5 dark:bg-orange-600/5' : 'border-slate-100 dark:border-white/5'
            }`}
          >
            <div className="relative w-full md:w-32 aspect-square md:aspect-auto rounded-3xl overflow-hidden bg-slate-100 shrink-0">
               <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
               {item.status === 'Reserved' && (
                 <div className="absolute inset-0 bg-orange-600/40 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="text-white animate-spin-slow" size={24} />
                 </div>
               )}
            </div>

            <div className="flex-1 space-y-4">
               <div>
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="font-syne font-black text-sm uppercase italic tracking-tighter leading-tight group-hover:text-orange-600 transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                           <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                             item.condition === 'Like New' ? 'bg-green-100 text-green-600 dark:bg-green-600/20' : 
                             item.condition === 'Good' ? 'bg-blue-100 text-blue-600 dark:bg-blue-600/20' : 'bg-slate-100 text-slate-500'
                           }`}>
                             {item.condition}
                           </span>
                           {item.negotiable && (
                             <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest">Negotiable</span>
                           )}
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-lg font-syne font-black text-slate-900 dark:text-white">₹{item.price}</p>
                        {item.originalPrice && <p className="text-[9px] font-bold text-slate-400 line-through">₹{item.originalPrice}</p>}
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-2">
                     <Clock size={12} className="text-slate-400" />
                     <span>Posted by {typeof item.seller === 'string' ? item.seller : item.seller?.name || 'KU Student'}</span>
                  </div>
                  {item.semester && (
                    <div className="flex items-center gap-2">
                       <Tag size={12} className="text-slate-400" />
                       <span>Sem {item.semester}</span>
                    </div>
                  )}
               </div>

               <div className="flex gap-3 mt-auto">
                  {((typeof item.seller === 'string' ? item.seller : item.seller?.name) === user?.name || item.seller?.id === 'u123' || (user?.id && item.seller?.id === user?.id)) ? (
                     <div className="flex-1 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 text-slate-500">
                        <Tag size={12} /> Your Listing
                     </div>
                  ) : (
                     <>
                        <button 
                          disabled={item.status === 'Reserved'}
                          onClick={() => item.status === 'Available' && handleReserve(item)}
                          className={`flex-1 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-all ${
                            item.status === 'Reserved' 
                            ? 'bg-orange-100 text-orange-600 cursor-not-allowed' 
                            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white'
                          }`}
                        >
                           {item.status === 'Reserved' ? (
                             <><Clock size={12} /> Reserved</>
                           ) : (
                             <>I Want This <ChevronRight size={12} /></>
                           )}
                        </button>
                        <button 
                          onClick={() => openChat(item)}
                          className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-orange-600 hover:bg-orange-600/10 transition-all"
                        >
                           <MessageSquare size={16} />
                        </button>
                     </>
                  )}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FLOAT SELL BUTTON - Mobile shortcut */}
      <motion.button 
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onClick={() => setShowModal(true)}
         className="fixed bottom-10 right-10 md:hidden w-16 h-16 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
      >
         <Plus size={28} />
      </motion.button>

      {/* LIST ITEM MODAL (Portaled to document.body so it overlays Navbar) */}
      {mounted && createPortal(
        <AnimatePresence>
           {showModal && (
             <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   onClick={() => setShowModal(false)}
                   className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />
                <motion.div 
                   initial={{ y: 100, scale: 0.9, opacity: 0 }}
                   animate={{ y: 0, scale: 1, opacity: 1 }}
                   exit={{ y: 100, scale: 0.9, opacity: 0 }}
                   className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    <div className="p-10 space-y-10">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600">
                               <Box size={20} />
                             </div>
                             <div>
                               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">List an Item</h3>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Post your gear for the KU Market</p>
                             </div>
                          </div>
                          <button onClick={() => setShowModal(false)} className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                       </div>

                       <div className="space-y-6">
                          {/* PHOTO UPLOAD  */}
                          <div className="relative aspect-video rounded-[35px] border-4 border-dashed border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center text-center group cursor-pointer overflow-hidden">
                             <input 
                               type="file" 
                               accept="image/*"
                               onChange={handleImageUpload}
                               className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                             />
                             {uploadImage ? (
                               <img src={uploadImage} alt="Preview" className="w-full h-full object-cover" />
                             ) : (
                               <div className="p-6">
                                 <ImageLucide size={32} className="text-slate-300 dark:text-slate-600 group-hover:text-orange-600 transition-colors mx-auto" />
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-3">Upload Product Photos</p>
                               </div>
                             )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                <input 
                                  type="text" 
                                  value={formData.title}
                                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                                  placeholder="e.g. 5th Sem Books" 
                                  className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl font-bold text-sm outline-none focus:border-orange-600 text-slate-900 dark:text-white" 
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                                <div className="relative">
                                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                   <input 
                                     type="number" 
                                     value={formData.price}
                                     onChange={(e) => setFormData({...formData, price: e.target.value})}
                                     placeholder="0.00" 
                                     className="w-full p-4 pl-10 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl font-syne font-black text-sm outline-none focus:border-orange-600 text-slate-900 dark:text-white" 
                                   />
                                </div>
                             </div>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Meetup Location</label>
                             <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                  type="text" 
                                  value={formData.location}
                                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                                  placeholder="Suggest a campus spot" 
                                  className="w-full p-4 pl-10 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl font-bold text-sm outline-none focus:border-orange-600 text-slate-900 dark:text-white" 
                                />
                             </div>
                          </div>

                          <button onClick={submitListing} className="w-full py-5 bg-orange-600 text-white rounded-[25px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all">
                             <CheckCircle size={18} /> Post My Listing
                          </button>
                       </div>
                    </div>
                </motion.div>
             </div>
           )}
        </AnimatePresence>,
        document.body
      )}

      {/* P2P CHAT MODAL (Portaled) */}
      {mounted && createPortal(
        <AnimatePresence>
          {activeChat && (
            <div className="fixed inset-0 z-[2000] flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setActiveChat(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-white/10"
              >
                <div className="p-8 border-b dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                        {activeChat.seller?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">{activeChat.seller?.name || 'Seller'}</h3>
                        <p className="text-[10px] font-bold text-slate-400">Re: {activeChat.title}</p>
                      </div>
                   </div>
                   <button onClick={() => setActiveChat(null)} className="w-10 h-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                     <X size={20} />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                   {chatMessages.map((msg) => (
                     <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[80%] p-4 rounded-[20px] text-sm font-bold ${msg.sender === 'You' ? 'bg-orange-600 text-white rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'}`}>
                         {msg.text}
                         <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mt-2 text-right">{msg.time}</p>
                       </div>
                     </div>
                   ))}
                </div>

                <div className="p-6 border-t dark:border-white/10 bg-slate-50 dark:bg-slate-900 shrink-0">
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[25px] p-2 pr-2">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Type a message..." 
                      className="flex-1 bg-transparent px-4 font-bold text-sm outline-none text-slate-900 dark:text-white"
                    />
                    <button onClick={sendChatMessage} className="w-12 h-12 bg-orange-600 rounded-[20px] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                      <Send size={18} className="translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
