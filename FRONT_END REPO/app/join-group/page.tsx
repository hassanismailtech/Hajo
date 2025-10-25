"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function JoinGroup() {
  const [groupId, setGroupId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Joined group:", groupId)
      setJoinedGroup(groupId)
      setIsSubmitting(false)
      setGroupId("")
    }, 1000)
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
            <h1 className="text-4xl font-bold">Join a Savings Group</h1>
            <p className="text-muted-foreground text-lg">
              Enter the Group ID shared by the group creator to join an existing savings circle.
            </p>
          </div>

          {!joinedGroup ? (
            <Card className="p-8 border-border bg-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Group ID Input */}
                <div className="space-y-2">
                  <label htmlFor="groupId" className="block text-sm font-semibold">
                    Group ID
                  </label>
                  <Input
                    id="groupId"
                    type="text"
                    placeholder="e.g., GRP-ABC123XYZ"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    required
                    className="bg-background border-border text-lg tracking-wider"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ask the group creator for the Group ID. It usually starts with "GRP-"
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !groupId}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  >
                    {isSubmitting ? "Joining Group..." : "Join Group"}
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-8 border-accent/30 bg-accent/5">
              <div className="flex flex-col items-center text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-accent" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Successfully Joined!</h2>
                  <p className="text-muted-foreground mb-4">
                    You've joined group <span className="font-mono font-semibold text-foreground">{joinedGroup}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Next, connect your Hedera wallet to start contributing to the savings circle.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    onClick={() => setJoinedGroup(null)}
                    variant="outline"
                    className="flex-1 border-accent text-accent hover:bg-accent/10"
                  >
                    Join Another Group
                  </Button>
                  <Link href="/connect-wallet" className="flex-1">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                      Connect Wallet
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* Info Box */}
          <Card className="p-6 border-border bg-card/50">
            <h3 className="font-semibold mb-3">Before you join:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold">•</span>
                <span>Make sure you have a Hedera wallet set up</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">•</span>
                <span>Verify the Group ID with the group creator</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">•</span>
                <span>Understand the contribution amount and schedule</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">•</span>
                <span>Review the group's terms and conditions</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  )
}
