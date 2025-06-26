import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

interface ExpenseContextData {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  filterRange: { min: number; max: number };
  setFilterRange: (range: { min: number; max: number }) => void;
}

const ExpenseContext = createContext<ExpenseContextData | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sortOrder, setSortOrder] = useState('date');
  const [filterRange, setFilterRange] = useState({ min: 0, max: Infinity });

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    setExpenses(prevExpenses => [
      ...prevExpenses,
      { ...expense, id: Math.random().toString(), date: new Date() },
    ]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  const sortedAndFilteredExpenses = expenses
    .filter(expense => expense.amount >= filterRange.min && expense.amount <= filterRange.max)
    .sort((a, b) => {
      if (sortOrder === 'date') {
        return b.date.getTime() - a.date.getTime();
      } else if (sortOrder === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

  return (
    <ExpenseContext.Provider value={{ expenses: sortedAndFilteredExpenses, addExpense, updateExpense, deleteExpense, sortOrder, setSortOrder, filterRange, setFilterRange }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
