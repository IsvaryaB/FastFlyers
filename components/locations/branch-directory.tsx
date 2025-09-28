"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, Navigation, Building2, Users } from "lucide-react"

interface Branch {
  id: string
  name: string
  type: "main" | "partner" | "hub"
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  hours: string
  services: string[]
  coordinates?: { lat: number; lng: number }
}

export function BranchDirectory({ initialQuery = "" }: { initialQuery?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedState, setSelectedState] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  // Sample branch data - in a real app, this would come from a database
  const branches: Branch[] = [
    {
      id: "1",
      name: "FastFlyer Mumbai Central Hub",
      type: "main",
      address: "Plot No. 123, Industrial Area, Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400069",
      phone: "+91 22 2345 6789",
      email: "mumbai@fastflyer.com",
      hours: "24/7",
      services: ["Express Delivery", "International Shipping", "Warehousing", "Same Day Delivery"],
    },
    {
      id: "2",
      name: "FastFlyer Delhi Distribution Center",
      type: "main",
      address: "Sector 18, Gurgaon",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122015",
      phone: "+91 124 456 7890",
      email: "delhi@fastflyer.com",
      hours: "6:00 AM - 10:00 PM",
      services: ["Express Delivery", "Document Courier", "B2B Logistics"],
    },
    {
      id: "3",
      name: "FastFlyer Bangalore Tech Hub",
      type: "main",
      address: "Electronic City Phase 1",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560100",
      phone: "+91 80 1234 5678",
      email: "bangalore@fastflyer.com",
      hours: "7:00 AM - 9:00 PM",
      services: ["Express Delivery", "E-commerce Logistics", "Tech Support"],
    },
    {
      id: "4",
      name: "Blue Dart Partner - Chennai",
      type: "partner",
      address: "Anna Salai, T. Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
      phone: "+91 44 2345 6789",
      email: "chennai.partner@fastflyer.com",
      hours: "9:00 AM - 6:00 PM",
      services: ["Express Delivery", "International Shipping"],
    },
    {
      id: "5",
      name: "DTDC Partner - Pune",
      type: "partner",
      address: "FC Road, Shivajinagar",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411005",
      phone: "+91 20 3456 7890",
      email: "pune.partner@fastflyer.com",
      hours: "9:00 AM - 7:00 PM",
      services: ["Express Delivery", "Document Courier"],
    },
    {
      id: "6",
      name: "FastFlyer Hyderabad Hub",
      type: "hub",
      address: "HITEC City, Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500081",
      phone: "+91 40 4567 8901",
      email: "hyderabad@fastflyer.com",
      hours: "8:00 AM - 8:00 PM",
      services: ["Express Delivery", "B2B Logistics", "Warehousing"],
    },
    {
      id: "7",
      name: "Gati Partner - Kolkata",
      type: "partner",
      address: "Park Street Area",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016",
      phone: "+91 33 2345 6789",
      email: "kolkata.partner@fastflyer.com",
      hours: "9:00 AM - 6:00 PM",
      services: ["Express Delivery", "Regional Distribution"],
    },
    {
      id: "8",
      name: "FastFlyer Ahmedabad Center",
      type: "hub",
      address: "Satellite Road, Prahladnagar",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015",
      phone: "+91 79 3456 7890",
      email: "ahmedabad@fastflyer.com",
      hours: "8:00 AM - 7:00 PM",
      services: ["Express Delivery", "Industrial Logistics"],
    },
  ]

  const states = Array.from(new Set(branches.map((branch) => branch.state))).sort()

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      const matchesSearch =
        searchQuery === "" ||
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.pincode.includes(searchQuery)

      const matchesState = selectedState === "all" || branch.state === selectedState
      const matchesType = selectedType === "all" || branch.type === selectedType

      return matchesSearch && matchesState && matchesType
    })
  }, [searchQuery, selectedState, selectedType, branches])

  const getBranchTypeColor = (type: Branch["type"]) => {
    switch (type) {
      case "main":
        return "bg-green-500"
      case "partner":
        return "bg-blue-500"
      case "hub":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getBranchTypeLabel = (type: Branch["type"]) => {
    switch (type) {
      case "main":
        return "Main Branch"
      case "partner":
        return "Partner Location"
      case "hub":
        return "Distribution Hub"
      default:
        return "Branch"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Find Our Locations
          </CardTitle>
          <CardDescription>Search for FastFlyer branches and partner locations near you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by city, state, or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Location Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="main">Main Branches</SelectItem>
                <SelectItem value="partner">Partner Locations</SelectItem>
                <SelectItem value="hub">Distribution Hubs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Found {filteredBranches.length} location{filteredBranches.length !== 1 ? "s" : ""}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Main Branch
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            Partner
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            Hub
          </Badge>
        </div>
      </div>

      {/* Branch Listings */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBranches.map((branch) => (
          <Card key={branch.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {branch.city}, {branch.state}
                  </CardDescription>
                </div>
                <Badge className={getBranchTypeColor(branch.type)}>{getBranchTypeLabel(branch.type)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div className="text-sm">
                    <p>{branch.address}</p>
                    <p>
                      {branch.city}, {branch.state} - {branch.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${branch.phone}`} className="text-sm hover:text-primary">
                    {branch.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{branch.hours}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Services
                </h4>
                <div className="flex flex-wrap gap-1">
                  {branch.services.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Navigation className="w-4 h-4 mr-1" />
                  Get Directions
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No locations found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or contact us for assistance.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
