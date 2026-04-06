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
import { LayoutDashboardIcon, ChartBarIcon, Settings2Icon, CommandIcon, DatabaseIcon, UsersIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { logoutAction } from "@/lib/actions/auth-actions"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<any>({ name: "", email: "", avatar: "", role: "admin" })

  const router = useRouter();

  React.useEffect(() => {
    // Only access localStorage on the client side
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      const res = await logoutAction();
      if (res.success) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Define nav links dynamically based on role
  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Records",
      url: "/dashboard/records",
      icon: <DatabaseIcon />,
    },
  ];

  if (user?.role === "admin" || user?.role === "analyst") {
    navMain.push({
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: <ChartBarIcon />,
    });
  }

  if (user?.role === "admin") {
    navMain.push({
      title: "Users",
      url: "/dashboard/users",
      icon: <UsersIcon />,
    });
  }

  // Also include settings depending on requirement, let's keep it for everyone or admin?
  // Let's keep it available.
  navMain.push({
    title: "Settings",
    url: "/dashboard/settings",
    icon: <Settings2Icon />,
  });

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
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser handleLogout={handleLogout} user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
