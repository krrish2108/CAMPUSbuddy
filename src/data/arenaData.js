export const EVENT_CATEGORIES = ['All', 'Hackathon', 'Lecture', 'Meetup', 'Ongoing'];

export const EVENTS = [
  {
    id: 'EVT-0500',
    title: 'UITxKIIF Hackathon',
    organizer: 'Karnavati Innovation Hub',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    mode: 'Offline',
    registrationDeadline: '2026-04-09T23:59:00Z',
    startTime: '2026-04-10T09:00:00Z',
    isPaid: false,
    fee: 0,
    teamSize: { min: 2, max: 4 },
    prizePot: '₹1,00,000 + Funding',
    status: 'Live',
    capacity: { total: 150, filled: 142 },
    timeline: { startsIn: 'Ongoing', duration: '36h' },
    description: 'The premier 36-hour innovation marathon at Karnavati University. Join the brightest minds to solve complex campus challenges.',
    location: 'Open Lab, Block 4, Karnavati University',
    tags: ['Hackathon', 'Innovation', 'Ongoing'],
    attachments: [
      { name: 'Rulebook.pdf', url: '#' },
      { name: 'Schedule.docx', url: '#' }
    ],
    isFeatured: true,
    registrationLink: 'https://campusbuddy.app/register/uitxkiif',
    photos: []
  },
  {
    id: 'EVT-0492',
    title: 'CodePulse Hackathon 2026',
    organizer: 'Tech Club CS',
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    mode: 'Hybrid',
    registrationDeadline: '2026-04-15T23:59:00Z',
    startTime: '2026-04-16T09:00:00Z',
    isPaid: false,
    fee: 0,
    teamSize: { min: 2, max: 4 },
    prizePot: '₹50,000',
    status: 'Upcoming',
    capacity: { total: 200, filled: 185 },
    timeline: { startsIn: '2d 4h', duration: '24h' },
    description: 'The ultimate 24-hour coding challenge for innovators. Build solutions that matter.',
    location: 'Open Lab, Block 4',
    tags: ['Hackathon', 'AI/ML', 'Web3'],
    attachments: [
      { name: 'Rulebook.pdf', url: '#' },
      { name: 'Schedule.docx', url: '#' }
    ],
    isFeatured: false,
    registrationLink: 'https://campusbuddy.app/register/codepulse',
    photos: []
  },
  {
    id: 'EVT-0495',
    title: 'Design Thinking Workshop',
    organizer: 'Interaction Labs',
    coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    mode: 'Offline',
    registrationDeadline: '2026-04-10T18:00:00Z',
    startTime: '2026-04-11T10:00:00Z',
    isPaid: true,
    fee: 199,
    teamSize: { min: 1, max: 1 },
    prizePot: 'Participation Certificates',
    status: 'Upcoming',
    capacity: { total: 50, filled: 12 },
    timeline: { startsIn: '16h', duration: '4h' },
    description: 'Learn the fundamentals of UX design and creative problem solving with industry experts.',
    location: 'Mini Auditorium',
    tags: ['Lecture', 'Design', 'UI/UX'],
    isFeatured: true,
    registrationLink: 'https://campusbuddy.app/register/designthinking',
    photos: []
  },
  {
    id: 'EVT-0498',
    title: 'Quantum Computing Intro',
    organizer: 'Physics Dept',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    mode: 'Online',
    registrationDeadline: '2026-04-09T17:00:00Z',
    startTime: 'new Date()', // Will be set to "Live" dynamically
    isPaid: false,
    fee: 0,
    teamSize: { min: 1, max: 1 },
    prizePot: 'Knowledge Boost',
    status: 'Live',
    capacity: { total: 500, filled: 342 },
    timeline: { startsIn: 'Now', duration: '2h' },
    description: 'An advanced session on quantum bits, gates, and the future of computation.',
    location: 'Zoom (Join link in ticket)',
    tags: ['Ongoing', 'Physics', 'Computing'],
    isFeatured: false,
    registrationLink: 'https://zoom.us/j/quantum-lecture',
    photos: []
  }
];

export const MOCK_REGISTRATIONS = [
  {
    id: 'REG-1001',
    eventId: 'EVT-0492',
    userId: 'u1',
    studentName: 'Rohan Sharma',
    registeredAt: '2026-04-05T10:30:00Z',
    teamName: 'Binary Bois',
    status: 'Confirmed',
    checkInTime: null,
    feedback: null
  }
];

export const DASHBOARD_STATS = {
  noShowRate: '12%',
  waitlistCount: 45,
  feedbackSummary: {
    averageRating: 4.8,
    topComments: [
      "Amazing infrastructure!",
      "The mentors were super helpful.",
      "Lunch was delayed but the event was great."
    ]
  },
  peakRegistrationTime: [
    { hour: '10 AM', count: 12 },
    { hour: '12 PM', count: 32 },
    { hour: '2 PM', count: 54 },
    { hour: '4 PM', count: 86 },
    { hour: '6 PM', count: 120 },
    { hour: '8 PM', count: 45 },
    { hour: '10 PM', count: 20 }
  ]
};

export const FRIENDS = [
  { id: 'f1', name: 'Krish', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', branch: 'CSE', semester: 6, isOnline: true, locationSharing: true },
  { id: 'f2', name: 'Kavyaa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', branch: 'Design', semester: 4, isOnline: true, locationSharing: false },
  { id: 'f3', name: 'Rahul', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', branch: 'CSE', semester: 6, isOnline: false, locationSharing: true },
  { id: 'f4', name: 'Daksh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', branch: 'Mechanical', semester: 8, isOnline: true, locationSharing: true },
  { id: 'f5', name: 'Twisha', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', branch: 'Design', semester: 4, isOnline: false, locationSharing: false },
  { id: 'f6', name: 'Avinash', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', branch: 'CSE', semester: 6, isOnline: true, locationSharing: true },
  { id: 'f12', name: 'Ananya', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', branch: 'CSE', semester: 4, isOnline: true, locationSharing: true }
];

export const SUGGESTED_TEAMMATES = [
  { id: 's1', name: 'Siddharth R.', branch: 'CSE', semester: 4, skills: ['React', 'Python', 'UI'], avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80', matchTag: 'Great match for CodePulse!' },
  { id: 's2', name: 'Ishita K.', branch: 'Design', semester: 6, skills: ['Figma', 'Prototyping', 'UX'], avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', matchTag: 'Design Lead Material' },
  { id: 's3', name: 'Kabir M.', branch: 'Mechanical', semester: 2, skills: ['AutoCAD', 'C++', 'Arduino'], avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', matchTag: 'Hardware Enthusiast' },
  { id: 's4', name: 'Zoya S.', branch: 'CSE', semester: 8, skills: ['AWS', 'Django', 'PostgreSQL'], avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', matchTag: 'Full Stack Expert' }
];

export const NETWORK_ACTIVITY = [
  { id: 'act1', friendId: 'f3', type: 'registration', text: 'Rahul Shaurya registered for CodePulse Hackathon', eventId: 'EVT-0492', time: '2 mins ago', icon: '⚡' },
  { id: 'act2', friendId: 'f12', type: 'registration', text: 'Ananya joined Design Thinking Workshop', eventId: 'EVT-0495', time: '15 mins ago', icon: '👥' },
  { id: 'act3', friendId: 'f4', type: 'location', text: 'Daksh is sharing location on Map', actionLabel: 'View Map →', module: 'Map', time: '1h ago', icon: '📍' }
];

export const PENDING_NETWORK_REQUESTS = [
  { id: 'pr1', name: 'Rohan Sharma', branch: 'CSE', semester: 6, mutualCount: 3, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 'pr2', name: 'Twisha J.', branch: 'Design', semester: 4, mutualCount: 1, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
];

export const TEAM_TIERS = ['Duo', 'Trio', 'Quad', 'Quad+'];
