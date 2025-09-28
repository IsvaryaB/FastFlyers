"use client"

import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  pickupAddress: z.string().min(10, { message: "Pickup address is required." }),
  deliveryAddress: z.string().min(10, { message: "Delivery address is required." }),
  shipmentType: z.string().min(1, { message: "Shipment type is required." }),
  weight: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: "Weight must be a number." })
    .min(1, { message: "Weight is required." }),
  serviceSpeed: z.enum(["Standard", "Express", "Same Day"]),
})

export function BookingForm() {
  const router = useRouter()
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
      shipmentType: "",
      weight: "",
      serviceSpeed: "Standard",
    },
  })

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          weight: parseFloat(values.weight), // Ensure weight is a number
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to book shipment.")
      }

      const result = await response.json()
      setTrackingId(result.trackingId)
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message)
      console.error("Booking failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl bg-card p-8 text-center shadow-2xl glass-effect"
      >
        <h2 className="text-3xl font-bold text-primary gradient-text">Booking Confirmed!</h2>
        <p className="mt-4 text-lg text-foreground">Your shipment has been successfully booked.</p>
        <p className="mt-2 text-xl font-semibold text-accent">Tracking ID: {trackingId}</p>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button asChild className="gradient-primary mt-6 w-full text-lg hover-lift">
            <Link href={`/track?id=${trackingId}`}>Track Your Shipment</Link>
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="mt-4 w-full text-lg hover-lift bg-transparent"
            onClick={() => {
              setIsSubmitted(false)
              setTrackingId(null)
              form.reset()
            }}
          >
            Book Another Shipment
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl rounded-xl bg-card p-8 shadow-2xl glass-effect"
    >
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold gradient-text">Book a New Shipment</CardTitle>
        <p className="text-muted-foreground">Fill out the details below to book your courier.</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={itemVariants} initial="hidden" animate="show">
              <FormField
                control={form.control}
                name="pickupAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter pickup address" {...field} className="min-h-[80px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants} initial="hidden" animate="show">
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter delivery address" {...field} className="min-h-[80px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <motion.div variants={itemVariants} initial="hidden" animate="show">
                <FormField
                  control={form.control}
                  name="shipmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shipment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Document">Document</SelectItem>
                          <SelectItem value="Package">Package</SelectItem>
                          <SelectItem value="Fragile">Fragile Item</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={itemVariants} initial="hidden" animate="show">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter weight" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>
            <motion.div variants={itemVariants} initial="hidden" animate="show">
              <FormField
                control={form.control}
                name="serviceSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Speed</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service speed" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Express">Express</SelectItem>
                        <SelectItem value="Same Day">Same Day</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="gradient-primary w-full text-lg hover-lift" disabled={isLoading}>
                {isLoading ? "Booking..." : "Book Shipment"}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </motion.div>
  )
}
