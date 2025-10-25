"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Filter, Users, DollarSign, Calendar, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGroupStore } from "@/stores/groupStore"
import { SearchFilters } from "@/types/groups"

export default function SearchGroups() {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [searchQuery, setSearchQuery] = useState("")
  const { searchGroups, searchResults, isLoading } = useGroupStore()

  useEffect(() => {
    // Initial search with empty filters to show all groups
    searchGroups({})
  }, [])

  const handleSearch = () => {
    const searchFilters: SearchFilters = {
      ...filters,
      query: searchQuery || undefined,
    }
    searchGroups(searchFilters)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    searchGroups({ ...newFilters, query: searchQuery || undefined })
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery("")
    searchGroups({})
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Find Savings Groups</h1>
            <p className="text-muted-foreground text-lg">
              Discover and join existing savings groups that match your preferences.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 border-border bg-card">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search groups by name, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <Button onClick={handleSearch} className="gap-2 bg-accent hover:bg-accent/90">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Category</label>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="emergency">Emergency Fund</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Contribution Range</label>
                  <Select
                    value={filters.contributionRange ? `${filters.contributionRange.min}-${filters.contributionRange.max}` : "any"}
                    onValueChange={(value) => {
                      if (value === "any") {
                        handleFilterChange("contributionRange", undefined)
                      } else {
                        const [min, max] = value.split("-").map(Number)
                        handleFilterChange("contributionRange", { min, max })
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Any amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any amount</SelectItem>
                      <SelectItem value="0-100">0 - 100 HBAR</SelectItem>
                      <SelectItem value="100-500">100 - 500 HBAR</SelectItem>
                      <SelectItem value="500-1000">500 - 1000 HBAR</SelectItem>
                      <SelectItem value="1000-5000">1000+ HBAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Member Count</label>
                  <Select
                    value={filters.memberCount?.toString() || "any"}
                    onValueChange={(value) => handleFilterChange("memberCount", value === "any" ? undefined : parseInt(value))}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any size</SelectItem>
                      <SelectItem value="3">Up to 3 members</SelectItem>
                      <SelectItem value="5">Up to 5 members</SelectItem>
                      <SelectItem value="10">Up to 10 members</SelectItem>
                      <SelectItem value="20">Up to 20 members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Contribution Type</label>
                  <Select
                    value={filters.isFlexible === undefined ? "any" : filters.isFlexible.toString()}
                    onValueChange={(value) => handleFilterChange("isFlexible", value === "any" ? undefined : value === "true")}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any type</SelectItem>
                      <SelectItem value="false">Fixed amount</SelectItem>
                      <SelectItem value="true">Flexible amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end">
                <Button variant="outline" onClick={clearFilters} className="gap-2">
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Search Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {isLoading ? "Searching..." : `Found ${searchResults.length} groups`}
              </h2>
            </div>

            {searchResults.length === 0 && !isLoading ? (
              <Card className="p-12 text-center border-border bg-card">
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No groups found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or create a new group.
                </p>
                <Link href="/create-group">
                  <Button className="bg-accent hover:bg-accent/90">
                    Create New Group
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((group) => (
                  <Card key={group.id} className="p-6 border-border bg-card hover:border-accent/50 transition">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{group.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-accent" />
                          <span>{group.members.length}/{group.maxMembers}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-accent" />
                          <span>{group.contributionAmount} HBAR</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span>{group.roundDuration}d</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {group.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {group.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                            +{group.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground capitalize">
                          {group.category}
                        </span>
                        {group.isFlexibleContribution && (
                          <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                            Flexible
                          </span>
                        )}
                      </div>

                      <Link href={`/join-group?groupId=${group.id}`}>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                          Join Group
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
