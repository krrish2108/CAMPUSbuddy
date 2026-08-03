export const TICKET_CATEGORIES = [
  { id: 'network', name: 'Network & WiFi', icon: 'Globe' },
  { id: 'facilities', name: 'Facilities & Maintenance', icon: 'Tool' },
  { id: 'ac', name: 'AC & Cooling', icon: 'Wind' },
  { id: 'security', name: 'Security & Safety', icon: 'Shield' },
  { id: 'hostel', name: 'Hostel Issues', icon: 'Home' },
  { id: 'others', name: 'Others', icon: 'MoreHorizontal' }
];

export const DEPARTMENTS = [
  { 
    id: 'netops', 
    name: 'Network Operations', 
    lead: 'Mr. Rajesh Kumar', 
    role: 'Chief Network Engineer', 
    phone: '+91 98711 22334', 
    ext: 'Ext. 4021', 
    email: 'rajesh.k@campus.edu',
    category: 'network',
    keywords: ['wifi', 'network', 'internet', 'router', 'switch', 'ethernet', 'connection', 'offline', 'bandwidth', 'ip', 'server', 'ping', 'lan', 'wlan', 'connectivity']
  },
  { 
    id: 'maint', 
    name: 'Campus Maintenance', 
    lead: 'Mr. Vivek Sharma', 
    role: 'Senior Facilities Supervisor', 
    phone: '+91 98222 33445', 
    ext: 'Ext. 4055', 
    email: 'vivek.s@campus.edu',
    category: 'facilities',
    keywords: ['water', 'leak', 'plumbing', 'pipe', 'tap', 'washroom', 'toilet', 'door', 'window', 'glass', 'furniture', 'bench', 'carpenter', 'repair', 'broken', 'elevator', 'lift', 'stuck', 'mechanical']
  },
  { 
    id: 'ac_cool', 
    name: 'HVAC & Cooling Systems', 
    lead: 'Mr. Anil Mehta', 
    role: 'Lead AC & Electrical Specialist', 
    phone: '+91 98333 77889', 
    ext: 'Ext. 4080', 
    email: 'anil.m@campus.edu',
    category: 'ac',
    keywords: ['ac', 'air conditioner', 'cooler', 'cooling', 'vent', 'hot', 'heat', 'compressor', 'chiller', 'fan', 'suffocation', 'temperature', 'hvac', 'exhaust', 'gas']
  },
  { 
    id: 'it', 
    name: 'IT & Server Helpdesk', 
    lead: 'Ms. Priya Nair', 
    role: 'System Admin Specialist', 
    phone: '+91 98450 11223', 
    ext: 'Ext. 4100', 
    email: 'priya.n@campus.edu',
    category: 'others',
    keywords: ['computer', 'pc', 'lab', 'software', 'projector', 'printer', 'screen', 'keyboard', 'mouse', 'cpu', 'gpu', 'portal', 'login', 'bug', 'system']
  },
  { 
    id: 'sec', 
    name: 'Campus Security & Safety', 
    lead: 'Insp. Vikram Chauhan', 
    role: 'Chief Security Officer', 
    phone: '+91 98100 99887', 
    ext: 'Ext. 1000 (Emergency)', 
    email: 'security.command@campus.edu',
    category: 'security',
    keywords: ['security', 'safety', 'guard', 'gate', 'unauthorized', 'theft', 'loss', 'lost', 'found', 'emergency', 'hazard', 'fire', 'smoke', 'intruder', 'patrol', 'cctv', 'camera']
  },
  { 
    id: 'hostel', 
    name: 'Hostel & Mess Operations', 
    lead: 'Dr. S. K. Verma', 
    role: 'Chief Warden & Hygiene Inspector', 
    phone: '+91 98555 44332', 
    ext: 'Ext. 2010', 
    email: 'warden@campus.edu',
    category: 'hostel',
    keywords: ['hostel', 'mess', 'food', 'hygiene', 'warden', 'room', 'bed', 'dorm', 'dinner', 'lunch', 'breakfast', 'canteen', 'water cooler', 'pest', 'cleanliness']
  }
];

export const MOCK_TICKETS = [
  {
    id: 'PBX-0942',
    title: 'Core Switch Down - Library',
    description: 'All nodes on Floor 2 of the Central Library are offline since 9 AM.',
    location: 'Central Library, Floor 2',
    category: 'network',
    priority: 'Critical',
    upvotes: 42,
    progress: 65,
    reporter: { name: 'Rohan Sharma', anonymous: false },
    assignedTo: 'netops',
    aiConfidence: '99%',
    status: 'InProgress',
    eta: '2 Hours remaining',
    aiSummary: "Core network switch failure affecting all WiFi on Library Floor 2. Auto-priority: Critical ⚠️",
    media: [
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
    ],
    timeline: [
      { step: 'Raised', time: 'Today 9:00 AM', completed: true },
      { step: 'Triaged', time: 'Today 9:15 AM', completed: true },
      { step: 'Assigned', time: 'Today 9:30 AM (Network Ops)', completed: true },
      { step: 'In Progress', time: 'ETA: 2 Hours (65% Completed)', completed: false, active: true },
      { step: 'Resolved', time: 'Pending', completed: false }
    ],
    resolution: null,
    createdAt: '2026-04-10T09:00:00Z'
  },
  {
    id: 'PBX-0951',
    title: 'Water Leakage in I-Block',
    description: 'Heavy water leakage from AC vent in Room 301.',
    location: 'I Block, Room 301',
    category: 'ac',
    priority: 'High',
    upvotes: 8,
    progress: 15,
    reporter: { name: 'Anonymous Student', anonymous: true },
    assignedTo: 'maint',
    aiConfidence: '96%',
    status: 'Raised',
    aiSummary: "Water leakage in AC vents detected. Possible electrical hazard. Priority: High.",
    media: [],
    timeline: [
      { step: 'Raised', time: 'Just now', completed: true, active: true },
      { step: 'Triaged', time: 'Pending', completed: false },
      { step: 'Assigned', time: 'Pending', completed: false },
      { step: 'In Progress', time: 'Pending', completed: false },
      { step: 'Resolved', time: 'Pending', completed: false }
    ],
    resolution: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'PBX-0821',
    title: 'A-Block Elevator Stuck',
    description: 'Elevator 2 in A-Block was making grinding noises and eventually got stuck between floors 3 and 4.',
    location: 'A Block, Elevator 2',
    category: 'facilities',
    priority: 'Critical',
    upvotes: 89,
    progress: 100,
    reporter: { name: 'Aman Varma', anonymous: false },
    assignedTo: 'maint',
    aiConfidence: '98%',
    status: 'Resolved',
    aiSummary: "Mechanical failure in elevator hoist motor. Emergency maintenance required.",
    media: [],
    timeline: [
      { step: 'Raised', time: 'Last Tuesday', completed: true },
      { step: 'Resolved', time: 'Last Wednesday', completed: true, active: true }
    ],
    resolution: {
      solvedBy: 'Campus Maintenance Team',
      desc: 'Replaced faulty hoist motor and updated safety sensors. Full inspection completed.',
      duration: '24 Hours'
    },
    createdAt: '2026-04-03T10:00:00Z'
  },
  {
    id: 'PBX-0789',
    title: 'Hostel Mess Hygiene Issue',
    description: 'Found several hygiene violations in the Boys Hostel Mess during lunch hours.',
    location: 'Boys Hostel Mess',
    category: 'hostel',
    priority: 'High',
    upvotes: 112,
    progress: 100,
    reporter: { name: 'Anonymous Student', anonymous: true },
    assignedTo: 'hostel',
    aiConfidence: '95%',
    status: 'Resolved',
    aiSummary: "Food safety concern reported. Requires independent audit and sanitization.",
    media: [],
    timeline: [
      { step: 'Raised', time: '2 Weeks ago', completed: true },
      { step: 'Resolved', time: '10 Days ago', completed: true, active: true }
    ],
    resolution: {
      solvedBy: 'Food Safety Audit Committee',
      desc: 'Audit conducted. Mess vendor fined. New sanitization protocols implemented and kitchen deep-cleaned.',
      duration: '4 Days'
    },
    createdAt: '2026-03-25T13:00:00Z'
  },
  {
    id: 'PBX-0654',
    title: 'Lab 4 Server Upgrade',
    description: 'Cloud Compute servers in Lab 4 were crashing during deep learning model training.',
    location: 'Engineering Block, Lab 4',
    category: 'network',
    priority: 'High',
    upvotes: 45,
    progress: 100,
    reporter: { name: 'Dr. Karishma', anonymous: false },
    assignedTo: 'it',
    aiConfidence: '94%',
    status: 'Resolved',
    aiSummary: "Server hardware bottleneck detected. Upgrading RAM and GPU clusters recommended.",
    media: [],
    timeline: [
      { step: 'Raised', time: '1 Month ago', completed: true },
      { step: 'Resolved', time: '3 Weeks ago', completed: true, active: true }
    ],
    resolution: {
      solvedBy: 'IT Helpdesk & NVIDIA Support',
      desc: 'RAM upgraded to 256GB per node. GPU clusters re-balanced. Software drivers updated to v535.',
      duration: '1 Week'
    },
    createdAt: '2026-03-10T09:00:00Z'
  }
];

export const ANALYTICS_DATA = {
  averageResolutionTime: '3h 20m',
  topCategory: 'Network & WiFi',
  peakHours: [
    { hour: '9 AM', count: 12 },
    { hour: '11 AM', count: 8 },
    { hour: '1 PM', count: 5 },
    { hour: '3 PM', count: 18 },
    { hour: '5 PM', count: 22 },
    { hour: '7 PM', count: 10 }
  ],
  departmentPerformance: [
    { name: 'Network Ops', score: 4.8 },
    { name: 'Maintenance', score: 4.2 },
    { name: 'Security', score: 4.9 }
  ]
};
