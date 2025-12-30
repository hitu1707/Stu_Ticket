import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      token: null,
      users: [], // Store all registered users

      // Actions
      login: (userData, token) => {
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set({ user: userData });
      },

      // Check if user exists by mobile number
      checkUserExists: (mobile) => {
        const users = get().users;
        return users.find((u) => u.mobile === mobile);
      },

      // Register new user
      registerUser: (userData) => {
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          users: [...state.users, newUser],
        }));
        
        return newUser;
      },

      // Get user by mobile and password
      getUserByCredentials: (mobile, password) => {
        const users = get().users;
        return users.find((u) => u.mobile === mobile && u.password === password);
      },
    }),
    {
      name: 'auth-storage', // LocalStorage key
    }
  )
);

export default useAuthStore;