export interface WalletState {
  isConnected: boolean
  address: string | null
  walletType: 'hashpack' | 'blade' | 'metamask' | null
  balance: string
  network: 'mainnet' | 'testnet' | 'previewnet'
}

export interface WalletConnection {
  type: 'hashpack' | 'blade' | 'metamask'
  pairingString?: string
  topic?: string
  connected: boolean
}

export interface Transaction {
  id: string
  hash: string
  type: 'transfer' | 'contribution' | 'payout' | 'token_creation'
  amount: number
  from: string
  to: string
  timestamp: Date
  status: 'pending' | 'confirmed' | 'failed'
  groupId?: string
  roundId?: string
}
