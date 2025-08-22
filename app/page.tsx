"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, LineChart, Line, ResponsiveContainer } from "recharts"
import { DollarSign, Calendar, BarChart3, Plus, FileText } from "lucide-react"
import Link from "next/link"

// Sample data - In real app, this would come from backend APIs
const expenseData = [
  { name: "Utilities", value: 21300, color: "#ef4444" },
  { name: "Shopping", value: 12500, color: "#f97316" },
  { name: "Investment", value: 12000, color: "#eab308" },
  { name: "Transport", value: 8000, color: "#22c55e" },
  { name: "Other", value: 10000, color: "#06b6d4" },
  { name: "Entertainment", value: 7000, color: "#8b5cf6" },
  { name: "Education", value: 7000, color: "#ec4899" },
  { name: "Food", value: 5500, color: "#10b981" },
]

const incomeVsExpenseData = [
  { name: "Income", value: 60000, color: "#22c55e" },
  { name: "Expenses", value: 45200, color: "#ef4444" },
]

const spendingTrendData = [
  { week: "Week 1", income: 50000, expenses: 35000 },
  { week: "Week 2", income: 52000, expenses: 38000 },
  { week: "Week 3", income: 48000, expenses: 42000 },
  { week: "Week 4", income: 55000, expenses: 40000 },
  { week: "Week 5", income: 53000, expenses: 37000 },
]

const topCategories = [
  { name: "Salary", income: 50000, expenses: 0 },
  { name: "Shopping", income: 0, expenses: 12500 },
  { name: "Investment", income: 0, expenses: 12000 },
  { name: "Other", income: 0, expenses: 10000 },
  { name: "Freelance", income: 7344, expenses: 0 },
  { name: "Education", income: 0, expenses: 7000 },
  { name: "Food", income: 0, expenses: 5500 },
]

const recentTransactions = [
  {
    id: 1,
    type: "expense",
    category: "Utilities",
    amount: -21300,
    date: "Thursday, July 24, 2025",
    time: "05:30 AM",
    icon: "⚡",
  },
  {
    id: 2,
    type: "income",
    category: "Freelance",
    amount: 25000,
    date: "Monday, July 21, 2025",
    time: "05:30 AM",
    icon: "💼",
  },
  {
    id: 3,
    type: "expense",
    category: "Shopping",
    amount: -2500,
    date: "Sunday, July 20, 2025",
    time: "05:30 AM",
    icon: "🛍️",
  },
  {
    id: 4,
    type: "expense",
    category: "Investment",
    amount: -22000,
    date: "Friday, July 18, 2025",
    time: "05:30 AM",
    icon: "📈",
  },
]

const categories = [
  "Salary",
  "Freelance",
  "Investment",
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Health",
  "Education",
  "Other",
]

export default function BudgetTracker() {
  const [currencyFrom, setCurrencyFrom] = useState("USD")
  const [currencyTo, setCurrencyTo] = useState("INR")
  const [convertAmount, setConvertAmount] = useState("10")
  const [convertedAmount, setConvertedAmount] = useState("835.00")

  const handleCurrencyConvert = async () => {
    // TODO: API call to convert currency
    // GET /api/currency/convert?from=${currencyFrom}&to=${currencyTo}&amount=${convertAmount}
    console.log("Converting currency:", { currencyFrom, currencyTo, convertAmount })
  }

  const handleSetBudget = async (budgetAmount: string) => {
    // TODO: API call to set monthly budget
    // PUT /api/budget
    // Body: { amount: budgetAmount }
    console.log("Setting budget:", budgetAmount)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary font-[family-name:var(--font-heading)]">Budget Tracker</h1>
        </div>
        <p className="text-muted-foreground">
          A personal finance app to track income, expenses, and budgets with visual analytics.
        </p>
        <div className="mt-4 flex gap-3 justify-center">
          <Link href="/transactions">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
          <Link href="/reports">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Download Reports
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Financial Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                  <span>Total Income:</span>
                </div>
                <span className="text-chart-1 font-semibold">₹63,044.02</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                  <span>Total Expenses:</span>
                </div>
                <span className="text-chart-2 font-semibold">₹45,200.00</span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span>Current Balance:</span>
                  <span className="text-primary font-bold text-lg">₹17,844.02</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Monthly Budget</span>
                  <span>₹45,200 / ₹50,000.00</span>
                </div>
                <Progress value={90} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Set Monthly Budget (₹)</label>
                <div className="flex gap-2">
                  <Input placeholder="50000" className="flex-1" />
                  <Button onClick={() => handleSetBudget("50000")}>Set</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currency Converter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Currency Converter
                <Button variant="ghost" size="sm" className="text-destructive">
                  Reset All Data
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Select value={currencyFrom} onValueChange={setCurrencyFrom}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={currencyTo} onValueChange={setCurrencyTo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <Input value={convertAmount} onChange={(e) => setConvertAmount(e.target.value)} placeholder="10" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">₹</span>
                  <Input value={convertedAmount} readOnly />
                </div>
              </div>

              <Button onClick={handleCurrencyConvert} className="w-full">
                Convert Currency
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Transactions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Transactions
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all-types">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-categories">
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{transaction.icon}</span>
                        <div>
                          <div className="font-medium">{transaction.category}</div>
                          <div className="text-xs text-muted-foreground">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold ${transaction.type === "income" ? "text-chart-1" : "text-chart-2"}`}
                        >
                          {transaction.type === "income" ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">{transaction.time}</div>
                      </div>
                    </div>
                  </div>
                ))}

                <Link href="/statistics">
                  <Button variant="ghost" className="w-full text-primary">
                    Show Monthly Statistics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Charts and Statistics */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className="font-semibold">₹{(category.income || category.expenses).toLocaleString()}.00</span>
                  </div>
                  <div className="space-y-1">
                    {category.income > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-chart-1">Income: ₹{category.income.toLocaleString()}.00</span>
                      </div>
                    )}
                    {category.expenses > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-chart-2">Expenses: ₹{category.expenses.toLocaleString()}.00</span>
                      </div>
                    )}
                  </div>
                  <Progress value={category.income > 0 ? 100 : (category.expenses / 25000) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spending Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Spending Trend
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                  <span>Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                  <span>Expenses</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: { label: "Income", color: "hsl(var(--chart-1))" },
                expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingTrendData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">Created by Vishesh Jain</div>
    </div>
  )
}
