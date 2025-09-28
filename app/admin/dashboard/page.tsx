"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, Package, Plus, Truck } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface Shipment {
  shipment_id: number
  trackingId: string
  customerName: string
  pickupAddress: string
  deliveryAddress: string
  status: "Booked" | "In Transit" | "Delivered" | "Cancelled"
  created_at: string
}

const statusOptions: Shipment["status"][] = ["Booked", "In Transit", "Delivered", "Cancelled"]

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Form states
  const [pickupAddress, setPickupAddress] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [weight, setWeight] = useState("")
  const [shipmentType, setShipmentType] = useState("Package")
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>("")
  const [newStatus, setNewStatus] = useState<Shipment["status"]>("Booked")

  const getAuthToken = useCallback(() => {
    return typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }, [router])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/admin/login")
      return
    }
    setIsAuthenticated(true)

    const fetchShipments = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) handleLogout()
          throw new Error("Failed to fetch shipments.")
        }
        const data = await response.json()
        setShipments(data)
      } catch (error: any) {
        setMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShipments()
  }, [router, getAuthToken, handleLogout])

  const addShipment = async () => {
    if (!pickupAddress || !deliveryAddress || !weight) {
      setMessage("Please fill in all fields.")
      return
    }
    const token = getAuthToken()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          pickupAddress,
          deliveryAddress,
          weight: parseFloat(weight),
          shipmentType,
          serviceSpeed: "Standard",
        }),
      })
      if (!response.ok) throw new Error((await response.json()).message || "Failed to add shipment.")
      const newShipment = await response.json()
      setShipments([newShipment, ...shipments])
      setMessage(`Shipment added! Tracking ID: ${newShipment.trackingId}`)
      setPickupAddress("")
      setDeliveryAddress("")
      setWeight("")
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  const updateShipmentStatus = async () => {
    if (!selectedShipmentId) {
      setMessage("Please select a shipment to update.")
      return
    }
    const token = getAuthToken()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${selectedShipmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error((await response.json()).message || "Failed to update status.")
      const updatedShipment = await response.json()
      setShipments(shipments.map((s) => (s.shipment_id === updatedShipment.shipment_id ? updatedShipment : s)))
      setMessage("Shipment status updated!")
      setSelectedShipmentId("")
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  const getStatusColor = (status: Shipment["status"]) => {
    const colors = { Booked: "bg-yellow-500", "In Transit": "bg-blue-500", Delivered: "bg-green-500", Cancelled: "bg-red-500" }
    return colors[status] || "bg-gray-500"
  }

  if (!isAuthenticated || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage orders and track shipments</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {message && <Alert className="mb-6"><AlertDescription>{message}</AlertDescription></Alert>}

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">All Shipments</TabsTrigger>
            <TabsTrigger value="add">Add Shipment</TabsTrigger>
            <TabsTrigger value="update">Update Status</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Shipment Management</CardTitle>
                <CardDescription>View and manage all shipments ({shipments.length} total)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Tracking ID</TableHead><TableHead>Customer</TableHead><TableHead>Destination</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {shipments.map((s) => (
                      <TableRow key={s.shipment_id}>
                        <TableCell className="font-mono">{s.trackingId}</TableCell>
                        <TableCell>{s.customerName}</TableCell>
                        <TableCell>{s.deliveryAddress}</TableCell>
                        <TableCell><Badge className={getStatusColor(s.status)}>{s.status}</Badge></TableCell>
                        <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" />Add New Shipment</CardTitle>
                <CardDescription>Create a new shipment entry in the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="pickupAddress">Pickup Address</Label><Textarea id="pickupAddress" placeholder="Enter pickup address" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="deliveryAddress">Delivery Address</Label><Textarea id="deliveryAddress" placeholder="Enter delivery address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="weight">Weight (kg)</Label><Input id="weight" type="number" placeholder="e.g., 2.5" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="shipmentType">Shipment Type</Label><Input id="shipmentType" placeholder="e.g., Package" value={shipmentType} onChange={(e) => setShipmentType(e.target.value)} /></div>
                </div>
                <Button onClick={addShipment} className="w-full">Add Shipment</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="update">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5" />Update Shipment Status</CardTitle>
                <CardDescription>Change the status of an existing shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="selectShipment">Select Shipment</Label>
                  <Select value={selectedShipmentId} onValueChange={setSelectedShipmentId}>
                    <SelectTrigger><SelectValue placeholder="Choose a shipment to update" /></SelectTrigger>
                    <SelectContent>
                      {shipments.map((s) => (<SelectItem key={s.shipment_id} value={String(s.shipment_id)}>{s.trackingId} - {s.customerName}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selectStatus">New Status</Label>
                  <Select value={newStatus} onValueChange={(value: Shipment["status"]) => setNewStatus(value)}>
                    <SelectTrigger><SelectValue placeholder="Select new status" /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={updateShipmentStatus} className="w-full">Update Status</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}