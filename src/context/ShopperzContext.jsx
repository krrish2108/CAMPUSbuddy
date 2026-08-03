import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getShopperzRetail, 
  getShopperzMarket, 
  placeShopperzOrder, 
  reserveMarketItem, 
  submitPrintJob, 
  getUserProfile 
} from '@/routes/user';
import { useInbox } from './InboxContext';
import { INITIAL_USER_DB } from '@/data/userData';

const ShopperzContext = createContext();

// Initial mock orders to enrich admin order queues instantly
const MOCK_STORE_ORDERS = [
  {
    id: 'ORD-8942',
    user: { name: 'Rohan Sharma', email: 'rohan.s@campus.edu', id: 'usr-001', identifier: '24BCE10023' },
    total: 1019,
    otp: '482910',
    status: 'Ready for Pickup',
    timestamp: '15 mins ago',
    items: [
      { name: 'KU Official Hoodie', quantity: 1, price: 899 },
      { name: 'A4 Premium Sheets (100pk)', quantity: 1, price: 120 }
    ]
  },
  {
    id: 'ORD-7731',
    user: { name: 'Ananya Singh', email: 'ananya.s@campus.edu', id: 'usr-007', identifier: '24BBT10112' },
    total: 890,
    otp: '991204',
    status: 'Ready for Pickup',
    timestamp: '1 hour ago',
    items: [
      { name: 'Engineering Compass Set', quantity: 1, price: 890 }
    ]
  },
  {
    id: 'ORD-6512',
    user: { name: 'Kabir Das', email: 'kabir.d@campus.edu', id: 'usr-006', identifier: '24ECE10405' },
    total: 2450,
    otp: '109283',
    status: 'Ready for Pickup',
    timestamp: '3 hours ago',
    items: [
      { name: 'Graphing Calculator TI-84', quantity: 1, price: 2450 }
    ]
  }
];

// Initial mock print jobs for admin print studio management
const MOCK_PRINT_JOBS = [
  {
    id: 'PRN-101',
    user: { name: 'Kushal Jain', email: 'kushal.j@campus.edu', id: 'usr-011', identifier: '24BCE10255' },
    name: 'Compiler_Design_Lab_Record.pdf',
    pages: 45,
    type: 'bw',
    copies: 1,
    cost: 90,
    status: 'Printing',
    submittedAt: 'Today, 10:40 AM'
  },
  {
    id: 'PRN-102',
    user: { name: 'Meera Reddy', email: 'meera.r@campus.edu', id: 'usr-015', identifier: '24BCL10034' },
    name: 'Architectural_Bridge_Layout_A3.pdf',
    pages: 12,
    type: 'color',
    copies: 2,
    cost: 240,
    status: 'Pending',
    submittedAt: 'Today, 11:15 AM'
  },
  {
    id: 'PRN-103',
    user: { name: 'Rohan Sharma', email: 'rohan.s@campus.edu', id: 'usr-001', identifier: '24BCE10023' },
    name: 'AI_Research_Paper_Final.docx',
    pages: 22,
    type: 'bw',
    copies: 1,
    cost: 44,
    status: 'Ready for Pickup',
    submittedAt: 'Yesterday'
  }
];

export function ShopperzProvider({ children }) {
  const { addMessage } = useInbox();
  const [activeSection, setActiveSection] = useState('store');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [printJobs, setPrintJobs] = useState(MOCK_PRINT_JOBS);
  const [marketListings, setMarketListings] = useState([]);
  const [storeOrders, setStoreOrders] = useState(MOCK_STORE_ORDERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isExamSeason, setIsExamSeason] = useState(true);
  const [user, setUser] = useState(null);

  // Initialize store inventory and marketplace records
  useEffect(() => {
    loadRetail();
    loadMarket();
    loadUser();
  }, []);

  // Fetch current authenticated user
  const loadUser = async () => {
    try {
      const res = await getUserProfile();
      if (res.success) setUser(res.data);
    } catch (e) {
      console.error('Error loading user profile');
    }
  };

  // Load retail products from data registry
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

  // Load peer-to-peer student marketplace listings
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

  // Create a new product item in campus store inventory
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

  // Modify attributes of an existing product
  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Delete product from store inventory
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Directly adjust stock unit counts for quick admin inventory management
  const adjustStock = (id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, (p.stockCount || 0) + delta);
        return { ...p, stockCount: newStock, isAvailable: newStock > 0 ? p.isAvailable : false };
      }
      return p;
    }));
  };

  // Restock all items below 5 units back to 50 units
  const resupplyAllLowStock = () => {
    setProducts(prev => prev.map(p => {
      if ((p.stockCount || 0) <= 5) {
        return { ...p, stockCount: 50, isAvailable: true };
      }
      return p;
    }));
  };

  // Cart operations for store checkout
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // Remove item from shopping cart
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // Checkout order and generate verification OTP code
  const checkout = async (total) => {
    try {
      const orderItems = cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price }));
      const res = await placeShopperzOrder({ items: orderItems, total });
      if (res.success) {
        setCart([]);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const newOrder = {
          ...res.data,
          id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
          otp,
          status: 'Ready for Pickup',
          timestamp: 'Just now',
          user: user || { name: 'Demo Student', email: 'student@campus.edu', identifier: '24BCE10000' }
        };
        setStoreOrders(prev => [newOrder, ...prev]);
        return { success: true, order: newOrder };
      }
    } catch (e) {
      console.error('Checkout failed');
    }
    return { success: false };
  };

  // Mark pending order as verified and collected by student
  const markStoreOrderCompleted = (orderId) => {
    setStoreOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Cancel or refund store order
  const cancelStoreOrder = (orderId) => {
    setStoreOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Print studio operations
  const addPrintJob = async (job) => {
    try {
      const res = await submitPrintJob({
        name: job.name,
        pages: job.pages,
        type: job.type || 'bw',
        cost: job.cost
      });
      if (res.success) {
        const newJob = {
          id: `PRN-${Math.floor(Math.random() * 900) + 100}`,
          user: user || { name: 'Demo Student', email: 'student@campus.edu', identifier: '24BCE10000' },
          name: job.name || 'document.pdf',
          pages: job.pages || 10,
          type: job.type || 'bw',
          cost: job.cost || 20,
          status: 'Pending',
          submittedAt: 'Just now'
        };
        setPrintJobs(prev => [newJob, ...prev]);
        return true;
      }
    } catch (e) {
      console.error('Print job submission failed');
    }
    return false;
  };

  // Update status of student print jobs
  const updateJobStatus = (jobId, status) => {
    setPrintJobs(prev => prev.map(job => job.id === jobId ? { ...job, status } : job));
  };

  // Peer-to-peer student market operations
  const reserveItem = async (itemId, studentId) => {
    try {
      const res = await reserveMarketItem(itemId, studentId);
      if (res.success) {
        setMarketListings(prev => prev.map(l => l.id === itemId ? { ...l, status: 'Reserved' } : l));
        return true;
      }
    } catch (e) {
      console.error('Reservation failed');
    }
    return false;
  };

  // Add a student listing to market
  const addMarketListing = (listing) => {
    const newListing = {
      id: `mkt-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Available',
      seller: user || { name: 'Current User', email: 'user@campus.edu', id: 'usr-001' },
      ...listing
    };
    setMarketListings(prev => [newListing, ...prev]);
    
    setTimeout(() => {
      addMessage({
        sender: 'KU Student',
        avatar: 'S',
        title: `Interested in your ${listing.title}`,
        preview: 'Hi! Is this still available? I can meet you at the library today.',
        type: 'market_inquiry',
        link: '/user/shopperz'
      });
    }, 5000);

    return true;
  };

  // Delete listing from student marketplace
  const deleteMarketListing = (id) => {
    setMarketListings(prev => prev.filter(l => l.id !== id));
  };

  // Update moderation status of market listings
  const updateMarketListingStatus = (id, newStatus) => {
    setMarketListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  // Fetch student details from global user database by name or identifier
  const getStudentDetails = (query) => {
    if (!query) return null;
    const searchStr = typeof query === 'object' ? (query.email || query.name || '') : query.toString();
    const clean = searchStr.toLowerCase().trim();
    
    // Check against global campus db in local storage or fallback to INITIAL_USER_DB
    let db = INITIAL_USER_DB;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campus_user_db');
      if (saved) {
        try { db = JSON.parse(saved); } catch (e) {}
      }
    }

    const match = db.find(u => 
      u.email.toLowerCase().includes(clean) || 
      u.name.toLowerCase().includes(clean) || 
      (u.identifier && u.identifier.toLowerCase().includes(clean))
    );

    if (match) return match;

    // Default synthesized profile if exact match not found
    return {
      id: 'usr-synth',
      name: typeof query === 'object' ? query.name : query,
      email: typeof query === 'object' ? (query.email || 'student@campus.edu') : `${query.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      role: 'STUDENT',
      department: 'Engineering & Computing',
      identifier: '24BCE10999',
      status: 'Active',
      phone: '+91 98000 12345',
      joined: 'August 2024',
      permissions: ['Shopperz Buying', 'Shopperz Selling', 'Library Access']
    };
  };

  // Auto-release expired item reservations every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setMarketListings(prev => prev.map(item => {
        if (item.reservedUntil && new Date(item.reservedUntil) < now) {
          return { ...item, reservedBy: null, reservedUntil: null, status: 'Available' };
        }
        return item;
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ShopperzContext.Provider value={{
      activeSection, setActiveSection,
      products, addProduct, updateProduct, deleteProduct, adjustStock, resupplyAllLowStock,
      cart, addToCart, removeFromCart, checkout,
      printJobs, addPrintJob, updateJobStatus,
      marketListings, reserveItem, addMarketListing, deleteMarketListing, updateMarketListingStatus,
      storeOrders, markStoreOrderCompleted, cancelStoreOrder,
      getStudentDetails,
      isExamSeason, isLoading, user
    }}>
      {children}
    </ShopperzContext.Provider>
  );
}

export function useShopperz() {
  return useContext(ShopperzContext);
}
