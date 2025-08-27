"use client"


import { useAuth } from "@/app/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from "recharts"
import { ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"

// Sample data - In real app, this would come from backend APIs
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
  { name: "Income", value: 70000, fill: "#22c55e" },
  { name: "Expenses", value: 45200, fill: "#ef4444" },
]

const spendingTrendData = [
  { week: "Week 1", income: 50000, expenses: 35000 },
  { week: "Week 2", income: 52000, expenses: 38000 },
  { week: "Week 3", income: 48000, expenses: 42000 },
  { week: "Week 4", income: 55000, expenses: 40000 },
  { week: "Week 5", income: 53000, expenses: 37000 },
]

const topCategories = [
  { name: "Salary", income: 50000, expenses: 0, color: "#22c55e" },
  { name: "Shopping", income: 0, expenses: 12500, color: "#ef4444" },
  { name: "Investment", income: 0, expenses: 12000, color: "#eab308" },
  { name: "Other", income: 0, expenses: 10000, color: "#06b6d4" },
  { name: "Freelance", income: 7344, expenses: 0, color: "#22c55e" },
  { name: "Education", income: 0, expenses: 7000, color: "#ec4899" },
  { name: "Food", income: 0, expenses: 5500, color: "#10b981" },
]
export default function MonthlyStatistics() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);
  if (!user) return null;



  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Monthly Statistics</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <ChartContainer
                  config={{
                    utilities: { label: "Utilities", color: "#ef4444" },
                    shopping: { label: "Shopping", color: "#f97316" },
                    investment: { label: "Investment", color: "#eab308" },
                    transport: { label: "Transport", color: "#22c55e" },
                    other: { label: "Other", color: "#06b6d4" },
                    entertainment: { label: "Entertainment", color: "#8b5cf6" },
                    education: { label: "Education", color: "#ec4899" },
                    food: { label: "Food", color: "#10b981" },
                  }}
                  className="h-[250px] w-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={1}
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

              {/* Legend positioned to the right of chart */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                {expenseBreakdownData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income vs Expenses Bar Chart */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: { label: "Income", color: "#22c55e" },
                expenses: { label: "Expenses", color: "#ef4444" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeVsExpenseData} barCategoryGap="30%">
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-muted-foreground" />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-muted-foreground"
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => [`₹${value.toLocaleString()}`, ""]} />}
                  />
                  <Bar dataKey="value" fill="currentColor" radius={[6, 6, 0, 0]} maxBarSize={80} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <span className="font-bold text-lg">
                      ₹{(category.income || category.expenses).toLocaleString()}.00
                    </span>
                  </div>
                  <div className="space-y-1">
                    {category.income > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Income: ₹{category.income.toLocaleString()}.00
                      </div>
                    )}
                    {category.expenses > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Expenses: ₹{category.expenses.toLocaleString()}.00
                      </div>
                    )}
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: category.color,
                        width: `${category.income > 0 ? 100 : Math.min((category.expenses / 15000) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spending Trend */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg font-semibold">
              Spending Trend
              <div className="flex items-center gap-4 text-sm font-normal">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                  <span className="text-muted-foreground">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                  <span className="text-muted-foreground">Expenses</span>
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
                  <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-muted-foreground" />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-muted-foreground"
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => [`₹${value.toLocaleString()}`, ""]} />}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
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
