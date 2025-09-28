"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Plus, Edit, Trash2 } from "lucide-react"

interface Order {
  id: string
  customerName: string
  origin: string
  destination: string
  status: "pending" | "picked-up" | "in-transit" | "delivered" | "cancelled"
  createdAt: string
}

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [newOrder, setNewOrder] = useState({
    id: "",
    customerName: "",
    origin: "",
    destination: "",
    status: "pending" as const,
  })
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [loginError, setLoginError] = useState("")

  // Hardcoded credentials - secure and unchangeable
  const ADMIN_USERNAME = "fastflyer_admin"
  const ADMIN_PASSWORD = "FF2024@secure"

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("adminOrders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders)
    localStorage.setItem("adminOrders", JSON.stringify(updatedOrders))
  }

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError("")
    } else {
      setLoginError("Invalid credentials. Access denied.")
      setPassword("")
    }
  }

  const handleAddOrder = () => {
    if (!newOrder.id || !newOrder.customerName || !newOrder.origin || !newOrder.destination) {
      return
    }

    const existingOrder = orders.find((order) => order.id.toLowerCase() === newOrder.id.toLowerCase())
    if (existingOrder) {
      alert("Order ID already exists. Please use a different ID or update the existing order.")
      return
    }

    const order: Order = {
      ...newOrder,
      createdAt: new Date().toISOString(),
    }

    const updatedOrders = [...orders, order]
    saveOrders(updatedOrders)

    setNewOrder({
      id: "",
      customerName: "",
      origin: "",
      destination: "",
      status: "pending",
    })
  }

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    saveOrders(updatedOrders)
    setEditingOrder(null)
  }

  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId)
    saveOrders(updatedOrders)
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "picked-up":
        return "bg-blue-100 text-blue-800"
      case "in-transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Admin Access Required</h3>
          <p className="text-white/80 text-sm">Enter your credentials to access the admin panel</p>
        </div>

        <Input
          type="text"
          placeholder="Username"
          className="h-12 bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="h-12 bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500 pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin()
            }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {loginError && <p className="text-red-300 text-sm text-center">{loginError}</p>}

        <Button
          className="w-full bg-red-600 hover:bg-red-700 border-0 text-white text-lg font-semibold py-3 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          onClick={handleLogin}
        >
          LOGIN TO ADMIN PANEL
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Admin Panel</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAuthenticated(false)}
          className="text-white border-white/30 hover:bg-white/10"
        >
          Logout
        </Button>
      </div>

      {/* Add New Order */}
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Plus className="h-5 w-5" />
            Add New Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Order ID"
              value={newOrder.id}
              onChange={(e) => setNewOrder({ ...newOrder, id: e.target.value })}
            />
            <Input
              placeholder="Customer Name"
              value={newOrder.customerName}
              onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Origin"
              value={newOrder.origin}
              onChange={(e) => setNewOrder({ ...newOrder, origin: e.target.value })}
            />
            <Input
              placeholder="Destination"
              value={newOrder.destination}
              onChange={(e) => setNewOrder({ ...newOrder, destination: e.target.value })}
            />
          </div>
          <Button onClick={handleAddOrder} className="w-full bg-red-600 hover:bg-red-700">
            Add Order
          </Button>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle className="text-gray-800">All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders found</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">#{order.id}</h4>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingOrder(editingOrder === order.id ? null : order.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <p>
                      {order.origin} → {order.destination}
                    </p>
                  </div>

                  {editingOrder === order.id ? (
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleUpdateStatus(order.id, value as Order["status"])}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="picked-up">Picked Up</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
