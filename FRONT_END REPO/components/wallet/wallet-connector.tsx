'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useWalletStore } from '@/stores/walletStore'
import { useUserStore } from '@/stores/userStore'
import { Wallet, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface WalletConnectorProps {
  onConnect?: () => void
  onDisconnect?: () => void
}

export function WalletConnector({ onConnect, onDisconnect }: WalletConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { isConnected, address, walletType, connect, disconnect, setError } = useWalletStore()
  const { setUser } = useUserStore()

  const connectHashPack = async () => {
    setIsConnecting(true)
    try {
      // HashPack integration would go here
      // For now, simulate connection with test account 0.0.2 (has HBAR balance)
      const mockAddress = '0.0.2'
      const mockPrivateKey = '302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f49e2757'
      connect('hashpack', mockAddress, mockPrivateKey)
      setUser({
        id: mockAddress,
        address: mockAddress,
        walletType: 'hashpack',
        connectedAt: new Date(),
        lastActive: new Date(),
      })
      toast.success('Connected to HashPack')
      onConnect?.()
    } catch (error) {
      setError('Failed to connect to HashPack')
      toast.error('Failed to connect to HashPack')
    } finally {
      setIsConnecting(false)
    }
  }

  const connectBlade = async () => {
    setIsConnecting(true)
    try {
      // Blade integration would go here
      // For now, simulate connection with test account 0.0.2 (has HBAR balance)
      const mockAddress = '0.0.2'
      const mockPrivateKey = '302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f49e2757'
      connect('blade', mockAddress, mockPrivateKey)
      setUser({
        id: mockAddress,
        address: mockAddress,
        walletType: 'blade',
        connectedAt: new Date(),
        lastActive: new Date(),
      })
      toast.success('Connected to Blade')
      onConnect?.()
    } catch (error) {
      setError('Failed to connect to Blade')
      toast.error('Failed to connect to Blade')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setUser(null)
    toast.success('Disconnected wallet')
    onDisconnect?.()
  }

  // Clear persisted data on component mount to ensure fresh state
  useEffect(() => {
    const { clearPersistedData } = useWalletStore.getState()
    clearPersistedData()
  }, [])

  if (isConnected && address) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Connected</p>
              <p className="text-xs text-muted-foreground">
                {walletType?.toUpperCase()} • {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <Wallet className="w-12 h-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
          <p className="text-sm text-muted-foreground">
            Connect your Hedera wallet to start saving with your community
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={connectHashPack}
            disabled={isConnecting}
            className="w-full"
            variant="outline"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4 mr-2" />
            )}
            Connect HashPack
          </Button>

          <Button
            onClick={connectBlade}
            disabled={isConnecting}
            className="w-full"
            variant="outline"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4 mr-2" />
            )}
            Connect Blade
          </Button>
        </div>
      </div>
    </Card>
  )
}
