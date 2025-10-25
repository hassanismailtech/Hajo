import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WalletState, WalletConnection, Transaction } from '@/types/wallet'

interface WalletStore extends WalletState {
  connection: WalletConnection | null
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  privateKey: string | null

  // Actions
  connect: (type: 'hashpack' | 'blade' | 'metamask', address: string, privateKey?: string) => void
  disconnect: () => void
  updateBalance: (balance: string) => void
  setNetwork: (network: 'mainnet' | 'testnet' | 'previewnet') => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearPersistedData: () => void
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      isConnected: false,
      address: null,
      walletType: null,
      balance: '0',
      network: 'testnet',
      connection: null,
      transactions: [],
      isLoading: false,
      error: null,
      privateKey: null,

      connect: (type, address, privateKey) =>
        set({
          isConnected: true,
          address,
          walletType: type,
          connection: { type, connected: true },
          privateKey: privateKey || null,
        }),
      disconnect: () =>
        set({
          isConnected: false,
          address: null,
          walletType: null,
          balance: '0',
          connection: null,
          transactions: [],
          privateKey: null,
          isLoading: false,
          error: null,
        }),
      updateBalance: (balance) => set({ balance }),
      setNetwork: (network) => set({ network }),
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearPersistedData: () => {
        // Clear all persisted data
        set({
          isConnected: false,
          address: null,
          walletType: null,
          balance: '0',
          network: 'testnet',
          connection: null,
          transactions: [],
          privateKey: null,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'wallet-store',
      partialize: (state) => ({
        isConnected: state.isConnected,
        address: state.address,
        walletType: state.walletType,
        balance: state.balance,
        network: state.network,
        connection: state.connection,
        transactions: state.transactions,
        privateKey: state.privateKey,
      }),
    }
  )
)
