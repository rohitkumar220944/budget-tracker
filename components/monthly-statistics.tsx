"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from "recharts"
import { Progress } from "@/components/ui/progress"

// Sample data for monthly statistics - Replace with API calls
const expenseBreakdownData = [
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
]

export default function MonthlyStatistics() {
  // TODO: API Integration Points
  // GET /api/statistics/monthly - Fetch monthly statistics data
  // GET /api/statistics/expense-breakdown - Fetch expense breakdown for pie chart
  // GET /api/statistics/income-vs-expenses - Fetch income vs expenses comparison
  // GET /api/statistics/spending-trend - Fetch spending trend over time

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Monthly Statistics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <ChartContainer
                  config={{
                    value: { label: "Amount" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {expenseBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="space-y-2">
                {expenseBreakdownData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income vs Expenses Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Amount" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeVsExpenseData} barCategoryGap="20%">
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill={(entry) => entry.color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

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

        {/* Spending Trend */}
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
    </div>
  )
}
