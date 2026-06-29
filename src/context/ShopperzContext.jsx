import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getShopperzRetail, 
  getShopperzMarket, 
  placeShopperzOrder, 
  reserveMarketItem, 
  submitPrintJob, 
  getPrintJobs,
  getUserProfile 
} from '@/routes/user';

const ShopperzContext = createContext();

export function ShopperzProvider({ children }) {
  const [activeSection, setActiveSection] = useState('store'); // 'store' | 'print' | 'market'
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [printJobs, setPrintJobs] = useState([]);
  const [marketListings, setMarketListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExamSeason, setIsExamSeason] = useState(true);
  const [user, setUser] = useState(null);

  // 0. LOAD DATA FROM BACKEND
  useEffect(() => {
    loadRetail();
    loadMarket();
    loadPrintJobs();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await getUserProfile();
      if (res.success) setUser(res.data);
    } catch (e) {
      console.error('Error loading user profile');
    }
  };

  const loadPrintJobs = async () => {
    try {
      const res = await getPrintJobs();
      if (res.success) setPrintJobs(res.data);
    } catch (e) {
      console.error('Error loading print jobs');
    }
  };

  const loadRetail = async () => {
    try {
      const res = await getShopperzRetail();
      if (res.success) {
        const normalized = res.data.map(item => ({
          ...item,
          isAvailable: item.isAvailable !== undefined ? item.isAvailable : true
        }));
        setProducts(normalized);
      }
    } catch (e) {
      console.error('Error loading retail data');
    }
  };

  const loadMarket = async () => {
    try {
      const res = await getShopperzMarket();
      if (res.success) setMarketListings(res.data);
    } catch (e) {
      console.error('Error loading market data');
    } finally {
      setIsLoading(false);
    }
  };
  const addProduct = (product) => {
    const newProduct = {
      id: `rp-${Math.floor(Math.random() * 9000) + 1000}`,
      rating: 5.0,
      totalSold: 0,
      isAvailable: true,
      ...product
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // 1. CART LOGIC
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const checkout = async (total) => {
    try {
       const orderItems = cart.map(item => ({ id: item.id, quantity: item.quantity }));
       const res = await placeShopperzOrder({ items: orderItems, total });
       if (res.success) {
         setCart([]);
         loadRetail(); // Refresh stock levels
         return true;
       }
    } catch (e) {
      console.error('Checkout failed');
    }
    return false;
  };

  // 2. PRINT LOGIC
  const addPrintJob = async (job) => {
    try {
      const res = await submitPrintJob({
        name: job.name,
        pages: job.pages,
        type: job.type || 'bw',
        cost: job.cost
      });
      if (res.success) {
        loadPrintJobs();
        return true;
      }
    } catch (e) {
      console.error('Print job submission failed');
    }
    return false;
  };

  const updateJobStatus = (jobId, status) => {
    setPrintJobs(prev => prev.map(job => job.id === jobId ? { ...job, status } : job));
  };

  // 3. MARKETPLACE LOGIC
  const reserveItem = async (itemId, studentId) => {
    try {
      const res = await reserveMarketItem(itemId, studentId);
      if (res.success) {
        loadMarket();
        return true;
      }
    } catch (e) {
      console.error('Reservation failed');
    }
    return false;
  };

  // 4. CLEANUP (Auto-release P2P reservations)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setMarketListings(prev => prev.map(item => {
        if (item.reservedUntil && new Date(item.reservedUntil) < now) {
          return { ...item, reservedBy: null, reservedUntil: null };
        }
        return item;
      }));
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <ShopperzContext.Provider value={{
      activeSection, setActiveSection,
      products, addProduct, updateProduct, deleteProduct,
      cart, addToCart, removeFromCart, checkout,
      printJobs, addPrintJob,
      marketListings, reserveItem,
      isExamSeason, isLoading, user
    }}>
      {children}
    </ShopperzContext.Provider>
  );
}

export function useShopperz() {
  return useContext(ShopperzContext);
}
