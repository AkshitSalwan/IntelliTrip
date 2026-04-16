'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, CalculatorIcon } from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
}

interface Person {
  name: string;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export default function ExpenseSplitterPage() {
  const [people, setPeople] = useState<Person[]>([{ name: 'You' }, { name: 'Friend 1' }]);
  const [newPersonName, setNewPersonName] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('You');
  const [splitAmong, setSplitAmong] = useState(['You', 'Friend 1']);

  const addPerson = () => {
    if (newPersonName.trim()) {
      setPeople([...people, { name: newPersonName }]);
      setSplitAmong([...splitAmong, newPersonName]);
      setNewPersonName('');
    }
  };

  const addExpense = () => {
    if (!description || !amount) return;
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      paidBy,
      splitAmong: splitAmong.length > 0 ? splitAmong : [paidBy],
    };
    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
  };

  const calculateSettlements = (): Settlement[] => {
    const balances: Record<string, number> = {};
    people.forEach(p => {
      balances[p.name] = 0;
    });

    expenses.forEach(exp => {
      balances[exp.paidBy] += exp.amount;
      const split = exp.splitAmong.length > 0 ? exp.splitAmong.length : 1;
      const perPerson = exp.amount / split;
      exp.splitAmong.forEach(person => {
        balances[person] -= perPerson;
      });
    });

    const settlements: Settlement[] = [];
    const debtors = Object.entries(balances)
      .filter(([_, balance]) => balance < 0)
      .map(([name, balance]) => ({ name, balance }));
    const creditors = Object.entries(balances)
      .filter(([_, balance]) => balance > 0)
      .map(([name, balance]) => ({ name, balance }));

    debtors.forEach(debtor => {
      creditors.forEach(creditor => {
        if (debtor.balance < -0.01 && creditor.balance > 0.01) {
          const amount = Math.min(-debtor.balance, creditor.balance);
          settlements.push({
            from: debtor.name,
            to: creditor.name,
            amount: Math.round(amount * 100) / 100,
          });
          debtor.balance += amount;
          creditor.balance -= amount;
        }
      });
    });

    return settlements;
  };

  const settlements = calculateSettlements();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Expense Splitter
        </h1>
        <p className="text-lg text-muted-foreground">
          Easily split trip costs with friends
        </p>
      </div>

      {/* People Section */}
      <div className="rounded-xl border border-primary/30 bg-white p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Travelers</h2>
        <div className="space-y-3">
          {people.map((person, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/30">
              <span className="text-lg">👤</span>
              <span className="flex-1 font-medium text-foreground">{person.name}</span>
              {i > 0 && (
                <button
                  onClick={() => {
                    setPeople(people.filter((_, idx) => idx !== i));
                    setSplitAmong(splitAmong.filter(name => name !== person.name));
                  }}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add traveler name"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            className="border-primary/30"
          />
          <Button onClick={addPerson} className="btn-gradient">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Expense Section */}
      <div className="rounded-xl border border-primary/30 bg-white p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Add Expense</h2>

        <div className="space-y-3">
          <Input
            placeholder="Description (e.g., Dinner)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-primary/30"
          />

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-primary/30"
          />

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Paid by</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full rounded-lg border border-primary/30 bg-white px-3 py-2 text-foreground"
            >
              {people.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Split among</label>
            <div className="space-y-2">
              {people.map(p => (
                <label key={p.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5">
                  <input
                    type="checkbox"
                    checked={splitAmong.includes(p.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSplitAmong([...splitAmong, p.name]);
                      } else {
                        setSplitAmong(splitAmong.filter(name => name !== p.name));
                      }
                    }}
                    className="rounded border-primary/30"
                  />
                  <span className="text-foreground">{p.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={addExpense} className="w-full btn-gradient">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Expenses List */}
      {expenses.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-white p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Expenses</h2>
          <div className="space-y-2">
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/30">
                <div>
                  <p className="font-medium text-foreground">{exp.description}</p>
                  <p className="text-sm text-muted-foreground">Paid by {exp.paidBy}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">${exp.amount.toFixed(2)}</p>
                  <button
                    onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))}
                    className="text-destructive hover:text-destructive/80 mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settlements */}
      {settlements.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CalculatorIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Settlements</h2>
          </div>
          <div className="space-y-3">
            {settlements.map((settlement, i) => (
              <div key={i} className="p-3 rounded-lg bg-white border border-primary/30 flex items-center justify-between">
                <p className="font-medium text-foreground">
                  <span className="text-primary">{settlement.from}</span>
                  {' pays '}
                  <span className="text-secondary">{settlement.to}</span>
                </p>
                <p className="text-lg font-bold text-primary">${settlement.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
