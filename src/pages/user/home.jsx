import Navbar from '@/components/Navbar';
import ModuleCard from '@/components/ModuleCard';

export default function HomePage() {
  const firstName = 'Student';

  const modules = [
    {
      letter: 'C',
      name: 'Caffinity',
      description: 'Campus food ordering system. Skip the queue and order ahead.',
      href: '/user/caffinity',
      color: '#1A56DB' // blue
    },
    {
      letter: 'A',
      name: 'Arena',
      description: 'Sports and facility booking. Reserve your spot on the court.',
      href: '/user/arena',
      color: '#D97706' // amber
    },
    {
      letter: 'M',
      name: 'Mapping',
      description: 'Find your way around campus with detailed maps and routing.',
      href: '/user/map',
      color: '#0F6E56' // green
    },
    {
      letter: 'P',
      name: 'ProblemBox',
      description: 'Report issues and track maintenance requests on campus.',
      href: '/user/problembox',
      color: '#DC2626' // red
    },
    {
      letter: 'U',
      name: 'UAssist',
      description: 'Academic resources, notes, and collaborative study groups.',
      href: '/user/uassist',
      color: '#7C3AED' // purple
    },
    {
      letter: 'S',
      name: 'Shopperz',
      description: 'Buy and sell textbooks, electronics, and dorm essentials.',
      href: '/user/shopperz',
      color: '#EA580C' // orange
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-8 space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-syne text-gray-900 tracking-tight">
              Welcome, <span className="text-blue-600">{firstName}</span>
            </h1>
            <p className="mt-2 text-gray-500 font-medium">What would you like to do today?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.name}
              letter={mod.letter}
              name={mod.name}
              description={mod.description}
              href={mod.href}
              color={mod.color}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
