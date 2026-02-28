'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, LayoutDashboard, PlusCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function MobileNav() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Market', href: '/skills', icon: Search },
    { name: 'Publish', href: '/publish', icon: PlusCircle },
    { name: 'Console', href: '/dashboard', icon: LayoutDashboard },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black/80 backdrop-blur-xl z-[90] px-6 py-3 flex justify-between items-center pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <div className="relative">
              <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform duration-300`} />
              {isActive && (
                <motion.div 
                  layoutId="mobileNavDot"
                  className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" 
                />
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
