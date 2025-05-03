import { create } from 'zustand';
import { Creator, Transaction, Stats } from '@/types';

interface StoreState {
  creators: Creator[];
  transactions: Transaction[];
  stats: Stats;
  setCreators: (creators: Creator[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setStats: (stats: Stats) => void;
}

export const useStore = create<StoreState>((set) => ({
  creators: [],
  transactions: [],
  stats: {
    total_creators: 0,
    active_creators: 0,
    total_revenue: 0,
    pending_payouts: 0
  },
  setCreators: (creators) => set({ creators }),
  setTransactions: (transactions) => set({ transactions }),
  setStats: (stats) => set({ stats })
}));