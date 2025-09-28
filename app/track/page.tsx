import { OrderTracker } from "@/components/tracking/order-tracker"

export default function TrackPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background py-12">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Track Your Shipment</h1>
          <p className="text-muted-foreground text-lg">Get real-time updates on your package delivery status</p>
        </div>
        <OrderTracker />
      </div>
    </div>
  )
}
