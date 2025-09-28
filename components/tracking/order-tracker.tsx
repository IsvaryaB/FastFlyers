"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, MapPin, Clock, CheckCircle } from "lucide-react"

interface Order {
  id: string
  customerName: string
  origin: string
  destination: string
  status: "pending" | "picked-up" | "in-transit" | "delivered" | "cancelled"
  createdAt: string
}

export function OrderTracker() {
  const [trackingId, setTrackingId] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const trackOrder = () => {
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID")
      return
    }

    setIsLoading(true)
    setError("")

    // Get orders from localStorage (admin-created orders)
    const savedOrders = localStorage.getItem("adminOrders")
    if (savedOrders) {
      const orders: Order[] = JSON.parse(savedOrders)
      const foundOrder = orders.find((o) => o.id.toLowerCase() === trackingId.toLowerCase())

      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        setError("Order not found. Please check your tracking ID.")
        setOrder(null)
      }
    } else {
      setError("Order not found. Please check your tracking ID.")
      setOrder(null)
    }

    setIsLoading(false)
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />
      case "picked-up":
        return <Package className="w-5 h-5" />
      case "in-transit":
        return <MapPin className="w-5 h-5" />
      case "delivered":
        return <CheckCircle className="w-5 h-5" />
      case "cancelled":
        return <Package className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "picked-up":
        return "bg-blue-500"
      case "in-transit":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusDescription = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Your order has been received and is being processed."
      case "picked-up":
        return "Your package has been picked up and is ready for transit."
      case "in-transit":
        return "Your package is on its way to the destination."
      case "delivered":
        return "Your package has been successfully delivered."
      case "cancelled":
        return "This order has been cancelled."
      default:
        return "Status unknown."
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
          <CardDescription>Enter your tracking ID to get real-time updates on your shipment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter tracking ID (e.g., FF-2024-001)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && trackOrder()}
            />
            <Button onClick={trackOrder} disabled={isLoading}>
              {isLoading ? "Tracking..." : "Track"}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {order && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              Order Details
            </CardTitle>
            <CardDescription>Tracking ID: {order.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Customer</h4>
                <p>{order.customerName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Order Date</h4>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Origin</h4>
                <p>{order.origin}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Destination</h4>
                <p>{order.destination}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getStatusColor(order.status)}>{order.status.replace("-", " ").toUpperCase()}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{getStatusDescription(order.status)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
