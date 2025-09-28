"use client"

import { Header } from "@/components/landing/header"
import { FooterSection } from "@/components/landing/footer-section"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground">Get in touch with FastFlyer for all your shipping needs</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="bg-card p-8 rounded-lg shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-6 text-foreground">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-muted-foreground">9367913093</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">info@fastflyer.in</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Business Hours</h3>
                      <p className="text-muted-foreground">Mon - Sat: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Service Areas</h3>
                      <p className="text-muted-foreground">Pan India Express Delivery</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-card p-8 rounded-lg shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-6 text-foreground">Why Choose FastFlyer?</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Fast and reliable express delivery across India</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Real-time tracking for all your shipments</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Secure and safe handling of your packages</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Competitive pricing with no hidden charges</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <p className="text-muted-foreground">24/7 customer support for all your queries</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">Need Immediate Assistance?</h3>
                  <p className="text-red-700 text-sm">
                    Call us directly at <strong>9367913093</strong> for urgent shipping requirements or any queries.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
