export const BUILDINGS = [
  {
    id: "uid", 
    name: "UID – United Institute of Design", 
    shortCode: "UID",
    floors: [1, 2, 3, 4, 5, 6],
    rooms: 30, 
    type: "academic", 
    color: "#E8A87C", 
    roofColor: "#C47A52",
    x: -10, z: -60, w: 38, d: 28,
    facilities: ['Design Studios', '3D Printers', 'Gallery', 'AC'],
    description: "6 floors · 30 design studios & classrooms · Architecture, Fashion, Product Design",
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    status: 'high-traffic'
  },
  {
    id: "uit", 
    name: "UIT – United Institute of Technology", 
    shortCode: "UIT",
    floors: [1, 2, 3, 4, 5],
    rooms: 15, 
    type: "academic", 
    color: "#7EB8D4", 
    roofColor: "#4A90B8",
    x: 52, z: -48, w: 42, d: 32,
    facilities: ['Engineering Labs', 'Robotics Center', 'Workshop'],
    description: "5 floors · 15 classrooms · Engineering & Technology",
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    status: 'available'
  },
  {
    id: "uwsl", 
    name: "UWSL – United World School of Law", 
    shortCode: "UWSL",
    floors: [1, 2, 3, 4], 
    rooms: 20, 
    type: "academic", 
    color: "#9B8DC4", 
    roofColor: "#6B5A9E",
    x: 52, z: 10, w: 40, d: 24,
    facilities: ['Moot Court', 'Law Library', 'Seminar Hall'],
    description: "4 floors · 20 classrooms · Law School",
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    status: 'available'
  },
  {
    id: "ksd", 
    name: "KSD – Karnavati School of Dentistry", 
    shortCode: "KSD",
    floors: [1, 2, 3, 4], 
    rooms: 25, 
    type: "academic", 
    color: "#72C8A0", 
    roofColor: "#3E9E72",
    x: 68, z: -82, w: 36, d: 24,
    description: "4 floors · 25 labs & classrooms · Dental Sciences",
    facilities: ['Dental Clinic', 'Anatomy Lab', 'Pathology Lab'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    status: 'available'
  },
  {
    id: "dome", 
    name: "Dome Auditorium", 
    shortCode: "Dome",
    floors: [1, 2], 
    rooms: 1, 
    type: "special", 
    color: "#C0C8D8", 
    roofColor: "#8090B0",
    x: 18, z: -55, w: 22, d: 22, isDome: true,
    description: "Iconic dome auditorium · 1200 seat capacity",
    facilities: ['AV System', 'Central AC', 'VVIP Lounge'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    status: 'live-event'
  },
  {
    id: "mess", 
    name: "Mess / Cafeteria", 
    shortCode: "Mess",
    floors: [1, 2], 
    rooms: 3, 
    type: "facility", 
    color: "#F0C87A", 
    roofColor: "#C8A030",
    x: -8, z: -28, w: 22, d: 18,
    description: "2 floors · Cafeteria & Dining Hall",
    facilities: ['Food Court', 'Outdoor Seating', 'Juice Bar'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    status: 'high-traffic'
  },
  {
    id: "gym", 
    name: "Gymnasium", 
    shortCode: "GYM",
    floors: [1, 2], 
    rooms: 4, 
    type: "sports", 
    color: "#A8D8A0", 
    roofColor: "#60A858",
    x: 16, z: 62, w: 16, d: 14,
    description: "2 floors · Fully equipped gymnasium",
    facilities: ['Cardio Zone', 'Strength Training', 'Yoga Room'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    status: 'available'
  }
];

export const ROOMS = {
  'uid': [
    { id: 'UID-101', name: 'Design Studio 1', floor: '1F', capacity: 40, status: 'Occupied', amenities: ['Plotters', 'AC'], bookedBy: 'Fashion Design 101' },
    { id: 'UID-201', name: 'Mac Lab', floor: '2F', capacity: 30, status: 'Available', amenities: ['iMacs', 'WiFi'], nextAvailable: 'Now' }
  ],
  'uit': [
    { id: 'UIT-101', name: 'CS Core Lab', floor: '1F', capacity: 60, status: 'Occupied', amenities: ['Ethernet', 'AC'], bookedBy: 'Data Structures' }
  ]
};

export const MARKERS = [
  { id: 'm1', type: 'cafeteria', buildingId: 'mess', name: 'Central Mess', coordinates: { x: 0, y: 0 }, status: 'high-traffic', pulseColor: 'red' },
  { id: 'm2', type: 'event', buildingId: 'dome', name: 'Innovation Summit', coordinates: { x: 0, y: 0 }, status: 'live-event', pulseColor: 'orange' },
  { id: 'm5', type: 'shop', buildingId: 'uit', name: 'Tech Store', coordinates: { x: 0, y: 0 }, status: 'available', pulseColor: 'blue' }
];

export const FRIEND_LOCATIONS = [
  { studentId: 'f1', name: 'Krish', coordinates: { x: 0, y: 0 }, buildingId: 'uid', floor: '3F', lastUpdated: '2 min ago', avatarColor: 'purple' },
  { studentId: 'f3', name: 'Rahul', coordinates: { x: 0, y: 0 }, buildingId: 'uit', floor: 'GF', lastUpdated: 'Just now', avatarColor: 'blue' }
];

export const TYPE_META = {
  academic:  { color: "#7EB8D4", label: "Academic" },
  hostel:    { color: "#F4A6A0", label: "Hostel" },
  facility:  { color: "#F0C87A", label: "Facility" },
  sports:    { color: "#A8D8A0", label: "Sports" },
  workshop:  { color: "#B8A878", label: "Workshop" },
  special:   { color: "#C0C8D8", label: "Special" },
};
