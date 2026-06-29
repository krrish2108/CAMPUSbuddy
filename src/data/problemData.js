export const TICKET_CATEGORIES = [
  { id: 'network', name: 'Network & WiFi', icon: 'Globe' },
  { id: 'facilities', name: 'Facilities & Maintenance', icon: 'Tool' },
  { id: 'ac', name: 'AC & Cooling', icon: 'Wind' },
  { id: 'security', name: 'Security & Safety', icon: 'Shield' },
  { id: 'hostel', name: 'Hostel Issues', icon: 'Home' },
  { id: 'others', name: 'Others', icon: 'MoreHorizontal' }
];

export const DEPARTMENTS = [
  { id: 'netops', name: 'Network Operations', lead: 'Mr. Rajesh' },
  { id: 'maint', name: 'Campus Maintenance', lead: 'Mr. Sharma' },
  { id: 'it', name: 'IT Helpdesk', lead: 'Ms. Priya' },
  { id: 'sec', name: 'Campus Security', lead: 'Insp. Chauhan' }
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
    reporter: { name: 'Rohan Sharma', anonymous: false },
    assignedTo: 'netops',
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
      { step: 'In Progress', time: 'ETA: 2 Hours', completed: false, active: true },
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
    reporter: { name: 'Anonymous Student', anonymous: true },
    assignedTo: 'maint',
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
    reporter: { name: 'Aman Varma', anonymous: false },
    assignedTo: 'maint',
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
    reporter: { name: 'Anonymous Student', anonymous: true },
    assignedTo: 'sec',
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
    reporter: { name: 'Dr. Karishma', anonymous: false },
    assignedTo: 'it',
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
