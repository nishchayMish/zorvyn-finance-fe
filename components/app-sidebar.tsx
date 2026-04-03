"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ChartBarIcon, Settings2Icon, CommandIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: (
        <ChartBarIcon
        />
      ),
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: (
        <Settings2Icon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await api.post("/users/logout");
      if (res.status === 200) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Sidebar className="border-r" collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-white/8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <button className="cursor-pointer text-white" onClick={() => router.push("/dashboard")}>
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Zorvyn</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser handleLogout={handleLogout} user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
