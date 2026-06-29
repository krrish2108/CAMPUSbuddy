export const CANTEENS = [
  { 
    id: 'c1', 
    name: 'Clockwise', 
    location: 'Main Campus', 
    description: 'Central hub for quick bites', 
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'c2', 
    name: 'Anticlockwise', 
    location: 'Main Campus', 
    description: 'Famous for beverages & talk time', 
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'c3', 
    name: 'Container (Main)', 
    location: 'Main Campus', 
    description: 'Open-air vibe with heavy meals', 
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'c4', 
    name: 'Container (Ext)', 
    location: 'Extended Campus', 
    description: 'Hot meals for the extensions', 
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80' 
  }
];

export const MENU_CATEGORIES = [
  'All', 'Beverages', 'Quick Bites', 'Meals', 'Combos', 'Healthy'
];

export const MENU_ITEMS = [
  // Beverages
  {
    id: 'm1',
    name: 'Masala Chai',
    category: 'Beverages',
    price: 15,
    prepTime: '2 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    totalOrders: 1250,
    calories: 80,
    isVeg: true,
    availableFrom: '08:00',
    availableTo: '21:00',
    inStock: true,
    tags: ['Bestseller', 'Student Favorite']
  },
  {
    id: 'm2',
    name: 'Cold Coffee',
    category: 'Beverages',
    price: 45,
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    totalOrders: 850,
    calories: 180,
    isVeg: true,
    availableFrom: '08:00',
    availableTo: '21:00',
    inStock: true,
    tags: ['Chilled']
  },
  {
    id: 'm8',
    name: 'Fresh Lime Soda',
    category: 'Beverages',
    price: 30,
    prepTime: '3 min',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    totalOrders: 420,
    calories: 90,
    isVeg: true,
    availableFrom: '09:00',
    availableTo: '20:00',
    inStock: true,
    tags: ['Refreshing']
  },

  // Quick Bites
  {
    id: 'm3',
    name: 'Paneer Tikka Sandwich',
    category: 'Quick Bites',
    price: 85,
    prepTime: '8 min',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    totalOrders: 620,
    calories: 320,
    isVeg: true,
    availableFrom: '10:00',
    availableTo: '20:00',
    inStock: true,
    tags: ['Spicy']
  },
  {
    id: 'm4',
    name: 'Veg Crispy Burger',
    category: 'Quick Bites',
    price: 95,
    prepTime: '7 min',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    totalOrders: 780,
    calories: 380,
    isVeg: true,
    availableFrom: '11:00',
    availableTo: '21:00',
    inStock: true,
    tags: ['Filling', 'Crunchy']
  },
  {
    id: 'm6',
    name: 'Maggi Noodles',
    category: 'Quick Bites',
    price: 35,
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    totalOrders: 3200,
    calories: 210,
    isVeg: true,
    availableFrom: '08:00',
    availableTo: '21:00',
    inStock: false,
    tags: ['Classic']
  },
  {
    id: 'm9',
    name: 'French Fries',
    category: 'Quick Bites',
    price: 60,
    prepTime: '6 min',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    totalOrders: 1100,
    calories: 310,
    isVeg: true,
    availableFrom: '10:00',
    availableTo: '21:00',
    inStock: true,
    tags: ['Salty']
  },

  // Meals
  {
    id: 'm5',
    name: 'Veg Deluxe Thali',
    category: 'Meals',
    price: 150,
    prepTime: '12 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    totalOrders: 410,
    calories: 680,
    isVeg: true,
    isSpecial: true, // Today's Special
    availableFrom: '12:00',
    availableTo: '15:30',
    inStock: true,
    tags: ['Full Meal', 'Popular']
  },
  {
    id: 'm10',
    name: 'Veg Hyderabadi Biryani',
    category: 'Meals',
    price: 160,
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    totalOrders: 1500,
    calories: 620,
    isVeg: true,
    availableFrom: '12:30',
    availableTo: '21:00',
    inStock: true,
    tags: ['Aromatic', 'Spicy']
  },
  {
    id: 'm11',
    name: 'Paneer Butter Masala',
    category: 'Meals',
    price: 140,
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    totalOrders: 580,
    calories: 520,
    isVeg: true,
    availableFrom: '12:00',
    availableTo: '21:00',
    inStock: true,
    tags: ['Creamy']
  },

  // Combos
  {
    id: 'm7',
    name: 'Pasta Combo',
    category: 'Combos',
    price: 180,
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    totalOrders: 280,
    calories: 550,
    isVeg: true,
    availableFrom: '11:00',
    availableTo: '20:00',
    inStock: true,
    tags: ['Value']
  },
  {
    id: 'm12',
    name: 'Paneer Burger Combo',
    category: 'Combos',
    price: 145,
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    totalOrders: 420,
    calories: 580,
    isVeg: true,
    availableFrom: '11:00',
    availableTo: '21:00',
    inStock: true,
    tags: ['Filling', 'Meal']
  },

  // Healthy
  {
    id: 'm13',
    name: 'Quinoa Salad',
    category: 'Healthy',
    price: 120,
    prepTime: '8 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    totalOrders: 150,
    calories: 240,
    isVeg: true,
    availableFrom: '10:00',
    availableTo: '19:00',
    inStock: true,
    tags: ['High Protein']
  },
  {
    id: 'm14',
    name: 'Fruit Platter',
    category: 'Healthy',
    price: 70,
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    totalOrders: 310,
    calories: 120,
    isVeg: true,
    availableFrom: '08:00',
    availableTo: '12:00',
    inStock: true,
    tags: ['Fresh']
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-0492',
    studentName: 'Krish Sharma',
    canteenId: 'c1',
    items: [
      { id: 'm1', name: 'Masala Chai', quantity: 1, price: 15 },
      { id: 'm4', name: 'Veg Crispy Burger', quantity: 1, price: 95 }
    ],
    total: 110,
    status: 'Preparing',
    timestamp: new Date().toISOString(),
    scheduledTime: '12:45 PM',
    paymentMethod: 'CAMPUS Wallet',
    paymentStatus: 'Paid'
  }
];

export const DASHBOARD_STATS = {
  activeQueueLimit: 25,
  currentQueue: 18,
  dailyRevenue: 5420,
  cancelledOrders: 3,
  peakHourData: [
    { hour: '9 AM', count: 12 },
    { hour: '10 AM', count: 18 },
    { hour: '11 AM', count: 32 },
    { hour: '12 PM', count: 45 },
    { hour: '1 PM', count: 50 },
    { hour: '2 PM', count: 28 },
    { hour: '3 PM', count: 15 },
    { hour: '4 PM', count: 22 }
  ]
};
