export interface User {
  id: string
  address: string
  name?: string
  email?: string
  avatar?: string
  walletType: 'hashpack' | 'blade' | 'metamask' | null
  connectedAt: Date
  lastActive: Date
}

export interface UserProfile {
  user: User
  groups: string[] // group IDs
  totalContributions: number
  totalReceived: number
  activeGroups: number
  // New fields for enhanced tracking
  contributionHistory: ContributionSummary[]
  balanceByGroup: Record<string, number> // groupId -> balance
  collateralLocked: number
  inactiveGroups: string[]
}

export interface ContributionSummary {
  groupId: string
  groupName: string
  totalContributed: number
  lastContribution: Date
  period: 'monthly' | 'weekly' | 'flexible'
}
