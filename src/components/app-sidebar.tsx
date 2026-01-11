import * as React from "react"
import { GraduationCap, Home, BookOpen, Users, Settings, LifeBuoy, Sparkles, PlusCircle, BarChart3, ClipboardList } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
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
  {
    title: "My Quizzes",
    url: "/quizzes",
    icon: ClipboardList,
  },
  {
    title: "Create Quiz",
    url: "/quiz/create",
    icon: PlusCircle,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
]

// Student-specific navigation items
const studentNavItems = [
  {
    title: "My Quizzes",
    url: "/quizzes",
    icon: BookOpen,
  },
]

const navSecondary = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    url: "/support",
    icon: LifeBuoy,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Build navigation based on user role
  const navMain = React.useMemo(() => {
    const isTeacher = user?.role === 'teacher'
    const roleItems = isTeacher ? teacherNavItems : studentNavItems
    
    return [...baseNavItems, ...roleItems]
  }, [user?.role])
  return (
    <Sidebar style={{ border: 'none' }} collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Quizo</span>
                  <span className="truncate text-xs">Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
