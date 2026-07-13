import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCanteens, getMenu, placeCaffinityOrder } from '@/routes/user';

const CaffinityContext = createContext();

export const CaffinityProvider = ({ children }) => {
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [canteens, setCanteens] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isCanteenSelecting, setIsCanteenSelecting] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Data Fetch
  useEffect(() => {
    loadCanteens();
    loadMenu();
    setIsCanteenSelecting(true);
  }, []);

  const loadCanteens = async () => {
    try {
      const res = await getCanteens();
      if (res.success) setCanteens(res.data);
    } catch (e) { console.error('Error loading canteens'); }
  };

  const loadMenu = async (canteenId = null) => {
    try {
      setIsLoading(true);
      const res = await getMenu(canteenId);
      if (res.success) {
        const normalized = res.data.map(item => ({
          ...item,
          isAvailable: item.isAvailable !== undefined ? item.isAvailable : (item.inStock !== false)
        }));
        setMenuItems(normalized);
      }
    } catch (e) {
      console.error('Error loading menu');
    } finally {
      setIsLoading(false);
    }
  };

  // Sync canteens view when selecting
  useEffect(() => {
    if (selectedCanteen) {
      loadMenu(selectedCanteen.id);
    }
  }, [selectedCanteen]);

  const toggleMenuItemAvailability = (id) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  };

  const addMenuItem = (newItem) => {
    const item = { ...newItem, id: `m${Date.now()}`, isAvailable: true };
    setMenuItems(prev => [item, ...prev]);
  };

  const editMenuItem = (id, updatedItem) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...updatedItem } : i));
  };

  const deleteMenuItem = (id) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  const selectCanteen = (canteen) => {
    setSelectedCanteen(canteen);
    localStorage.setItem('selected_canteen', JSON.stringify(canteen));
    setIsCanteenSelecting(false);
  };

  const resetCanteen = () => {
    setSelectedCanteen(null);
    localStorage.removeItem('selected_canteen');
    setIsCanteenSelecting(true);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (scheduledTime, paymentMethod, specialNote = '') => {
    const orderData = {
      items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
      canteenId: selectedCanteen?.id,
      scheduledTime: scheduledTime || 'As soon as possible',
      paymentMethod: paymentMethod || 'UPI',
      specialNote: specialNote
    };

    try {
      const res = await placeCaffinityOrder(orderData);
      if (res.success) {
        setOrders(prev => [res.data, ...prev]);
        clearCart();
        window.dispatchEvent(new Event('storage'));
        return res.data;
      }
    } catch (e) {
      console.error('Error placing order:', e);
      throw e;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    window.dispatchEvent(new Event('storage'));
  };

  // Automated Status Advancement (Demo Simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const newOrders = prevOrders.map(order => {
          if (order.status === 'Done') return order;

          const elapsedMs = new Date() - new Date(order.timestamp);
          const elapsedSecs = Math.floor(elapsedMs / 1000);

          let nextStatus = order.status;
          if (elapsedSecs >= 45) nextStatus = 'Done';
          else if (elapsedSecs >= 25) nextStatus = 'Ready';
          else if (elapsedSecs >= 10) nextStatus = 'Preparing';

          if (nextStatus !== order.status) {
            changed = true;
            return { ...order, status: nextStatus };
          }
          return order;
        });

        if (changed) {
          window.dispatchEvent(new Event('storage'));
          return newOrders;
        }
        return prevOrders;
      });
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const value = {
    selectedCanteen,
    selectCanteen,
    resetCanteen,
    isCanteenSelecting,
    cart,
    addToCart,
    updateQuantity,
    clearCart,
    orders,
    placeOrder,
    updateOrderStatus,
    menuItems,
    toggleMenuItemAvailability,
    deleteMenuItem,
    addMenuItem,
    editMenuItem,
    isLoading
  };

  return (
    <CaffinityContext.Provider value={value}>
      {children}
    </CaffinityContext.Provider>
  );
};

export const useCaffinity = () => {
  const context = useContext(CaffinityContext);
  if (!context) {
    throw new Error('useCaffinity must be used within a CaffinityProvider');
  }
  return context;
};
