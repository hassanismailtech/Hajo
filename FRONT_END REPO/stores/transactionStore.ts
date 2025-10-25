import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, TransactionHistory } from '@/types/transactions'

interface TransactionStore {
  transactions: Transaction[]
  history: TransactionHistory | null
  isLoading: boolean
  error: string | null

  // Actions
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  setHistory: (history: TransactionHistory) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearTransactions: () => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      history: null,
      isLoading: false,
      error: null,

      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      setHistory: (history) => set({ history }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearTransactions: () => set({ transactions: [], history: null }),
    }),
    {
      name: 'transaction-store',
      partialize: (state) => ({
        transactions: state.transactions,
        history: state.history,
      }),
    }
  )
)
