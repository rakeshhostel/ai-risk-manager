import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  darkMode: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
}

const getInitialDarkMode = (): boolean => {
  try {
    const stored = localStorage.getItem('darkMode');
    return stored !== null ? JSON.parse(stored) : true;
  } catch { return true; }
};

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  darkMode: getInitialDarkMode(),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDarkMode: () => set((state) => {
    const next = !state.darkMode;
    localStorage.setItem('darkMode', JSON.stringify(next));
    return { darkMode: next };
  }),
}));
