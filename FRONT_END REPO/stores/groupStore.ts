import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Group, Member, Round, GroupTemplate, SearchFilters } from '@/types/groups'

interface GroupStore {
  groups: Group[]
  currentGroup: Group | null
  templates: GroupTemplate[]
  searchResults: Group[]
  searchFilters: SearchFilters
  isLoading: boolean
  error: string | null

  // Actions
  setGroups: (groups: Group[]) => void
  addGroup: (group: Group) => void
  updateGroup: (groupId: string, updates: Partial<Group>) => void
  setCurrentGroup: (group: Group | null) => void
  addMember: (groupId: string, member: Member) => void
  updateMember: (groupId: string, memberId: string, updates: Partial<Member>) => void
  addRound: (groupId: string, round: Round) => void
  updateRound: (groupId: string, roundId: string, updates: Partial<Round>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearGroups: () => void

  // New actions for enhanced features
  setTemplates: (templates: GroupTemplate[]) => void
  addTemplate: (template: GroupTemplate) => void
  searchGroups: (filters: SearchFilters) => void
  setSearchResults: (results: Group[]) => void
  setSearchFilters: (filters: SearchFilters) => void
  checkInactiveMembers: (groupId: string) => void
  lockCollateral: (groupId: string, memberId: string, amount: number) => void
  unlockCollateral: (groupId: string, memberId: string, amount: number) => void
}

export const useGroupStore = create<GroupStore>()(
  persist(
    (set, get) => ({
      groups: [],
      currentGroup: null,
      templates: [],
      searchResults: [],
      searchFilters: {},
      isLoading: false,
      error: null,

      setGroups: (groups) => set({ groups }),
      addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
      updateGroup: (groupId, updates) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === groupId ? { ...g, ...updates } : g)),
          currentGroup: state.currentGroup?.id === groupId ? { ...state.currentGroup, ...updates } : state.currentGroup,
        })),
      setCurrentGroup: (group) => set({ currentGroup: group }),
      addMember: (groupId, member) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId ? { ...g, members: [...g.members, member] } : g
          ),
        })),
      updateMember: (groupId, memberId, updates) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  members: g.members.map((m) => (m.id === memberId ? { ...m, ...updates } : m)),
                }
              : g
          ),
        })),
      addRound: (groupId, round) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === groupId ? { ...g, rounds: [...(g.rounds || []), round] } : g)),
        })),
      updateRound: (groupId, roundId, updates) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  rounds: (g.rounds || []).map((r) => (r.id === roundId ? { ...r, ...updates } : r)),
                }
              : g
          ),
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearGroups: () => set({ groups: [], currentGroup: null }),

      // New actions for enhanced features
      setTemplates: (templates) => set({ templates }),
      addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),
      searchGroups: (filters) => {
        const { groups } = get()
        let results = [...groups]

        if (filters.query) {
          const query = filters.query.toLowerCase()
          results = results.filter(g =>
            g.name.toLowerCase().includes(query) ||
            g.description.toLowerCase().includes(query) ||
            g.tags.some(tag => tag.toLowerCase().includes(query))
          )
        }

        if (filters.category) {
          results = results.filter(g => g.category === filters.category)
        }

        if (filters.contributionRange) {
          results = results.filter(g =>
            g.contributionAmount >= filters.contributionRange!.min &&
            g.contributionAmount <= filters.contributionRange!.max
          )
        }

        if (filters.memberCount) {
          results = results.filter(g => g.members.length <= filters.memberCount!)
        }

        if (filters.tags && filters.tags.length > 0) {
          results = results.filter(g =>
            filters.tags!.some(tag => g.tags.includes(tag))
          )
        }

        if (filters.isFlexible !== undefined) {
          results = results.filter(g => g.isFlexibleContribution === filters.isFlexible)
        }

        set({ searchResults: results, searchFilters: filters })
      },
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchFilters: (filters) => set({ searchFilters: filters }),
      checkInactiveMembers: (groupId) => {
        const { groups } = get()
        const group = groups.find(g => g.id === groupId)
        if (!group) return

        const now = new Date()
        const updatedMembers = group.members.map(member => {
          const daysSinceActivity = (now.getTime() - member.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
          return {
            ...member,
            isInactive: daysSinceActivity > group.inactivityThreshold
          }
        })

        set((state) => ({
          groups: state.groups.map(g =>
            g.id === groupId ? { ...g, members: updatedMembers } : g
          )
        }))
      },
      lockCollateral: (groupId, memberId, amount) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  members: g.members.map((m) =>
                    m.id === memberId ? { ...m, collateralLocked: m.collateralLocked + amount } : m
                  ),
                }
              : g
          ),
        })),
      unlockCollateral: (groupId, memberId, amount) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  members: g.members.map((m) =>
                    m.id === memberId ? { ...m, collateralLocked: Math.max(0, m.collateralLocked - amount) } : m
                  ),
                }
              : g
          ),
        })),
    }),
    {
      name: 'group-store',
      partialize: (state) => ({
        groups: state.groups,
        currentGroup: state.currentGroup,
        templates: state.templates,
      }),
    }
  )
)
