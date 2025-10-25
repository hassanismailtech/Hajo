"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WalletConnector } from "@/components/wallet/wallet-connector"
import { useWalletStore } from "@/stores/walletStore"
import { useRouter } from "next/navigation"

export default function ConnectWallet() {
  const [step, setStep] = useState<"select" | "connecting" | "connected">("select")
  const { isConnected, address, walletType, isLoading } = useWalletStore()
  const router = useRouter()

  const handleConnect = () => {
    setStep("connecting")
  }

  const handleConnected = () => {
    setStep("connected")
    // Auto-redirect after successful connection
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  const handleDisconnect = () => {
    setStep("select")
  }

  // Update step based on wallet state
  useEffect(() => {
    if (isConnected) {
      setStep("connected")
    } else if (isLoading) {
      setStep("connecting")
    } else {
      setStep("select")
    }
  }, [isConnected, isLoading])

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
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground text-lg">
              Connect your Hedera wallet to start participating in savings groups and managing your contributions.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {["Select", "Connecting", "Connected"].map((label, idx) => (
              <div key={label} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    step === ["select", "connecting", "connected"][idx]
                      ? "bg-accent text-accent-foreground"
                      : idx < ["select", "connecting", "connected"].indexOf(step)
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx < ["select", "connecting", "connected"].indexOf(step) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition ${
                    idx < ["select", "connecting", "connected"].indexOf(step) ? "bg-accent" : "bg-muted"
                  }`}
                />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-muted text-muted-foreground">
              3
            </div>
          </div>

          {/* Content */}
          {step === "select" && (
            <div className="space-y-6">
              <WalletConnector onConnect={handleConnect} onDisconnect={handleDisconnect} />

              <Card className="p-6 border-border bg-card/50">
                <h3 className="font-semibold mb-3">Why connect your wallet?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>Securely manage your contributions on-chain</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>Receive payouts directly to your wallet</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>Verify all transactions on the Hedera blockchain</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>Your private keys remain secure and never shared</span>
                  </li>
                </ul>
              </Card>
            </div>
          )}

          {step === "connecting" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-muted border-t-accent animate-spin" />
                <Zap className="absolute inset-0 m-auto w-10 h-10 text-accent" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Connecting Wallet</h2>
                <p className="text-muted-foreground">Please approve the connection in your wallet...</p>
              </div>
            </div>
          )}

          {step === "connected" && isConnected && address && (
            <Card className="p-6 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold text-green-600">Wallet Connected!</h2>
                <p className="text-muted-foreground">
                  {walletType?.toUpperCase()} • {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard in a few seconds...
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
