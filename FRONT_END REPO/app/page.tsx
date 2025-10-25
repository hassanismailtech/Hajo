"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Users, Zap, Shield, TrendingUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WalletButton from "@/components/wallet/wallet-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useWalletStore } from "@/stores/walletStore"
import { useGroupStore } from "@/stores/groupStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { hederaService } from "@/lib/hedera"

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)
  const { isConnected, address, privateKey } = useWalletStore()

  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    memberCount: "5",
    contributionAmount: "",
    currency: "HBAR",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addGroup } = useGroupStore()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address || !privateKey) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsSubmitting(true)

    try {
      // Create token on Hedera
      const tokenResult = await hederaService.createToken(
        formData.groupName,
        `MS${formData.groupName.replace(/\s+/g, '').toUpperCase()}`,
        parseInt(formData.memberCount) * parseFloat(formData.contributionAmount),
        address!,
        privateKey!
      )

      if (tokenResult.status !== 'SUCCESS') {
        throw new Error('Failed to create token on Hedera')
      }

      // Create group object
      const groupId = uuidv4()
      const group = {
        id: groupId,
        name: formData.groupName,
        description: formData.description,
        creator: address,
        members: [{
          id: uuidv4(),
          address: address,
          joinedAt: new Date(),
          contributions: [],
          hasReceivedPayout: false,
          isActive: true,
          collateralLocked: 0,
          lastActivity: new Date(),
          isInactive: false,
        }],
        rounds: [],
        tokenId: tokenResult.tokenId!,
        contributionAmount: parseFloat(formData.contributionAmount),
        roundDuration: 30,
        maxMembers: parseInt(formData.memberCount),
        currentRound: 1,
        totalRounds: parseInt(formData.memberCount),
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        collateralRequired: 0,
        inactivityThreshold: 7,
        targetAmount: undefined,
        monthlyContribution: undefined,
        isFlexibleContribution: false,
        accessToken: uuidv4(),
        templateId: undefined,
        category: "friends",
        tags: [],
      }

      // Save to store
      addGroup(group)

      toast.success("Group created successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating group:", error)
      toast.error(`Failed to create group: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold neon-text">MicroSave</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Docs
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition">
              About
            </a>
            <ThemeToggle />
            <WalletButton isConnected={isConnected} address={address || undefined} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                Save Together,
                <br />
                <span className="neon-text">Transparently</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join a digital savings circle powered by Hedera Token Service. Build wealth with your community through
                trustless, on-chain transparency.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create-group">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  Create Group <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10 bg-transparent"
                >
                  Find Groups <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative h-96 lg:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-3xl neon-glow"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center shadow-2xl">
                <Users className="w-24 h-24 text-accent-foreground opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create Group Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Create Your Savings Group</h2>
            <p className="text-muted-foreground text-lg">Start saving with your community today</p>
          </div>

          <Card className="p-8 border-border bg-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="groupName" className="block text-sm font-semibold">
                    Group Name
                  </label>
                  <Input
                    id="groupName"
                    name="groupName"
                    type="text"
                    placeholder="e.g., Friends Savings Circle"
                    value={formData.groupName}
                    onChange={handleChange}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="memberCount" className="block text-sm font-semibold">
                    Number of Members
                  </label>
                  <Select value={formData.memberCount} onValueChange={(value) => setFormData(prev => ({ ...prev, memberCount: value }))}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} members
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the purpose of your savings group..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contributionAmount" className="block text-sm font-semibold">
                    Contribution Amount
                  </label>
                  <Input
                    id="contributionAmount"
                    name="contributionAmount"
                    type="number"
                    placeholder="100"
                    value={formData.contributionAmount}
                    onChange={handleChange}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="currency" className="block text-sm font-semibold">
                    Currency
                  </label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HBAR">HBAR</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isConnected}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Group...
                    </>
                  ) : !isConnected ? (
                    "Connect Wallet to Create Group"
                  ) : (
                    "Create Group"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why MicroSave?</h2>
            <p className="text-muted-foreground text-lg">Everything you need for transparent, decentralized savings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Trustless Transparency",
                description:
                  "All transactions verified on-chain via Hedera Token Service. No intermediaries, pure blockchain proof.",
              },
              {
                icon: Users,
                title: "Community Powered",
                description:
                  "Save with friends and family. Build wealth together through collaborative savings circles.",
              },
              {
                icon: TrendingUp,
                title: "Smart Payouts",
                description:
                  "Automated round management with fair distribution. Everyone gets their turn to receive the full pool.",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="p-6 border-border hover:border-accent/50 transition bg-background/50 backdrop-blur"
              >
                <feature.icon className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Create or Join", desc: "Start a group or join with a Group ID" },
              { step: "2", title: "Connect Wallet", desc: "Link your Hedera wallet securely" },
              { step: "3", title: "Contribute", desc: "Make regular contributions to the pool" },
              { step: "4", title: "Receive Payout", desc: "Get your turn to receive the full amount" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-accent to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Save Together?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands building wealth transparently on the blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-group">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Get Started Now
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2025 MicroSave. Powered by Hedera Token Service. All transactions on-chain.</p>
        </div>
      </footer>
    </div>
  )
}
