'use client';

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Zap, Eye } from 'lucide-react';

const COLORS = ['#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

interface AnalyticsDashboardProps {
  trips: any[];
}

export function AnalyticsDashboard({ trips }: AnalyticsDashboardProps) {
  // Calculate statistics
  const totalTrips = trips.length;
  const totalSpent = trips.reduce((sum, trip) => {
    const expenseSum = (trip.expenses || []).reduce((s: number, e: any) => s + e.amount, 0);
    return sum + expenseSum;
  }, 0);

  const averageSpent = totalTrips > 0 ? totalSpent / totalTrips : 0;
  
  const travelStyleStats = trips.reduce((acc: any, trip) => {
    const style = trip.travelStyle || 'Unknown';
    const existing = acc.find((item: any) => item.name === style);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: style, count: 1 });
    }
    return acc;
  }, []);

  const monthlySpending = trips.reduce((acc: any, trip) => {
    const month = new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short' });
    const expense = (trip.expenses || []).reduce((s: number, e: any) => s + e.amount, 0);
    const existing = acc.find((item: any) => item.month === month);
    if (existing) {
      existing.amount += expense;
    } else {
      acc.push({ month, amount: expense });
    }
    return acc;
  }, []).slice(-6); // Last 6 months

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-teal-200/50 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Trips</p>
              <p className="text-3xl font-bold text-slate-900">{totalTrips}</p>
            </div>
            <Eye className="h-8 w-8 text-teal-500" />
          </div>
        </div>

        <div className="rounded-lg border border-teal-200/50 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Spent</p>
              <p className="text-3xl font-bold text-teal-600">${totalSpent.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-teal-500" />
          </div>
        </div>

        <div className="rounded-lg border border-teal-200/50 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Average per Trip</p>
              <p className="text-3xl font-bold text-slate-900">${averageSpent.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-teal-500" />
          </div>
        </div>

        <div className="rounded-lg border border-teal-200/50 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Countries</p>
              <p className="text-3xl font-bold text-slate-900">{new Set(trips.map(t => t.destination)).size}</p>
            </div>
            <Zap className="h-8 w-8 text-teal-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Travel Style Distribution */}
        {travelStyleStats.length > 0 && (
          <div className="rounded-2xl border border-teal-200/50 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Travel Style Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={travelStyleStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {travelStyleStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Monthly Spending Trend */}
        {monthlySpending.length > 0 && (
          <div className="rounded-2xl border border-teal-200/50 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Monthly Spending Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
