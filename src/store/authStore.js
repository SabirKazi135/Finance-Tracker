import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFinanceStore } from './financeStore';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: [],
      user: null,
      isAuthenticated: false,

      // ======================= SIGNUP =======================
      signup: ({ fullName, email, password }) => {
        const newUser = { fullName, email, password };

        set({
          users: [...get().users, newUser],
          user: newUser,
          isAuthenticated: true,
        });

        // Sync empty transactions for new user
        const { _sync } = useFinanceStore.getState();
        _sync(email);

        return { success: true };
      },

      // ======================= LOGIN =======================
      login: ({ email, password }) => {
        const { _sync, setDemoTransactions } = useFinanceStore.getState();
        const foundUser = get().users.find(
          (u) => u.email === email && u.password === password,
        );

        // ---- DEMO LOGIN ----
        if (email === 'demo@finance.com' && password === '1234') {
          set({
            user: { email, fullName: 'Demo User' },
            isAuthenticated: true,
          });

          setDemoTransactions(); // 🔥 correctly load demo data
          return { success: true, demo: true };
        }

        // ---- NORMAL LOGIN ----
        if (foundUser) {
          set({ user: foundUser, isAuthenticated: true });

          _sync(foundUser.email); // 🔥 load that user's transactions
          return { success: true };
        }

        return { success: false, message: 'Invalid email or password' };
      },

      // ======================= LOGOUT =======================
      logout: () =>
        set({
          isAuthenticated: false,
        }),
    }),
    { name: 'auth-storage' },
  ),
);
