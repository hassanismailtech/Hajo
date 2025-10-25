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
  tokenId?: string
  memo?: string
}

export interface TransactionHistory {
  transactions: Transaction[]
  totalCount: number
  page: number
  pageSize: number
}

export interface HederaTransaction {
  transactionId: string
  consensusTimestamp: string
  transactionHash: string
  status: 'SUCCESS' | 'FAIL'
  memo?: string
  transfers: Transfer[]
}

export interface Transfer {
  account: string
  amount: number
  tokenId?: string
}
