'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, Zap, Map, Scale, Clock } from 'lucide-react';

const TOOLS = [
  {
    name: 'Currency Converter',
    description: 'Convert between 150+ currencies with live exchange rates',
    icon: DollarSign,
    href: '/dashboard/tools/currency-converter',
    color: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Trip Countdown',
    description: 'Track days until your next adventure',
    icon: Calendar,
    href: '/dashboard/tools/countdown',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'Expense Splitter',
    description: 'Split costs with travel companions easily',
    icon: Scale,
    href: '/dashboard/tools/expense-splitter',
    color: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Distance Calculator',
    description: 'Calculate distances between destinations',
    icon: Map,
    href: '/dashboard/tools/distance',
    color: 'from-orange-500 to-red-600',
  },
  {
    name: 'Time Zone Converter',
    description: 'Convert times across different time zones',
    icon: Clock,
    href: '/dashboard/tools/timezone',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    name: 'Packing Checklist',
    description: 'Smart packing list generator for your trip',
    icon: Zap,
    href: '/dashboard/packing-list',
    color: 'from-teal-500 to-cyan-600',
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          Travel Tools & Utilities
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Essential tools to help you plan, calculate, and prepare for your perfect trip
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.name} href={tool.href}>
              <div className="group rounded-xl border border-primary/30 bg-white hover:shadow-lg transition-all h-full p-6 space-y-4 cursor-pointer hover:border-primary/50">
                <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${tool.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {tool.description}
                  </p>
                </div>
                <Button className="w-full btn-gradient mt-auto">
                  Open Tool
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
