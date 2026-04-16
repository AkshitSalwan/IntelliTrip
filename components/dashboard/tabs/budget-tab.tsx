'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, DollarSign, TrendingDown, AlertCircle } from 'lucide-react';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
}

interface BudgetTabProps {
  trip: any;
}

const CATEGORIES = ['Accommodation', 'Food', 'Transport', 'Activities', 'Other'];

const CHART_COLORS = ['#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

export function BudgetTab({ trip }: BudgetTabProps) {
  const [expenses, setExpenses] = useState<Expense[]>(trip.expenses || []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Other',
    amount: '',
    description: '',
  });

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = trip.budget - totalSpent;
  const percentage = (totalSpent / trip.budget) * 100;

  // Calculate data for pie chart (by category)
  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    value: expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0),
  })).filter(item => item.value > 0);

  // Calculate cumulative spending
  const cumulativeData = expenses
    .sort((a, b) => expenses.indexOf(a) - expenses.indexOf(b))
    .reduce((acc, exp, idx) => {
      const prevTotal = idx > 0 ? acc[idx - 1].cumulative : 0;
      acc.push({
        index: idx + 1,
        amount: exp.amount,
        cumulative: prevTotal + exp.amount,
        description: exp.description,
      });
      return acc;
    }, [] as any[]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
    };

    setExpenses([...expenses, newExpense]);
    setFormData({ category: 'Other', amount: '', description: '' });
    setShowForm(false);

    // Save to API
    fetch(`/api/trips/${trip._id}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense),
    });
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    fetch(`/api/trips/${trip._id}/expenses/${id}`, { method: 'DELETE' });
  };

  return (
    <div className="space-y-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-white to-primary/5 p-6">
      {/* Budget Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-primary/30 bg-white p-4">
          <p className="text-sm text-muted-foreground">Total Budget</p>
          <p className="text-2xl font-bold text-foreground">${trip.budget.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-white p-4">
          <p className="text-sm text-muted-foreground">Spent</p>
          <p className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-white p-4">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className={`text-2xl font-bold ${remaining < 0 ? 'text-destructive' : 'text-primary'}`}>
            ${remaining.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-white p-4">
          <p className="text-sm text-muted-foreground">Used</p>
          <p className="text-2xl font-bold text-foreground">{percentage.toFixed(1)}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all ${
              percentage > 90
                ? 'bg-gradient-to-r from-destructive to-red-600'
                : percentage > 75
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-primary to-secondary'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {remaining < 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Over budget by ${Math.abs(remaining).toFixed(2)}
          </div>
        )}
      </div>

      {/* Charts Section */}
      {categoryData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie Chart */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Spending by Category</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Bar Chart */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Expenses by Category</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Cumulative Chart */}
      {cumulativeData.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Cumulative Spending</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="description" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Expenses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Expenses List</h3>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            variant={showForm ? 'outline' : 'default'}
            className={showForm ? 'border-primary/30' : 'btn-gradient'}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleAddExpense} className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Category</FieldLabel>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="flex h-10 w-full rounded-lg border border-primary/30 bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Amount ($)</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                  className="border-primary/30"
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input
                  placeholder="e.g., Hotel booking, Dinner"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className="border-primary/30"
                />
              </Field>
            </FieldGroup>

            <div className="flex gap-2">
              <Button type="submit" className="btn-gradient flex-1">
                Add Expense
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-primary/30"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {expenses.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 italic">
            No expenses yet. Add one to start tracking!
          </p>
        ) : (
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-lg border border-primary/30 bg-white p-4 transition-all hover:shadow-sm"
              >
                <div>
                  <p className="font-medium text-foreground">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">{expense.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-primary">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemoveExpense(expense.id)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
