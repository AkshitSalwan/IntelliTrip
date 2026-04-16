'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="border-b border-primary/30 bg-gradient-to-r from-white to-primary/5 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
          <Input
            placeholder="Search trips..."
            className="border-primary/30 bg-white/60 pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/30"
          />
        </div>
      </div>
    </header>
  );
}
