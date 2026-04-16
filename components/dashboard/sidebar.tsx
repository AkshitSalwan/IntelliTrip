'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Map,
  Home,
  Settings,
  LogOut,
  BarChart3,
  Backpack,
  Globe,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Trips', href: '/dashboard/trips', icon: Map },
  { name: 'Destinations', href: '/dashboard/destinations', icon: Globe },
  { name: 'Surprise Me', href: '/dashboard/surprise-me', icon: Sparkles },
  { name: 'Tools', href: '/dashboard/tools', icon: Wrench },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Packing List', href: '/dashboard/packing-list', icon: Backpack },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-primary/30 bg-gradient-to-b from-primary/5 to-background">
      <div className="flex h-16 items-center border-b border-primary/30 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-md" />
          <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            IntelliTrip
          </span>
        </Link>
      </div>

      <nav className="space-y-2 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-primary/10 hover:shadow-sm'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4 border-t border-purple-200/50 pt-6">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: 'h-10 w-10',
            },
          }}
        />
      </div>
    </aside>
  );
}
