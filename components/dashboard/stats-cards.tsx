"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Shield, DollarSign, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { SystemStats } from "@/lib/data-service"

interface StatsCardsProps {
  stats: SystemStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Всего контрактов",
      value: stats.totalContracts.toLocaleString(),
      icon: FileText,
      color: "bg-blue-500",
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Высокий риск",
      value: stats.highRiskCount.toString(),
      icon: AlertTriangle,
      color: "bg-red-500",
      change: "-8.2%",
      changeType: "negative" as const,
      badge: `${((stats.highRiskCount / stats.totalContracts) * 100).toFixed(1)}%`,
    },
    {
      title: "Точность ИИ",
      value: `${stats.detectionAccuracy}%`,
      icon: Shield,
      color: "bg-green-500",
      change: "+2.1%",
      changeType: "positive" as const,
    },
    {
      title: "Экономия бюджета",
      value: `${(stats.totalSavings / 1000000000).toFixed(1)}B ₸`,
      icon: DollarSign,
      color: "bg-emerald-500",
      change: "+15.7%",
      changeType: "positive" as const,
    },
    {
      title: "Обработано сегодня",
      value: stats.flaggedToday.toString(),
      icon: Clock,
      color: "bg-purple-500",
      change: "В реальном времени",
      changeType: "neutral" as const,
    },
    {
      title: "Безопасные сделки",
      value: stats.lowRiskCount.toLocaleString(),
      icon: CheckCircle,
      color: "bg-cyan-500",
      change: "+5.3%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    {card.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {card.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    {card.changeType === "positive" && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                    {card.changeType === "negative" && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                    <span
                      className={`text-sm font-medium ${
                        card.changeType === "positive"
                          ? "text-green-600"
                          : card.changeType === "negative"
                            ? "text-red-600"
                            : "text-gray-500"
                      }`}
                    >
                      {card.change}
                    </span>
                  </div>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
