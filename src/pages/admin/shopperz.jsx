import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit2,
  Package,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useShopperz } from '@/context/ShopperzContext';

const SEARCH_INSIGHTS = [
  { term: 'A3 Chart Paper', count: 142, trend: '+24%' },
  { term: 'Arduino Uno Base Kit', count: 89, trend: '+12%' },
  { term: 'Casio 991EX', count: 320, trend: '+45%' }
];

export default function ShopperzAdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, marketListings, deleteMarketListing } = useShopperz();
  const [activeTab, setActiveTab] = useState('Inventory Matrix');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredInventory = products.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAvailability = (id) => {
    const item = products.find(p => p.id === id);
    if (item) {
      updateProduct(id, { isAvailable: !item.isAvailable });
    }
  };

  const deleteItem = (id) => {
    deleteProduct(id);
  };
  
  const handleAddNewItem = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  return (
    <AdminLayout 
      title="Shopperz HQ" 
      subtitle="Inventory & Resource Management"
    >
      <div className="space-y-10 pb-20">
        
        {/* TABS */}
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-2">
          {['Inventory Matrix', 'Student Market', 'Demand Insights'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-orange-600 dark:text-orange-500' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="shop-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full shadow-[0_0_10px_#f97316]" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Inventory Matrix' && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* TOP BAR */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="relative w-full md:w-96 group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500 transition-colors" size={20} />
                   <input 
                     type="text" 
                     placeholder="Search inventory..." 
                     className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/5 focus:border-orange-500/50 rounded-full py-4 pl-16 pr-6 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all shadow-inner"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                 </div>
                 <button 
                   onClick={handleAddNewItem}
                   className="w-full md:w-auto px-8 py-4 bg-orange-500 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3"
                 >
                   <Plus size={18} /> Add Retail Item
                 </button>
              </div>

              {/* INVENTORY LIST */}
              <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[40px] shadow-2xl">
                 <table className="w-full text-left border-collapse min-w-[800px]">
                   <thead>
                     <tr className="border-b border-slate-100 dark:border-white/5">
                       <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] bg-slate-50 dark:bg-white/5">Product Info</th>
                       <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] bg-slate-50 dark:bg-white/5">Location Config</th>
                       <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] bg-slate-50 dark:bg-white/5">Stock & Price</th>
                       <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] bg-slate-50 dark:bg-white/5">Status</th>
                       <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] bg-slate-50 dark:bg-white/5 text-right">Actions</th>
                     </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {filteredInventory.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-md">
                                <img src={item.image} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{item.name}</p>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 block">{item.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                             <select 
                                className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 outline-none appearance-none focus:border-orange-500 cursor-pointer"
                                defaultValue={item.location}
                             >
                                <option>Campus Store - Main</option>
                                <option>Campus Store - East</option>
                                <option>Library Block</option>
                             </select>
                          </td>
                          <td className="p-6">
                            <p className="text-lg font-black italic uppercase text-orange-600 dark:text-orange-500 tracking-tighter">₹{item.price}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1.5 ${item.stockCount <= 5 ? 'text-red-500' : 'text-slate-400'}`}>
                              <Package size={12} /> {item.stockCount} Units
                            </p>
                          </td>
                          <td className="p-6">
                             <button 
                                onClick={() => toggleAvailability(item.id)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all ${
                                  item.isAvailable ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-100 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-100 dark:border-red-500/20'
                                }`}
                             >
                                {item.isAvailable ? <><CheckCircle2 size={12}/> Listed</> : <><AlertTriangle size={12}/> Delisted</>}
                             </button>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => { setEditingProduct(item); setIsProductModalOpen(true); }}
                                 className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                               >
                                 <Edit2 size={16} />
                               </button>
                               <button onClick={() => deleteItem(item.id)} className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                 <Trash2 size={16} />
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {activeTab === 'Student Market' && (
            <motion.div 
              key="student-market"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Student Market</h3>
                   <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Manage P2P Listings</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {marketListings?.map(item => (
                   <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[30px] p-6 shadow-xl relative group">
                      <div className="absolute top-4 right-4 z-10">
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${item.title}?`)) {
                              deleteMarketListing(item.id);
                            }
                          }}
                          className="w-8 h-8 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">₹{item.price}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                         <span>Seller: {item.seller?.name || 'Unknown'}</span>
                         <span>{item.status}</span>
                      </div>
                   </div>
                 ))}
                 
                 {(!marketListings || marketListings.length === 0) && (
                   <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[30px]">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Student Listings found</p>
                   </div>
                 )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Demand Insights' && (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[45px] p-10 shadow-xl dark:shadow-2xl space-y-8">
                 <div>
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                     <Search className="text-orange-500" size={24} /> Missing Inventory
                   </h3>
                   <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Top searched items currently NOT in stock</p>
                 </div>
                 
                 <div className="space-y-4">
                   {SEARCH_INSIGHTS.map((insight, i) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-white/5 group hover:border-orange-500/30 transition-colors">
                       <div>
                         <p className="font-bold text-slate-900 dark:text-white text-sm">{insight.term}</p>
                         <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">{insight.count} Searches this week</p>
                       </div>
                       <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-lg text-[10px] font-black tracking-widest border border-orange-100 dark:border-orange-500/20">
                         <TrendingUp size={12} /> {insight.trend}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-[45px] p-10 shadow-3xl text-white flex flex-col justify-between relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/20 rounded-full blur-[60px] group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                 <div className="relative z-10 space-y-4">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-xl mb-6">
                     <ShoppingBag size={28} />
                   </div>
                   <h3 className="text-4xl font-black italic uppercase tracking-tighter">Stock Health<br/>Warning</h3>
                   <p className="text-white/80 font-bold text-sm leading-relaxed max-w-sm">3 items in the `Technical` category are running dangerously low on stock. Consider placing a resupply order today to avoid student friction.</p>
                 </div>
                 <button className="relative z-10 mt-8 py-5 bg-white text-orange-600 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                   Generate Resupply Report
                 </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        
        <ProductEditorModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          editingProduct={editingProduct}
          onSave={(productData) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, productData);
            } else {
              addProduct(productData);
            }
            setIsProductModalOpen(false);
          }}
        />
      </div>
    </AdminLayout>
  );
}

function ProductEditorModal({ isOpen, onClose, editingProduct, onSave }) {
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Stationery', stockCount: 10, image: ''
  });

  useEffect(() => {
    if (editingProduct) setFormData(editingProduct);
    else setFormData({ name: '', price: '', category: 'Stationery', stockCount: 10, image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=200' });
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[30px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-white/10 relative">
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={16} /></button>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-6">{editingProduct ? 'Edit Retail Item' : 'New Retail Item'}</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSave({...formData, price: Number(formData.price), stockCount: Number(formData.stockCount)}); }} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Product Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-orange-500" placeholder="e.g. Graphing Calculator" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Price (₹)</label>
              <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-orange-500" placeholder="e.g. 250" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Stock Count</label>
              <input required type="number" min="0" value={formData.stockCount} onChange={e => setFormData({...formData, stockCount: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-orange-500" placeholder="e.g. 10" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-orange-500 appearance-none">
              <option>Stationery</option><option>Apparel</option><option>Lab Equipment</option><option>Electronics</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Image URL</label>
            <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-orange-500" placeholder="https://..." />
          </div>
          <button type="submit" className="w-full mt-4 py-4 bg-orange-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all">
            {editingProduct ? 'Save Changes' : 'Create Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
