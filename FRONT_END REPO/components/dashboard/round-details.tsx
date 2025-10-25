import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface RoundDetailsProps {
  group: {
    id: string
    name: string
    currentRound: number
    totalRounds: number
    contributionAmount: number
    currency?: string
    myContributions?: number
    nextPayout?: string
    status: string
  }
}

export default function RoundDetails({ group }: RoundDetailsProps) {
  const roundProgress = (group.currentRound / group.totalRounds) * 100

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Round Details</h2>

      <Card className="p-6 border-border bg-card">
        <div className="space-y-6">
          {/* Round Progress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Current Round</h3>
              <span className="text-sm text-muted-foreground">
                {group.currentRound} of {group.totalRounds}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-gradient-to-r from-accent to-accent/70 h-3 rounded-full transition-all"
                style={{ width: `${roundProgress}%` }}
              />
            </div>
          </div>

          {/* Group Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Contribution Amount</p>
              <p className="text-2xl font-bold">
                {group.contributionAmount} <span className="text-sm">{group.currency}</span>
              </p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Your Total Contributed</p>
              <p className="text-2xl font-bold text-accent">{group.myContributions}</p>
            </div>
          </div>

          {/* Next Payout */}
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold mb-1">Next Payout</p>
                <p className="text-sm text-muted-foreground">{group.nextPayout}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Contribute Now
            </Button>
            <Button variant="outline" className="flex-1 border-border bg-transparent">
              View History
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
