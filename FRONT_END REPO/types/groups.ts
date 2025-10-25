export interface Group {
  id: string
  name: string
  description: string
  creator: string
  members: Member[]
  rounds: Round[]
  tokenId: string
  contributionAmount: number
  roundDuration: number // in days
  maxMembers: number
  currentRound: number
  totalRounds: number
  status: 'active' | 'completed' | 'paused'
  createdAt: Date
  updatedAt: Date
  // New fields for enhanced features
  collateralRequired: number // Amount of collateral required to join
  inactivityThreshold: number // Days before member is considered inactive
  targetAmount?: number // Optional target savings amount
  monthlyContribution?: number // Optional monthly contribution if flexible
  isFlexibleContribution: boolean // Whether contributions are flexible
  accessToken?: string // Token for group access templates
  templateId?: string // ID of the template used
  category?: string // Category for search (e.g., 'friends', 'family', 'investment')
  tags: string[] // Tags for search
}

export interface Member {
  id: string
  address: string
  name?: string
  joinedAt: Date
  contributions: Contribution[]
  hasReceivedPayout: boolean
  isActive: boolean
  collateralLocked: number // Amount of collateral currently locked
  lastActivity: Date // Last contribution or activity timestamp
  isInactive: boolean // Whether member is currently inactive
}

export interface Contribution {
  id: string
  amount: number
  timestamp: Date
  transactionId: string
  round: number
  period?: string // e.g., 'monthly', 'weekly' for flexible contributions
}

export interface Round {
  id: string
  groupId: string
  roundNumber: number
  status: 'collecting' | 'distributing' | 'completed'
  contributions: Contribution[]
  payoutRecipient?: string
  payoutTransactionId?: string
  startedAt: Date
  completedAt?: Date
}

// New interfaces for templates and search
export interface GroupTemplate {
  id: string
  name: string
  description: string
  category: string
  defaultSettings: {
    contributionAmount: number
    maxMembers: number
    roundDuration: number
    collateralRequired: number
    inactivityThreshold: number
    isFlexibleContribution: boolean
    targetAmount?: number
    monthlyContribution?: number
  }
  tags: string[]
  accessToken: string
  isPublic: boolean
}

export interface SearchFilters {
  query?: string
  category?: string
  contributionRange?: {
    min: number
    max: number
  }
  memberCount?: number
  tags?: string[]
  isFlexible?: boolean
}
