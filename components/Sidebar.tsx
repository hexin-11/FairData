'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Database, ShoppingBag, BarChart3, Upload, Boxes, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { label: 'Supply Side', items: [
    { href: '/upload', icon: Database, label: 'Provider Hub' },
    { href: '/dashboard', icon: BarChart3, label: 'Settlements' },
  ]},
  { label: 'Demand Side', items: [
    { href: '/datasets', icon: ShoppingBag, label: 'Data Market' },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl rotate-12 absolute opacity-20 scale-110" />
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center relative z-10 shadow-lg shadow-indigo-200">
            <Boxes className="text-white w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">FairData</span>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Protocol</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-6 mt-4">
        {nav.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
              {group.label}
            </p>
            {group.items.map(({ href, icon: Icon, label }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 h-10 rounded-lg mb-1 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <Link href="/auth/login" className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 hover:bg-slate-100 transition-colors">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
            FD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">My Account</p>
            <p className="text-xs text-slate-500 truncate">Creator</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
