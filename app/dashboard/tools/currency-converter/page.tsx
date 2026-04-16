'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
];

// Mock exchange rates (in production, fetch from API)
const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, JPY: 149.5, AUD: 1.53, CAD: 1.36, INR: 83.2, MXN: 17.05 },
  EUR: { USD: 1.09, GBP: 0.86, JPY: 162.5, AUD: 1.66, CAD: 1.48, INR: 90.5, MXN: 18.55 },
  GBP: { USD: 1.27, EUR: 1.16, JPY: 189.0, AUD: 1.93, CAD: 1.72, INR: 105.2, MXN: 21.6 },
};

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState('92.00');

  const handleConvert = () => {
    if (!amount) return;
    const numAmount = parseFloat(amount);
    if (fromCurrency === toCurrency) {
      setResult(numAmount.toFixed(2));
      return;
    }
    const rates = EXCHANGE_RATES[fromCurrency] || {};
    const converted = numAmount * (rates[toCurrency] || 1);
    setResult(converted.toFixed(2));
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    handleConvert();
  };

  const fromCurr = CURRENCIES.find(c => c.code === fromCurrency);
  const toCurr = CURRENCIES.find(c => c.code === toCurrency);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Currency Converter
        </h1>
        <p className="text-lg text-muted-foreground">
          Real-time exchange rates for your travel
        </p>
      </div>

      {/* Converter Card */}
      <div className="rounded-xl border border-primary/30 bg-white p-8 space-y-6 shadow-lg">
        {/* From Currency */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">From</label>
          <div className="flex gap-3">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="flex-1 rounded-lg border border-primary/30 bg-white px-3 py-2 text-foreground focus:border-primary focus:ring-primary/30"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={handleConvert}
            className="text-lg border-primary/30"
          />
          <p className="text-xs text-muted-foreground">1 {fromCurrency} = {EXCHANGE_RATES[fromCurrency]?.[toCurrency]?.toFixed(4) || '...'} {toCurrency}</p>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </button>
        </div>

        {/* To Currency */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full rounded-lg border border-primary/30 bg-white px-3 py-2 text-foreground focus:border-primary focus:ring-primary/30"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/30">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {toCurr?.symbol}{result}
            </p>
          </div>
        </div>

        <Button onClick={handleConvert} className="w-full btn-gradient py-6 text-lg">
          Convert
        </Button>
      </div>

      {/* Exchange Rates Reference */}
      <div className="rounded-xl border border-primary/30 bg-white p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Exchange Rates (1 {fromCurrency})</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {CURRENCIES.filter(c => c.code !== fromCurrency).map(c => {
            const rate = EXCHANGE_RATES[fromCurrency]?.[c.code] || 0;
            return (
              <div key={c.code} className="p-3 rounded-lg bg-primary/5 border border-primary/30">
                <p className="text-sm font-medium text-foreground">{c.code}</p>
                <p className="text-lg font-bold text-primary mt-1">{rate.toFixed(4)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
