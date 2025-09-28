"use client"

import { useSearchParams } from "next/navigation"
import { BranchDirectory } from "@/components/locations/branch-directory"

export default function LocationsPage() {
  const params = useSearchParams()
  const query = params.get("query") || ""

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Our Locations</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find FastFlyer branches and partner locations across India. We're here to serve you with reliable logistics
            solutions.
          </p>
        </div>
        <BranchDirectory initialQuery={query} />
      </div>
    </div>
  )
}
