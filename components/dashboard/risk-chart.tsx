"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { SystemStats } from "@/lib/data-service"

interface RiskChartProps {
  stats: SystemStats
}

export function RiskChart({ stats }: RiskChartProps) {
  const data = [
    {
      name: "Низкий риск",
      value: stats.lowRiskCount,
      color: "#10B981",
      percentage: ((stats.lowRiskCount / stats.totalContracts) * 100).toFixed(1),
    },
    {
      name: "Средний риск",
      value: stats.mediumRiskCount,
      color: "#F59E0B",
      percentage: ((stats.mediumRiskCount / stats.totalContracts) * 100).toFixed(1),
    },
    {
      name: "Высокий риск",
      value: stats.highRiskCount,
      color: "#EF4444",
      percentage: ((stats.highRiskCount / stats.totalContracts) * 100).toFixed(1),
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">Контрактов: {data.value.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Процент: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">Распределение рисков</CardTitle>
        <p className="text-sm text-gray-600">
          Анализ {stats.totalContracts.toLocaleString()} контрактов по уровню риска
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>
                    {value} ({entry.payload.percentage}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
