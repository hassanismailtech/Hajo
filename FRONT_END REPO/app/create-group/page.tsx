"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useWalletStore } from "@/stores/walletStore"
import { useGroupStore } from "@/stores/groupStore"
import { useUserStore } from "@/stores/userStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { hederaService } from "@/lib/hedera"

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    memberCount: "5",
    contributionAmount: "",
    roundDuration: "30",
    currency: "HBAR",
    collateralRequired: "",
    inactivityThreshold: "7",
    isFlexibleContribution: false,
    targetAmount: "",
    monthlyContribution: "",
    category: "friends",
    tags: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isConnected, address, privateKey } = useWalletStore()
  const { addGroup } = useGroupStore()
  const { user } = useUserStore()
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
        roundDuration: parseInt(formData.roundDuration),
        maxMembers: parseInt(formData.memberCount),
        currentRound: 1,
        totalRounds: parseInt(formData.memberCount),
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        // New fields for enhanced features
        collateralRequired: parseFloat(formData.collateralRequired) || 0,
        inactivityThreshold: parseInt(formData.inactivityThreshold) || 7,
        targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : undefined,
        monthlyContribution: formData.monthlyContribution ? parseFloat(formData.monthlyContribution) : undefined,
        isFlexibleContribution: formData.isFlexibleContribution,
        accessToken: uuidv4(), // Generate access token
        templateId: undefined, // No template used
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      }

      // Save to store
      addGroup(group)

      toast.success("Group created successfully!")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Error creating group:", error)
      toast.error(`Failed to create group: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-accent">MicroSave</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Create a Savings Group</h1>
            <p className="text-muted-foreground text-lg">
              Start a new savings circle with your community. Set the rules, invite members, and begin saving together.
            </p>
          </div>

          <Card className="p-8 border-border bg-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Name */}
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

              {/* Description */}
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
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Member Count */}
              <div className="space-y-2">
                <label htmlFor="memberCount" className="block text-sm font-semibold">
                  Number of Members
                </label>
                <select
                  id="memberCount"
                  name="memberCount"
                  value={formData.memberCount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} members
                    </option>
                  ))}
                </select>
              </div>

              {/* Contribution Amount */}
              <div className="grid grid-cols-2 gap-4">
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
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="HBAR">HBAR</option>
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>

              {/* Flexible Contribution */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFlexibleContribution"
                  checked={formData.isFlexibleContribution}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFlexibleContribution: checked as boolean }))}
                />
                <label htmlFor="isFlexibleContribution" className="text-sm font-semibold">
                  Enable Flexible Contributions
                </label>
              </div>

              {formData.isFlexibleContribution && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="targetAmount" className="block text-sm font-semibold">
                      Target Savings Amount
                    </label>
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      placeholder="5000"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="monthlyContribution" className="block text-sm font-semibold">
                      Monthly Contribution
                    </label>
                    <Input
                      id="monthlyContribution"
                      name="monthlyContribution"
                      type="number"
                      placeholder="250"
                      value={formData.monthlyContribution}
                      onChange={handleChange}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              )}

              {/* Collateral Required */}
              <div className="space-y-2">
                <label htmlFor="collateralRequired" className="block text-sm font-semibold">
                  Collateral Required (Optional)
                </label>
                <Input
                  id="collateralRequired"
                  name="collateralRequired"
                  type="number"
                  placeholder="50"
                  value={formData.collateralRequired}
                  onChange={handleChange}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Amount members must lock as collateral to join the group
                </p>
              </div>

              {/* Inactivity Threshold */}
              <div className="space-y-2">
                <label htmlFor="inactivityThreshold" className="block text-sm font-semibold">
                  Inactivity Threshold (Days)
                </label>
                <Input
                  id="inactivityThreshold"
                  name="inactivityThreshold"
                  type="number"
                  placeholder="7"
                  value={formData.inactivityThreshold}
                  onChange={handleChange}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Days without activity before a member is considered inactive
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-semibold">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="friends">Friends</option>
                  <option value="family">Family</option>
                  <option value="investment">Investment</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tags" className="block text-sm font-semibold">
                  Tags (Optional)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="savings, community, investment"
                  value={formData.tags}
                  onChange={handleChange}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated tags to help others find your group
                </p>
              </div>

              {/* Submit Button */}
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

          {/* Info Box */}
          <Card className="p-6 border-accent/30 bg-accent/5">
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold">1.</span>
                <span>Your group will be created on the Hedera blockchain</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">2.</span>
                <span>You'll receive a unique Group ID to share with members</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">3.</span>
                <span>Members can join using the Group ID and connect their wallets</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">4.</span>
                <span>Contributions begin and rounds are managed transparently on-chain</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  )
}
