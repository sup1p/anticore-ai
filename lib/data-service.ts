// Data service abstraction for easy backend integration
export interface Contract {
  id: string
  customer: string
  supplier: string
  amount: number
  category: string
  date: string
  participantsCount: number
  riskScore: number
  riskIndicators: string[]
  status: "completed" | "in_progress" | "cancelled"
}

export interface SystemStats {
  totalContracts: number
  highRiskCount: number
  mediumRiskCount: number
  lowRiskCount: number
  averageAmount: number
  detectionAccuracy: number
  totalSavings: number
  flaggedToday: number
}

export interface AlgorithmMetrics {
  name: string
  detected: number
  accuracy: number
  description: string
  enabled: boolean
}

// Mock data - replace with actual API calls
const mockContracts: Contract[] = [
  {
    id: "GOV_2024_001",
    customer: "Министерство здравоохранения РК",
    supplier: "ТОО МедТехника Плюс",
    amount: 2450000,
    category: "Медицинское оборудование",
    date: "2024-01-15",
    participantsCount: 1,
    riskScore: 94.2,
    riskIndicators: ["Единственный участник", "Завышенная цена"],
    status: "completed",
  },
  {
    id: "GOV_2024_002",
    customer: "Акимат г. Алматы",
    supplier: "Строительная компания Астана",
    amount: 15750000,
    category: "Строительство и ремонт",
    date: "2024-01-20",
    participantsCount: 2,
    riskScore: 87.5,
    riskIndicators: ["Аффилированность", "Подозрительная цена"],
    status: "completed",
  },
  {
    id: "GOV_2024_003",
    customer: "Министерство образования РК",
    supplier: "IT Solutions KZ",
    amount: 890000,
    category: "IT услуги",
    date: "2024-01-25",
    participantsCount: 4,
    riskScore: 23.1,
    riskIndicators: [],
    status: "completed",
  },
]

const mockStats: SystemStats = {
  totalContracts: 15847,
  highRiskCount: 234,
  mediumRiskCount: 1456,
  lowRiskCount: 14157,
  averageAmount: 2847500,
  detectionAccuracy: 96.8,
  totalSavings: 2840000000,
  flaggedToday: 12,
}

const mockAlgorithms: AlgorithmMetrics[] = [
  {
    name: "Анализ ценовых аномалий",
    detected: 89,
    accuracy: 94.2,
    description: "Выявляет контракты с подозрительно завышенными или заниженными ценами",
    enabled: true,
  },
  {
    name: "Детекция монополизации",
    detected: 34,
    accuracy: 91.7,
    description: "Обнаруживает случаи доминирования одного поставщика у заказчика",
    enabled: true,
  },
  {
    name: "Анализ дробления закупок",
    detected: 67,
    accuracy: 88.9,
    description: "Находит искусственно разделенные крупные контракты",
    enabled: true,
  },
  {
    name: "Проверка конкурентности",
    detected: 156,
    accuracy: 85.4,
    description: "Анализирует уровень конкуренции в тендерах",
    enabled: true,
  },
]

// Data service class - replace methods with actual API calls
export class DataService {
  static async getSystemStats(): Promise<SystemStats> {
    // TODO: Replace with actual API call
    // return await fetch('/api/stats').then(res => res.json())
    return new Promise((resolve) => setTimeout(() => resolve(mockStats), 500))
  }

  static async getContracts(filters?: {
    riskLevel?: "high" | "medium" | "low"
    category?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<Contract[]> {
    // TODO: Replace with actual API call
    // return await fetch('/api/contracts', { method: 'POST', body: JSON.stringify(filters) }).then(res => res.json())
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockContracts]
        if (filters?.riskLevel) {
          filtered = filtered.filter((contract) => {
            if (filters.riskLevel === "high") return contract.riskScore >= 80
            if (filters.riskLevel === "medium") return contract.riskScore >= 40 && contract.riskScore < 80
            return contract.riskScore < 40
          })
        }
        resolve(filtered)
      }, 300)
    })
  }

  static async getAlgorithmMetrics(): Promise<AlgorithmMetrics[]> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => setTimeout(() => resolve(mockAlgorithms), 400))
  }

  static async updateAlgorithmSettings(algorithmName: string, settings: any): Promise<boolean> {
    // TODO: Replace with actual API call
    console.log("Updating algorithm settings:", algorithmName, settings)

    // Обновляем локальные данные
    const algorithmIndex = mockAlgorithms.findIndex((alg) => alg.name === algorithmName)
    if (algorithmIndex !== -1) {
      mockAlgorithms[algorithmIndex] = { ...mockAlgorithms[algorithmIndex], ...settings }
    }

    return new Promise((resolve) => setTimeout(() => resolve(true), 200))
  }

  static async exportData(format: "pdf" | "excel" | "csv"): Promise<string> {
    // TODO: Replace with actual API call
    console.log("Exporting data in format:", format)
    return new Promise((resolve) => setTimeout(() => resolve(`/downloads/report.${format}`), 1000))
  }

  static async getUpdatedAlgorithmMetrics(): Promise<AlgorithmMetrics[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...mockAlgorithms]), 100))
  }
}
