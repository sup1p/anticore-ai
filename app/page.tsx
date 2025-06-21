"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RiskChart } from "@/components/dashboard/risk-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Database,
  Settings,
  Code,
  AlertTriangle,
} from "lucide-react"
import { DataService, type SystemStats, type Contract, type AlgorithmMetrics } from "@/lib/data-service"

export default function FraudDetectionSystem() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [algorithms, setAlgorithms] = useState<AlgorithmMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, contractsData, algorithmsData] = await Promise.all([
        DataService.getSystemStats(),
        DataService.getContracts(),
        DataService.getAlgorithmMetrics(),
      ])
      setStats(statsData)
      setContracts(contractsData)
      setAlgorithms(algorithmsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const Dashboard = () => {
    if (!stats) return <div>Загрузка...</div>

    const trendData = [
      { month: "Янв", detected: 45, saved: 120 },
      { month: "Фев", detected: 52, saved: 145 },
      { month: "Мар", detected: 38, saved: 98 },
      { month: "Апр", detected: 61, saved: 167 },
      { month: "Май", detected: 49, saved: 134 },
      { month: "Июн", detected: 67, saved: 189 },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
            <p className="text-gray-600 mt-1">Мониторинг системы детекции коррупционных рисков в реальном времени</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Обновить
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </div>

        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskChart stats={stats} />

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Динамика обнаружений</CardTitle>
              <p className="text-sm text-gray-600">Количество выявленных нарушений по месяцам</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="detected"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const DetectionSystem = () => {
    const toggleAlgorithm = async (algorithmName: string) => {
      const updatedAlgorithms = algorithms.map((alg) =>
        alg.name === algorithmName ? { ...alg, enabled: !alg.enabled } : alg,
      )
      setAlgorithms(updatedAlgorithms)

      // Отправляем изменения на сервер
      try {
        await DataService.updateAlgorithmSettings(algorithmName, {
          enabled: !algorithms.find((a) => a.name === algorithmName)?.enabled,
        })
      } catch (error) {
        console.error("Ошибка обновления настроек алгоритма:", error)
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Система детекции</h1>
            <p className="text-gray-600 mt-1">ИИ-алгоритмы для выявления коррупционных рисков</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Zap className="h-3 w-3 mr-1" />
            Активна
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {algorithms.map((algorithm, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">{algorithm.name}</CardTitle>
                  <Switch checked={algorithm.enabled} onCheckedChange={() => toggleAlgorithm(algorithm.name)} />
                </div>
                <p className="text-sm text-gray-600">{algorithm.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Обнаружено случаев</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {algorithm.detected}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Точность</span>
                    <span className="text-lg font-bold text-green-600">{algorithm.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${algorithm.enabled ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gray-400"
                        }`}
                      style={{ width: `${algorithm.enabled ? algorithm.accuracy : 0}%` }}
                    />
                  </div>
                  {!algorithm.enabled && <p className="text-xs text-gray-500 italic">Алгоритм отключен</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Производительность алгоритмов</CardTitle>
            <p className="text-sm text-gray-600">Сравнение точности работы различных алгоритмов детекции</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={algorithms.filter((alg) => alg.enabled)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ContractsView = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [riskFilter, setRiskFilter] = useState("all")

    const getRiskBadge = (score: number) => {
      if (score >= 80) return <Badge className="bg-red-100 text-red-800 border-red-200">Высокий</Badge>
      if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Средний</Badge>
      return <Badge className="bg-green-100 text-green-800 border-green-200">Низкий</Badge>
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "completed":
          return <CheckCircle2 className="h-4 w-4 text-green-500" />
        case "in_progress":
          return <Clock className="h-4 w-4 text-yellow-500" />
        default:
          return <AlertCircle className="h-4 w-4 text-red-500" />
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Анализ контрактов</h1>
            <p className="text-gray-600 mt-1">Детальный обзор государственных закупок</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по контрактам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Фильтр по риску" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все уровни</SelectItem>
                  <SelectItem value="high">Высокий риск</SelectItem>
                  <SelectItem value="medium">Средний риск</SelectItem>
                  <SelectItem value="low">Низкий риск</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Контракт
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Заказчик
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Риск
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contract.id}</div>
                          <div className="text-sm text-gray-500">{contract.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{contract.customer}</div>
                        <div className="text-sm text-gray-500">{contract.supplier}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{contract.amount.toLocaleString()} ₸</div>
                        <div className="text-sm text-gray-500">{contract.participantsCount} участников</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getRiskBadge(contract.riskScore)}
                          <span className="text-sm text-gray-600">{contract.riskScore}%</span>
                        </div>
                        {contract.riskIndicators.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {contract.riskIndicators.slice(0, 2).map((indicator, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(contract.status)}
                          <span className="text-sm text-gray-600 capitalize">
                            {contract.status === "completed" ? "Завершен" : "В процессе"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const Analytics = () => {
    const monthlyData = [
      { month: "Янв", contracts: 1200, flagged: 45, savings: 120 },
      { month: "Фев", contracts: 1350, flagged: 52, savings: 145 },
      { month: "Мар", contracts: 1100, flagged: 38, savings: 98 },
      { month: "Апр", contracts: 1450, flagged: 61, savings: 167 },
      { month: "Май", contracts: 1300, flagged: 49, savings: 134 },
      { month: "Июн", contracts: 1500, flagged: 67, savings: 189 },
    ]

    const categoryRisks = [
      { category: "Строительство", risk: 15.2, contracts: 450 },
      { category: "Медоборудование", risk: 22.8, contracts: 230 },
      { category: "IT услуги", risk: 8.1, contracts: 180 },
      { category: "Транспорт", risk: 12.4, contracts: 320 },
      { category: "Образование", risk: 6.7, contracts: 290 },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Аналитика и отчеты</h1>
          <p className="text-gray-600 mt-1">Глубокий анализ эффективности системы детекции коррупционного риска</p>
        </div>

        {/* Ключевые показатели */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">89.3%</div>
              <div className="text-sm text-gray-600">Эффективность детекции</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">2.8B ₸</div>
              <div className="text-sm text-gray-600">Предотвращенный ущерб</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">312</div>
              <div className="text-sm text-gray-600">Выявлено нарушений</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">15.7%</div>
              <div className="text-sm text-gray-600">Средний уровень риска</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Динамика обработки контрактов</CardTitle>
              <p className="text-sm text-gray-600">
                Синяя линия показывает общее количество обработанных контрактов, красная - количество контрактов с
                выявленными нарушениями по месяцам
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => [
                        value,
                        name === "contracts" ? "Всего контрактов" : "Выявлено нарушений",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="contracts"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                      name="contracts"
                    />
                    <Line
                      type="monotone"
                      dataKey="flagged"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                      name="flagged"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Экономия бюджета</CardTitle>
              <p className="text-sm text-gray-600">
                График показывает сумму предотвращенного ущерба в миллионах тенге благодаря выявлению коррупционных рисков
                системой ИИ
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${value} млн ₸`, "Экономия"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="savings"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Анализ по категориям */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Анализ рисков по категориям</CardTitle>
            <p className="text-sm text-gray-600">
              Процент контрактов с высоким риском в различных категориях закупок. Помогает выявить наиболее проблемные
              сферы государственных закупок
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryRisks} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="category" type="category" stroke="#666" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [
                      name === "risk" ? `${value}%` : value,
                      name === "risk" ? "Уровень риска" : "Количество контрактов",
                    ]}
                  />
                  <Bar dataKey="risk" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Сводная таблица */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Детальная статистика по категориям</CardTitle>
            <p className="text-sm text-gray-600">
              Подробная разбивка показателей риска и количества контрактов по каждой категории закупок
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Категория</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Всего контрактов</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Уровень риска</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categoryRisks.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.contracts}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          className={
                            item.risk > 20
                              ? "bg-red-100 text-red-800"
                              : item.risk > 10
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {item.risk}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {item.risk > 20 ? (
                          <span className="text-red-600">Требует внимания</span>
                        ) : item.risk > 10 ? (
                          <span className="text-yellow-600">Умеренный риск</span>
                        ) : (
                          <span className="text-green-600">Низкий риск</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const APISettings = () => {
    const [apiKey, setApiKey] = useState("sk-1234567890abcdef")
    const [webhookUrl, setWebhookUrl] = useState("")
    const [riskThreshold, setRiskThreshold] = useState([75])
    const [autoExport, setAutoExport] = useState(true)
    const [autoNotifications, setAutoNotifications] = useState(true)
    const [exportFormat, setExportFormat] = useState("pdf")
    const [isExporting, setIsExporting] = useState(false)
    const [lastExport, setLastExport] = useState<string | null>(null)

    const handleExport = async (format: "pdf" | "excel" | "csv") => {
      setIsExporting(true)
      setExportFormat(format)

      try {
        // Симуляция экспорта данных
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const timestamp = new Date().toLocaleString("ru-RU")
        setLastExport(`${format.toUpperCase()} отчет создан ${timestamp}`)

        // В реальном приложении здесь будет вызов API
        // const downloadUrl = await DataService.exportData(format)
        // window.open(downloadUrl, '_blank')
      } catch (error) {
        console.error("Ошибка экспорта:", error)
      } finally {
        setIsExporting(false)
      }
    }

    const handleSaveSettings = async () => {
      try {
        // В реальном приложении здесь будет сохранение настроек
        console.log("Сохранение настроек:", {
          apiKey,
          webhookUrl,
          riskThreshold: riskThreshold[0],
          autoExport,
          autoNotifications,
        })

        // Показать уведомление об успешном сохранении
        alert("Настройки успешно сохранены!")
      } catch (error) {
        console.error("Ошибка сохранения настроек:", error)
        alert("Ошибка при сохранении настроек")
      }
    }

    const handleTestConnection = async () => {
      try {
        // Симуляция тестирования подключения
        await new Promise((resolve) => setTimeout(resolve, 1500))
        alert("Подключение к API успешно установлено!")
      } catch (error) {
        alert("Ошибка подключения к API")
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API и настройки</h1>
          <p className="text-gray-600 mt-1">
            Конфигурация системы, интеграция с внешними сервисами и управление данными
          </p>
        </div>

        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>API Интеграция</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Настройки системы</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Управление данными</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-6">

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Пример использования API</CardTitle>
                <p className="text-sm text-gray-600">
                  Код для интеграции системы детекции коррупционного риска в ваше приложение
                </p>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                  {`# Анализ контракта на предмет коррупционного риска
curl -X POST https://api.fraudguard.kz/analyze \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contract_id": "GOV_2024_001",
    "amount": 2450000,
    "supplier": "ТОО МедТехника Плюс",
    "customer": "Министерство здравоохранения РК",
    "participants_count": 1,
    "category": "Медицинское оборудование"
  }'

# Ответ системы
{
  "risk_score": 94.2,
  "risk_level": "high",
  "indicators": ["single_participant", "price_anomaly"],
  "recommendation": "Требует детальной проверки"
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Пороги детекции рисков</CardTitle>
                <p className="text-sm text-gray-600">
                  Настройте чувствительность системы к различным типам нарушений. Более низкие значения = больше
                  срабатываний
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Внимание</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Изменение порогов влияет на количество выявляемых нарушений. Слишком низкие значения могут привести
                    к ложным срабатываниям.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Порог высокого риска: {riskThreshold[0]}%
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Контракты с риском выше этого значения будут помечены как "высокий риск" и потребуют немедленной
                    проверки
                  </p>
                  <Slider
                    value={riskThreshold}
                    onValueChange={setRiskThreshold}
                    max={100}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50% (Очень чувствительно)</span>
                    <span>100% (Только критические)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Управление алгоритмами детекции</h3>
                  <p className="text-sm text-gray-600">
                    Включите или отключите отдельные алгоритмы в зависимости от ваших потребностей
                  </p>

                  {algorithms.map((algorithm, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{algorithm.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{algorithm.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            Точность: <span className="font-medium text-green-600">{algorithm.accuracy}%</span>
                          </span>
                          <span className="text-xs text-gray-500">
                            Обнаружено: <span className="font-medium">{algorithm.detected} случаев</span>
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Switch
                          checked={algorithm.enabled}
                          onCheckedChange={async (checked) => {
                            // Обновляем локальное состояние немедленно
                            const updatedAlgorithms = algorithms.map((alg) =>
                              alg.name === algorithm.name ? { ...alg, enabled: checked } : alg,
                            )
                            setAlgorithms(updatedAlgorithms)

                            // Отправляем изменения на сервер
                            try {
                              await DataService.updateAlgorithmSettings(algorithm.name, { enabled: checked })
                            } catch (error) {
                              console.error("Ошибка обновления настроек алгоритма:", error)
                              // Откатываем изменения при ошибке
                              setAlgorithms(algorithms)
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <Button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700">
                    Применить настройки
                  </Button>
                  <Button variant="outline">Восстановить по умолчанию</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Экспорт отчетов и данных</CardTitle>
                <p className="text-sm text-gray-600">
                  Создавайте детальные отчеты о работе системы детекции для руководства и контролирующих органов
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Download className="h-4 w-4 text-red-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">PDF Отчет</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Полный отчет с графиками, таблицами и анализом для презентации руководству
                    </p>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => handleExport("pdf")}
                      disabled={isExporting && exportFormat === "pdf"}
                    >
                      {isExporting && exportFormat === "pdf" ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Создание PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Скачать PDF
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Download className="h-4 w-4 text-green-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Excel Таблица</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Данные в формате Excel для дальнейшего анализа и обработки в других системах
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => handleExport("excel")}
                      disabled={isExporting && exportFormat === "excel"}
                    >
                      {isExporting && exportFormat === "excel" ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Создание Excel...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Скачать Excel
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Download className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">CSV Данные</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Сырые данные в формате CSV для импорта в базы данных и аналитические системы
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => handleExport("csv")}
                      disabled={isExporting && exportFormat === "csv"}
                    >
                      {isExporting && exportFormat === "csv" ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Создание CSV...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Скачать CSV
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {lastExport && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Экспорт завершен</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">{lastExport}</p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Автоматический экспорт</h3>
                    <p className="text-sm text-gray-500">
                      Создавать еженедельные отчеты автоматически и отправлять на указанный email
                    </p>
                  </div>
                  <Switch checked={autoExport} onCheckedChange={setAutoExport} />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Статистика системы</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-500">Полнота данных:</span>
                      <div className="font-medium text-green-600 text-lg">98.7%</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-500">Последнее обновление:</span>
                      <div className="font-medium text-lg">2 мин назад</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-500">Размер базы данных:</span>
                      <div className="font-medium text-lg">2.4 ГБ</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-500">Обработано сегодня:</span>
                      <div className="font-medium text-lg">1,247</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "detection":
        return <DetectionSystem />
      case "contracts":
        return <ContractsView />
      case "analytics":
        return <Analytics />
      case "api":
        return <APISettings />
      default:
        return <Dashboard />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка системы...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">{renderContent()}</main>
    </div>
  )
}
