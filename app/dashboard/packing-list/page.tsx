'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Check } from 'lucide-react';

interface PackingItem {
  id: string;
  category: string;
  item: string;
  packed: boolean;
}

const CATEGORIES = ['Clothing', 'Toiletries', 'Documents', 'Electronics', 'Accessories', 'Other'];

export default function PackingListPage() {
  const [items, setItems] = useState<PackingItem[]>([
    { id: '1', category: 'Clothing', item: 'Underwear', packed: false },
    { id: '2', category: 'Clothing', item: 'Socks', packed: false },
    { id: '3', category: 'Documents', item: 'Passport', packed: false },
    { id: '4', category: 'Electronics', item: 'Phone Charger', packed: false },
  ]);

  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Clothing');

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        category: newCategory,
        item: newItem,
        packed: false,
      },
    ]);
    setNewItem('');
  };

  const togglePacked = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const packedCount = items.filter(item => item.packed).length;
  const packingPercentage = items.length > 0 ? (packedCount / items.length) * 100 : 0;

  const itemsByCategory = CATEGORIES.reduce((acc, cat) => {
    const categoryItems = items.filter(item => item.category === cat);
    if (categoryItems.length > 0) {
      acc[cat] = categoryItems;
    }
    return acc;
  }, {} as Record<string, PackingItem[]>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Packing List
        </h1>
        <p className="mt-2 text-slate-600">Keep track of what you need to pack</p>
      </div>

      {/* Progress */}
      <div className="space-y-3 rounded-lg border border-teal-200/50 bg-white p-6">
        <div className="flex items-center justify-between">
          <span className="text-slate-900 font-medium">Packing Progress</span>
          <span className="text-teal-600 font-bold">{packedCount}/{items.length}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all"
            style={{ width: `${packingPercentage}%` }}
          />
        </div>
        <p className="text-sm text-slate-600 text-center">{Math.round(packingPercentage)}% packed</p>
      </div>

      {/* Add Item Form */}
      <div className="rounded-lg border border-teal-200/50 bg-white p-6 space-y-4">
        <h3 className="font-semibold text-slate-900">Add Item</h3>
        <div className="flex gap-2">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="rounded-lg border border-teal-200/50 bg-slate-50 px-3 py-2 text-sm text-slate-900"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Input
            placeholder="Item name..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            className="flex-1 border-teal-200/50"
          />
          <Button onClick={addItem} className="btn-gradient">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Packing List by Category */}
      <div className="space-y-6">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-lg">{category}</h3>
            <div className="space-y-2">
              {categoryItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-teal-200/50 bg-white p-4 transition-all hover:shadow-sm"
                >
                  <button
                    onClick={() => togglePacked(item.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      item.packed
                        ? 'bg-teal-500 border-teal-500'
                        : 'border-teal-200/50 hover:border-teal-500'
                    }`}
                  >
                    {item.packed && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <span className={`flex-1 ${item.packed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {item.item}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500/70 italic">No items yet. Start adding items to your packing list!</p>
        </div>
      )}
    </div>
  );
}
