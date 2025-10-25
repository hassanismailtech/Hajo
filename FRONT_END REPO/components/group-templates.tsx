"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Calendar, Shield, Clock, Target } from "lucide-react"
import { GroupTemplate } from "@/types/groups"

interface GroupTemplatesProps {
  onSelectTemplate: (template: GroupTemplate) => void
}

const templates: GroupTemplate[] = [
  {
    id: "friends-circle",
    name: "Friends Savings Circle",
    description: "A casual savings group for friends to build wealth together",
    category: "friends",
    defaultSettings: {
      contributionAmount: 100,
      maxMembers: 5,
      roundDuration: 30,
      collateralRequired: 50,
      inactivityThreshold: 7,
      isFlexibleContribution: false,
      targetAmount: 5000,
      monthlyContribution: 100,
    },
    tags: ["friends", "casual", "monthly"],
    accessToken: "FRIENDS2025",
    isPublic: true,
  },
  {
    id: "family-emergency",
    name: "Family Emergency Fund",
    description: "Build a collective emergency fund for family members",
    category: "family",
    defaultSettings: {
      contributionAmount: 250,
      maxMembers: 8,
      roundDuration: 14,
      collateralRequired: 100,
      inactivityThreshold: 3,
      isFlexibleContribution: true,
      targetAmount: 20000,
      monthlyContribution: 250,
    },
    tags: ["family", "emergency", "security"],
    accessToken: "FAMILY2025",
    isPublic: true,
  },
  {
    id: "investment-club",
    name: "Investment Club",
    description: "Quarterly investment pool for long-term wealth building",
    category: "investment",
    defaultSettings: {
      contributionAmount: 500,
      maxMembers: 10,
      roundDuration: 90,
      collateralRequired: 200,
      inactivityThreshold: 14,
      isFlexibleContribution: false,
      targetAmount: 50000,
      monthlyContribution: 500,
    },
    tags: ["investment", "long-term", "quarterly"],
    accessToken: "INVEST2025",
    isPublic: true,
  },
  {
    id: "business-startup",
    name: "Business Startup Fund",
    description: "Collective funding for small business ventures",
    category: "business",
    defaultSettings: {
      contributionAmount: 1000,
      maxMembers: 6,
      roundDuration: 60,
      collateralRequired: 500,
      inactivityThreshold: 10,
      isFlexibleContribution: true,
      targetAmount: 60000,
      monthlyContribution: 1000,
    },
    tags: ["business", "startup", "entrepreneurship"],
    accessToken: "BIZ2025",
    isPublic: false,
  },
]

export function GroupTemplates({ onSelectTemplate }: GroupTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleSelectTemplate = (template: GroupTemplate) => {
    setSelectedTemplate(template.id)
    onSelectTemplate(template)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
        <p className="text-muted-foreground">
          Start with a pre-configured template or create your own custom group
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                : "border-border hover:border-accent/50"
            }`}
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                {!template.isPublic && (
                  <Badge variant="secondary" className="text-xs">
                    Private
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span>Up to {template.defaultSettings.maxMembers} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  <span>{template.defaultSettings.contributionAmount} HBAR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>{template.defaultSettings.roundDuration} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>{template.defaultSettings.collateralRequired} HBAR stake</span>
                </div>
              </div>

              {template.defaultSettings.isFlexibleContribution && (
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-accent" />
                  <span>Flexible contributions • Target: {template.defaultSettings.targetAmount?.toLocaleString()} HBAR</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-accent" />
                <span>Inactivity threshold: {template.defaultSettings.inactivityThreshold} days</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  className={`w-full ${
                    selectedTemplate === template.id
                      ? "bg-accent hover:bg-accent/90"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                  variant={selectedTemplate === template.id ? "default" : "secondary"}
                >
                  {selectedTemplate === template.id ? "Selected" : "Select Template"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Don't see what you're looking for? Create a custom group instead.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedTemplate(null)
            onSelectTemplate(null as any)
          }}
          className="border-accent text-accent hover:bg-accent/10"
        >
          Create Custom Group
        </Button>
      </div>
    </div>
  )
}
