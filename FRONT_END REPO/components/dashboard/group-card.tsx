import { Card } from "@/components/ui/card"
import { TrendingUp, Users } from "lucide-react"

interface GroupCardProps {
  name: string
  members: number
  contribution: number
  currency: string
  round: number
  totalRounds: number
}

export default function GroupCard({ name, members, contribution, currency, round, totalRounds }: GroupCardProps) {
  return (
    <Card className="p-6 border-border bg-card hover:border-accent/50 transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <TrendingUp className="w-5 h-5 text-accent opacity-50" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Members</span>
          <span className="font-semibold flex items-center gap-1">
            <Users className="w-4 h-4" />
            {members}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Contribution</span>
          <span className="font-semibold">
            {contribution} {currency}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Round</span>
          <span className="font-semibold">
            {round} / {totalRounds}
          </span>
        </div>

        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div
            className="bg-accent h-2 rounded-full transition-all"
            style={{ width: `${(round / totalRounds) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
