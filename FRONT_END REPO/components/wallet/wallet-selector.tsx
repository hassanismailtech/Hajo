"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WalletSelectorProps {
  onSelect: (walletType: string) => void
}

const wallets = [
  {
    id: "hashpack",
    name: "HashPack",
    description: "Popular Hedera wallet browser extension",
    icon: "🔐",
  },
  {
    id: "blade",
    name: "Blade Wallet",
    description: "Secure Hedera wallet with advanced features",
    icon: "⚔️",
  },
  {
    id: "ledger",
    name: "Ledger",
    description: "Hardware wallet support for maximum security",
    icon: "🔒",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Connect any WalletConnect compatible wallet",
    icon: "🔗",
  },
]

export default function WalletSelector({ onSelect }: WalletSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Select a Wallet</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {wallets.map((wallet) => (
          <button key={wallet.id} onClick={() => onSelect(wallet.name)} className="text-left transition">
            <Card className="p-6 border-border bg-card hover:border-accent/50 hover:bg-accent/5 transition h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{wallet.icon}</div>
              </div>
              <h3 className="font-semibold text-lg mb-1">{wallet.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{wallet.description}</p>
              <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                Connect
              </Button>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
