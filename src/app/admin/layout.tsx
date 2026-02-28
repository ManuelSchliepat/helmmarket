import Link from 'next/link';
import { LayoutDashboard, CheckSquare, Users, LineChart } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 px-3">Admin Panel</h2>
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 hover:text-indigo-400 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </Link>
            <Link href="/admin/skills" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 hover:text-indigo-400 transition-colors">
              <CheckSquare className="w-5 h-5" />
              <span className="font-medium">Review Queue</span>
            </Link>
            <Link href="/admin/publishers" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 hover:text-indigo-400 transition-colors">
              <Users className="w-5 h-5" />
              <span className="font-medium">Publishers</span>
            </Link>
            <Link href="/admin/revenue" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 hover:text-indigo-400 transition-colors">
              <LineChart className="w-5 h-5" />
              <span className="font-medium">Revenue</span>
            </Link>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
