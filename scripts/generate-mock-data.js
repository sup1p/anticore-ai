// Mock data generation for procurement fraud detection system
const fs = require("fs")

// Generate mock procurement contracts data
function generateMockContracts(count = 1000) {
  const contracts = []
  const customers = [
    "АКИМАТ АЛМАТЫ",
    "МИН ОБОРОНЫ",
    "МИН ЗДРАВООХРАНЕНИЯ",
    "МИН ОБРАЗОВАНИЯ",
    "АКИМАТ АСТАНЫ",
    "МИН ТРАНСПОРТА",
    "МИН ЭНЕРГЕТИКИ",
    "АКИМАТ ШЫМКЕНТА",
  ]

  const suppliers = [
    "ТОО СТРОЙ ПЛЮС",
    "ИП СМИРНОВ",
    "ТОО ТЕХНИК СЕРВИС",
    "ТОО МЕДТЕХ",
    "ТОО АЛЬФА СТРОЙ",
    "ИП ИВАНОВ",
    "ТОО БЕТА СЕРВИС",
    "ТОО ГАММА ПЛЮС",
  ]

  const categories = [
    "СТРОИТЕЛЬСТВО",
    "МЕДОБОРУДОВАНИЕ",
    "IT УСЛУГИ",
    "ТРАНСПОРТ",
    "ОБРАЗОВАНИЕ",
    "ЭНЕРГЕТИКА",
    "БЕЗОПАСНОСТЬ",
    "КОНСАЛТИНГ",
  ]

  for (let i = 1; i <= count; i++) {
    const baseAmount = Math.random() * 2000000 + 50000
    const participantsCount = Math.floor(Math.random() * 8) + 1

    // Introduce some high-risk patterns
    let riskScore = Math.random() * 100
    const riskIndicators = []

    // Price anomaly (10% chance)
    if (Math.random() < 0.1) {
      riskScore = Math.max(riskScore, 85 + Math.random() * 15)
      riskIndicators.push("Аномалия цены")
    }

    // Single participant (15% chance)
    if (participantsCount === 1) {
      riskScore = Math.max(riskScore, 70 + Math.random() * 20)
      riskIndicators.push("Единственный участник")
    }

    // Monopolization (5% chance)
    if (Math.random() < 0.05) {
      riskScore = Math.max(riskScore, 80 + Math.random() * 15)
      riskIndicators.push("Монополизация")
    }

    // Contract fragmentation (3% chance)
    if (Math.random() < 0.03) {
      riskScore = Math.max(riskScore, 75 + Math.random() * 20)
      riskIndicators.push("Дробление")
    }

    contracts.push({
      id: `TNR_${String(i).padStart(6, "0")}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      amount: Math.round(baseAmount),
      category: categories[Math.floor(Math.random() * categories.length)],
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
      participantsCount,
      riskScore: Math.round(riskScore * 10) / 10,
      riskIndicators,
      status: Math.random() < 0.9 ? "completed" : "in_progress",
    })
  }

  return contracts
}

// Generate and save mock data
const mockContracts = generateMockContracts(1000)

// Calculate statistics
const highRisk = mockContracts.filter((c) => c.riskScore >= 90).length
const mediumRisk = mockContracts.filter((c) => c.riskScore >= 70 && c.riskScore < 90).length
const lowRisk = mockContracts.filter((c) => c.riskScore < 70).length
const averageAmount = Math.round(mockContracts.reduce((sum, c) => sum + c.amount, 0) / mockContracts.length)

console.log("Mock Data Generated:")
console.log(`Total contracts: ${mockContracts.length}`)
console.log(`High risk: ${highRisk} (${((highRisk / mockContracts.length) * 100).toFixed(1)}%)`)
console.log(`Medium risk: ${mediumRisk} (${((mediumRisk / mockContracts.length) * 100).toFixed(1)}%)`)
console.log(`Low risk: ${lowRisk} (${((lowRisk / mockContracts.length) * 100).toFixed(1)}%)`)
console.log(`Average amount: ${averageAmount.toLocaleString()} ₸`)

// Save to JSON file (in a real app, this would go to a database)
const mockData = {
  contracts: mockContracts,
  statistics: {
    total: mockContracts.length,
    highRisk,
    mediumRisk,
    lowRisk,
    averageAmount,
    detectionAccuracy: 99.1,
  },
}

console.log("\nMock data generation completed successfully!")
console.log(
  "In a real implementation, this data would be stored in a database and updated via API integration with the EOZ system.",
)
