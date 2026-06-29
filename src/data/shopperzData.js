// Shopperz Data Registry

export const RETAIL_CATEGORIES = ['All', 'Stationery', 'Apparel', 'Lab Equipment', 'Electronics'];

export const RETAIL_PRODUCTS = [
  {
    id: 'rp-001',
    name: 'KU Official Hoodie',
    price: 899,
    category: 'Apparel',
    rating: 4.8,
    stockCount: 12,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000',
    bulkDeal: { min: 5, price: 799 },
    totalSold: 142
  },
  {
    id: 'rp-002',
    name: 'A4 Premium Sheets (100pk)',
    price: 120,
    category: 'Stationery',
    rating: 4.5,
    stockCount: 3,
    image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=1000',
    bulkDeal: { min: 10, price: 95 },
    totalSold: 856
  },
  {
    id: 'rp-003',
    name: 'ED Drafter (Student Edition)',
    price: 340,
    category: 'Lab Equipment',
    rating: 4.2,
    stockCount: 0,
    image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&q=80&w=1000',
    totalSold: 89
  },
  {
    id: 'rp-004',
    name: 'Graphing Calculator TI-84',
    price: 2450,
    category: 'Electronics',
    rating: 4.9,
    stockCount: 8,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000',
    totalSold: 34
  },
  {
    id: 'rp-005',
    name: 'Pilot G2 Premium Pens (Set of 10)',
    price: 450,
    category: 'Stationery',
    rating: 4.9,
    stockCount: 25,
    image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=1000',
    totalSold: 1200
  },
  {
    id: 'rp-006',
    name: 'Multi-Subject Spiral Notebook',
    price: 280,
    category: 'Stationery',
    rating: 4.7,
    stockCount: 40,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=1000',
    totalSold: 450
  },
  {
    id: 'rp-007',
    name: 'Technical Drawing Fine-liners',
    price: 650,
    category: 'Stationery',
    rating: 4.6,
    stockCount: 15,
    image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=1000',
    totalSold: 210
  },
  {
    id: 'rp-008',
    name: 'Engineering Compass Set',
    price: 890,
    category: 'Lab Equipment',
    rating: 4.4,
    stockCount: 5,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=1000',
    totalSold: 88
  },
  {
    id: 'rp-009',
    name: 'Sticky Notes Mega-Pack',
    price: 150,
    category: 'Stationery',
    rating: 4.8,
    stockCount: 100,
    image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=1000',
    totalSold: 2300,
    bulkDeal: { min: 5, price: 120 }
  },
  {
    id: 'rp-010',
    name: 'Pastel Highlighters (Pack of 6)',
    price: 320,
    category: 'Stationery',
    rating: 4.9,
    stockCount: 20,
    image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=1000',
    totalSold: 670
  },
  {
    id: 'rp-011',
    name: 'Architecture Scale Ruler',
    price: 420,
    category: 'Lab Equipment',
    rating: 4.7,
    stockCount: 10,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000',
    totalSold: 45
  },
  {
    id: 'rp-012',
    name: 'Chemistry Lab Coat (M/L/XL)',
    price: 550,
    category: 'Lab Equipment',
    rating: 4.5,
    stockCount: 18,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000',
    totalSold: 310
  }
];

export const MARKET_CATEGORIES = ['All', 'Textbooks', 'Equipment', 'Notes', 'Apparel'];

export const MARKET_LISTINGS = [
  {
    id: 'ml-001',
    title: 'Data Structures 4th Edition',
    price: 180,
    originalPrice: 450,
    condition: 'Like New',
    category: 'Textbooks',
    semester: 3,
    seller: 'Rohan M.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000',
    negotiable: true,
    reservedUntil: null
  },
  {
    id: 'ml-002',
    title: 'Engineering Mechanics Drafter',
    price: 150,
    originalPrice: 400,
    condition: 'Good',
    category: 'Equipment',
    seller: 'Priya S.',
    image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&q=80&w=1000',
    negotiable: false,
    reservedUntil: null
  }
];

export const PRINT_PRICING = {
  blackAndWhite: 2, // per page
  color: 10,       // per page
  doubleSidedFactor: 1.8,
  priorityFee: 50
};
