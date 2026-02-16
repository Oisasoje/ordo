import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; role: string } | null;
  rememberMe: boolean;
  hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;
  login: (
    email: string,
    password: string,
    remember: boolean,
  ) => Promise<boolean>;
  logout: () => void;
}

const authStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(name) ?? sessionStorage.getItem(name);
  },

  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") return;

    const parsed = JSON.parse(value);
    const remember = parsed?.state?.rememberMe;

    const target = remember ? localStorage : sessionStorage;

    target.setItem(name, value);
  },

  removeItem: (name: string) => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      rememberMe: false,
      hasHydrated: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),

      login: async (email, password, remember) => {
        // fake API delay
        await new Promise((r) => setTimeout(r, 800));

        const isValid = email === "intern@demo.com" && password === "intern123";

        if (!isValid) return false;

        set({
          isAuthenticated: true,
          user: { email, role: "Intern" },
          rememberMe: remember,
        });

        return true;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          rememberMe: false,
        });

        localStorage.removeItem("ordo-auth-storage");
        sessionStorage.removeItem("ordo-auth-storage");
      },
    }),
    {
      name: "ordo-auth-storage",
      storage: createJSONStorage(() => authStorage),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
