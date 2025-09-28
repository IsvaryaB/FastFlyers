"use client"

import { PackageIcon, MapPinIcon, HeadsetIcon, CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function ServiceHighlights() {
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  const services = [
    {
      icon: PackageIcon,
      title: "Easy Booking",
      description: "Effortless online booking with flexible options.",
      image: "/images/easy-booking.png", // Using new Easy Booking image for booking
    },
    {
      icon: MapPinIcon,
      title: "Real-time Tracking",
      description: "Monitor your shipment's journey from pickup to delivery.",
      image: "/images/real-time-tracking.jpg",
    },
    {
      icon: CalendarIcon,
      title: "Wide Coverage",
      description: "Delivering across 50+ cities with reliable service.",
      image: "/images/global-shipping.jpg",
    },
    {
      icon: HeadsetIcon,
      title: "24/7 Support",
      description: "Dedicated customer support whenever you need it.",
      image: "/images/24-7-support.jpg",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-balance text-3xl font-bold tracking-tighter sm:text-5xl"
          >
            Our Core Services Since-2010
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
          >
            Experience seamless logistics with FastFlyer.
          </motion.p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className="flex h-full flex-col items-center justify-center p-6 text-center shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                onTouchStart={() => setHoveredService(index)}
              >
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {hoveredService !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setHoveredService(null)}
            onTouchEnd={() => setHoveredService(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[80vh] p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={services[hoveredService].image || "/placeholder.svg"}
                alt={services[hoveredService].title}
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute top-2 right-2 text-white/80 text-sm bg-black/50 px-2 py-1 rounded">
                {services[hoveredService].title}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
