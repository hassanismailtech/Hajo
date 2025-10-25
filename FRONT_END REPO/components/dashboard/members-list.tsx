import { Card } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"

interface Member {
  id: number
  name: string
  wallet: string
  contributed: boolean
  amount: number
}

interface MembersListProps {
  members: Member[]
}

export default function MembersList({ members }: MembersListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Group Members</h2>

      <Card className="p-6 border-border bg-card">
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border hover:border-accent/50 transition"
            >
              <div className="flex-1">
                <p className="font-semibold">{member.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{member.wallet}</p>
              </div>

              <div className="flex items-center gap-3">
                {member.contributed ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-sm font-semibold">{member.amount}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="text-sm text-muted-foreground">Pending</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
