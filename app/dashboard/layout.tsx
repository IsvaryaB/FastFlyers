import type React from "react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] bg-muted/40">
      <SidebarNav />
      <div className="flex-1 p-8 md:p-10">{children}</div>
    </div>
  )
}
