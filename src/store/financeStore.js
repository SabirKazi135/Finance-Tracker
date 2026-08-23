import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { useAuthStore } from './authStore';
import { demoTransactions } from './demoTransactions';

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      userTransactions: {}, // email → list of transactions
      transactions: [], // for UI compatibility

      _sync(email) {
        const all = get().userTransactions;
        set({ transactions: all[email] || [] });
      },

      // ===== Used by UI =====
      addTransaction: (tx) => {
        const email = useAuthStore.getState().user?.email;
        if (!email) return;

        const all = get().userTransactions;
        const list = all[email] || [];

        const newTx = {
          id: nanoid(),
          date: tx.date || new Date().toISOString(),
          ...tx,
        };

        const updated = [newTx, ...list];

        set({
          userTransactions: { ...all, [email]: updated },
          transactions: updated,
        });
      },

      deleteTransaction: (id) => {
        const email = useAuthStore.getState().user?.email;
        if (!email) return;

        const all = get().userTransactions;
        const updated = (all[email] || []).filter((t) => t.id !== id);

        set({
          userTransactions: { ...all, [email]: updated },
          transactions: updated,
        });
      },

      // ===== UI Selectors =====
      getRecentTransactions: (limit = 5) =>
        get()
          .transactions.slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit),

      getRecentIncome: (limit = 5) =>
        get()
          .transactions.filter((t) => t.type === 'income')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit),

      getRecentExpenses: (limit = 5) =>
        get()
          .transactions.filter((t) => t.type === 'expense')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit),

      getTotalIncome: () =>
        get()
          .transactions.filter((t) => t.type === 'income')
          .reduce((s, t) => s + t.amount, 0),

      getTotalExpense: () =>
        get()
          .transactions.filter((t) => t.type === 'expense')
          .reduce((s, t) => s + t.amount, 0),

      getTotalBalance: () => get().getTotalIncome() - get().getTotalExpense(),

      // ===== Demo Mode =====
      setDemoTransactions: () => {
        const demoEmail = 'demo@finance.com';

        set({
          userTransactions: {
            ...get().userTransactions,
            [demoEmail]: demoTransactions,
          },
          transactions: demoTransactions,
        });
      },
    }),
    { name: 'finance-storage' },
  ),
);
