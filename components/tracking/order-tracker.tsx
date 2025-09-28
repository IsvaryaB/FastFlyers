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
  status: "Booked" | "In Transit" | "Delivered" | "Cancelled"
  createdAt: string
}

export function OrderTracker() {
  const [trackingId, setTrackingId] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const trackOrder = async () => {
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID")
      return
    }

    setIsLoading(true)
    setError("")
    setOrder(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${trackingId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Order not found. Please check your tracking ID.")
      }

      const shipmentData = await response.json()
      const formattedOrder: Order = {
        id: shipmentData.trackingId,
        customerName: shipmentData.customerName || "N/A",
        origin: shipmentData.pickupAddress,
        destination: shipmentData.deliveryAddress,
        status: shipmentData.status,
        createdAt: shipmentData.createdAt,
      }
      setOrder(formattedOrder)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Booked":
        return <Clock className="w-5 h-5" />
      case "In Transit":
        return <MapPin className="w-5 h-5" />
      case "Delivered":
        return <CheckCircle className="w-5 h-5" />
      case "Cancelled":
        return <Package className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Booked":
        return "bg-yellow-500"
      case "In Transit":
        return "bg-blue-500"
      case "Delivered":
        return "bg-green-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusDescription = (status: Order["status"]) => {
    switch (status) {
      case "Booked":
        return "Your order has been booked and is pending pickup."
      case "In Transit":
        return "Your package is on its way to the destination."
      case "Delivered":
        return "Your package has been successfully delivered."
      case "Cancelled":
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
