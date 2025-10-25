"use client"

import { useState } from "react"
import Link from "next/link"
import { Zap, LogOut, Plus, TrendingUp, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useWalletStore } from "@/stores/walletStore"
import { useUserStore } from "@/stores/userStore"
import { useGroupStore } from "@/stores/groupStore"
import { useRouter } from "next/navigation"
import RoundDetails from "@/components/dashboard/round-details"
import MembersList from "@/components/dashboard/members-list"

export default function Dashboard() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const { disconnect: disconnectWallet, address } = useWalletStore()
  const { setUser } = useUserStore()
  const { groups } = useGroupStore()
  const router = useRouter()

  // Get user's groups from store
  const userGroups = groups.filter(group => group.members.some(member => member.address === address))

  const selectedGroupData = userGroups.find((g) => g.id === selectedGroup) || (userGroups.length > 0 ? userGroups[0] : null)

  // Get members data from selected group
  const groupMembers = selectedGroupData ? selectedGroupData.members.map((member, index) => ({
    id: index + 1,
    name: member.address === address ? "You" : `Member ${index + 1}`,
    wallet: member.address,
    contributed: true, // Mock contribution status
    amount: selectedGroupData.contributionAmount
  })) : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-accent">MicroSave</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => {
              disconnectWallet()
              setUser(null)
              toast.success('Wallet disconnected successfully')
              router.push('/')
            }}>
              <LogOut className="w-4 h-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Manage your savings groups and track contributions</p>
            </div>
            <Link href="/join-group">
              <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <Plus className="w-4 h-4" />
                Join Group
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Groups</p>
                  <p className="text-3xl font-bold">{userGroups.filter((g) => g.status === "active").length}</p>
                </div>
                <Users className="w-8 h-8 text-accent opacity-50" />
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Contributed</p>
                  <p className="text-3xl font-bold">{userGroups.reduce((sum, g) => sum + (g.contributionAmount * g.currentRound), 0)} HBAR</p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent opacity-50" />
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Members</p>
                  <p className="text-3xl font-bold">{userGroups.reduce((sum, g) => sum + g.members.length, 0)}</p>
                </div>
                <Users className="w-8 h-8 text-accent opacity-50" />
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed Rounds</p>
                  <p className="text-3xl font-bold">{userGroups.filter((g) => g.status === "completed").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-accent opacity-50" />
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Groups List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold">Your Groups</h2>
              <div className="space-y-3">
                {userGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      selectedGroup === group.id || (!selectedGroup && userGroups.length > 0 && group.id === userGroups[0].id)
                        ? "border-accent bg-accent/10"
                        : "border-border bg-card hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{group.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          group.status === "active" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {group.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{group.id}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>{group.members.length} members</span>
                      <span className="font-semibold text-accent">
                        {group.contributionAmount} HBAR
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Group Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedGroupData && <RoundDetails group={selectedGroupData} />}
              <MembersList members={groupMembers} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
