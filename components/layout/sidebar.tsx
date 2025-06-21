"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Brain,
  FileText,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      id: "dashboard",
      label: "Главная панель",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "detection",
      label: "Система детекции",
      icon: Brain,
      badge: "AI",
    },
    {
      id: "contracts",
      label: "Контракты",
      icon: FileText,
      badge: "234",
    },
    {
      id: "analytics",
      label: "Аналитика",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "api",
      label: "API & Настройки",
      icon: Settings,
      badge: null,
    },
  ]

  return (
    <div className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex flex-col sticky top-0`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="font-bold text-gray-900">FraudGuard</h1>
                <p className="text-xs text-gray-500">AI Detection System</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-11 ${isActive ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-gray-700 hover:bg-gray-100"
                  } ${collapsed ? "px-2" : "px-3"}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={isActive ? "secondary" : "outline"}
                        className={`ml-2 ${isActive ? "bg-white/20 text-white border-white/30" : ""}`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {!collapsed && (
        <div className="absolute bottom-4 left-4 w-56">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Угрозы</span>
            </div>
            <p className="text-2xl font-bold text-amber-900 mt-1">12</p>
            <p className="text-xs text-amber-700">Требуют проверки</p>
          </div>
        </div>
      )}
    </div>
  )
}
