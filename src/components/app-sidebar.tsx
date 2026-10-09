/**
 * App Sidebar
 * Role-aware dashboard navigation shell
 */

import * as React from "react"
import { Home, BookOpen, Users, Sparkles, PlusCircle, ClipboardList, History } from "lucide-react"

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
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"

// Base navigation items (for all users)
const baseNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Explore",
    url: "/explore",
    icon: Sparkles,
  },
  {
    title: "Classrooms",
    url: "/classrooms",
    icon: Users,
  },
]

// Teacher-specific navigation items
const teacherNavItems = [
  { title: "Create Quiz", url: "/quiz/create", icon: PlusCircle },
  { title: "My Quizzes", url: "/quizzes", icon: ClipboardList },
  { title: "History", url: "/history", icon: History },
]

const studentNavItems = [
  { title: "Quizzes", url: "/quizzes", icon: BookOpen },
  { title: "History", url: "/history", icon: History },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Build navigation based on user role
  const navMain = React.useMemo(() => {
    const teaches = user?.role === 'teacher' || user?.role === 'admin'
    if (teaches) {
      return [
        baseNavItems[0],
        teacherNavItems[0],
        teacherNavItems[1],
        baseNavItems[2],
        baseNavItems[1],
        teacherNavItems[2],
      ]
    }
    return [...baseNavItems, ...studentNavItems]
  }, [user?.role])
  return (
    <Sidebar style={{ border: 'none' }} collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
                  K
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Kahoot.uz</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
