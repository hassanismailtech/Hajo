"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown } from "lucide-react"

interface WalletButtonProps {
  isConnected?: boolean
  address?: string
}

export default function WalletButton({ isConnected = false, address }: WalletButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isConnected) {
    return (
      <Link href="/connect-wallet">
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:border-accent/50 transition"
      >
        <Wallet className="w-4 h-4 text-accent" />
        <span className="font-mono text-sm font-semibold">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50">
          <div className="p-4 space-y-3">
            <div className="p-3 rounded-lg bg-background/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Connected Address</p>
              <p className="font-mono text-xs font-semibold break-all">{address}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border bg-transparent text-destructive hover:bg-destructive/10"
              onClick={() => {
                // Import and use the disconnect function from wallet store
                const { disconnect } = require('@/stores/walletStore').useWalletStore.getState()
                const { setUser } = require('@/stores/userStore').useUserStore.getState()
                disconnect()
                setUser(null)
                setIsOpen(false)
                // Show success message
                const { toast } = require('sonner')
                toast.success('Wallet disconnected successfully')
              }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
