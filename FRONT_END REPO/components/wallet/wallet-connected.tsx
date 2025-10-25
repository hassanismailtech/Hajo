"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, LogOut } from "lucide-react"
import Link from "next/link"

interface WalletConnectedProps {
  wallet: {
    address: string
    provider: string
    balance: string
  }
  onDisconnect: () => void
}

export default function WalletConnected({ wallet, onDisconnect }: WalletConnectedProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(wallet.address)
  }

  return (
    <div className="space-y-6">
      <Card className="p-8 border-accent/30 bg-accent/5">
        <div className="space-y-6">
          {/* Success Message */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold">Wallet Connected!</h2>
            <p className="text-muted-foreground">Your wallet is now connected to MicroSave</p>
          </div>

          {/* Wallet Details */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Wallet Provider</p>
              <p className="font-semibold">{wallet.provider}</p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Wallet Address</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-semibold text-sm">{wallet.address}</p>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-muted rounded-lg transition"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">HBAR Balance</p>
              <p className="text-2xl font-bold text-accent">{wallet.balance}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                Go to Dashboard
              </Button>
            </Link>
            <Button onClick={onDisconnect} variant="outline" className="flex-1 border-border bg-transparent gap-2">
              <LogOut className="w-4 h-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </Card>

      {/* Additional Info */}
      <Card className="p-6 border-border bg-card/50">
        <h3 className="font-semibold mb-4">Next Steps</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-accent">
              1
            </div>
            <div>
              <p className="font-semibold text-sm">Join or Create a Group</p>
              <p className="text-xs text-muted-foreground">Start participating in a savings circle</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-accent">
              2
            </div>
            <div>
              <p className="font-semibold text-sm">Make Your First Contribution</p>
              <p className="text-xs text-muted-foreground">Contribute to the group pool</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-accent">
              3
            </div>
            <div>
              <p className="font-semibold text-sm">Receive Your Payout</p>
              <p className="text-xs text-muted-foreground">Get your turn to receive the full pool amount</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
