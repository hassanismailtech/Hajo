import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserProfile, ContributionSummary } from '@/types/user'

interface UserStore {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  updateProfile: (profile: UserProfile) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      updateProfile: (profile) => set({ profile }),
      clearUser: () => set({ user: null, profile: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    }
  )
)
