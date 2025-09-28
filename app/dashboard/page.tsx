"use client"

import { BookingsTable } from "@/components/dashboard/bookings-table"
import { motion } from "framer-motion"

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl font-bold gradient-text"
      >
        Dashboard Overview
      </motion.h1>
      <BookingsTable />
    </motion.div>
  )
}
