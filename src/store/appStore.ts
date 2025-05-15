
import { create } from 'zustand';

export type Page = 'commandCenter' | 'myTasks' | 'insights' | 'marketplace' | 'accountSettings';

interface AppState {
  currentPage: Page;
  sidebarCollapsed: boolean;
  setCurrentPage: (page: Page) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'commandCenter',
  sidebarCollapsed: false,
  setCurrentPage: (page) => set({ currentPage: page }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
