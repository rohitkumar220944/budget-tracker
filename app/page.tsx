"use client" 

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/AuthProvider"  // 🔑 our auth context
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, LineChart, Line, ResponsiveContainer } from "recharts"
import { DollarSign, Calendar, BarChart3, Plus, FileText, Bolt, Briefcase, ShoppingBag, TrendingUp, Wallet, Utensils, HeartPulse, Package } from "lucide-react"
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


// Compute spending trend from recentTransactions
function getSpendingTrendData(transactions: Transaction[]) {
  // Group transactions by week (show as 'Week N')
  const weekMap: Record<string, { week: string; weekDate: Date; income: number; expenses: number }> = {};
  for (const tx of transactions) {
    const dateRaw = tx.entrydate || tx.created || tx.transdate || tx.date;
    const d = dateRaw ? new Date(dateRaw) : null;
    if (!d || isNaN(d.getTime())) continue;
    // Get ISO week number
    const temp = new Date(d.getTime());
    temp.setHours(0,0,0,0);
    // Thursday in current week decides the year.
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
    const week1 = new Date(temp.getFullYear(),0,4);
    const weekNum = 1 + Math.round(((temp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    const year = temp.getFullYear();
    const weekKey = `${year}-W${weekNum}`;
    const weekLabel = `Week ${weekNum}`;
    if (!weekMap[weekKey]) {
      weekMap[weekKey] = { week: weekLabel, weekDate: new Date(temp), income: 0, expenses: 0 };
    }
    const type = (tx.transtype || tx.type || "expense").toLowerCase();
    const amt = Number(tx.amt ?? tx.amount ?? 0);
    if (type === "income") {
      weekMap[weekKey].income += Math.abs(amt);
    } else {
      weekMap[weekKey].expenses += Math.abs(amt);
    }
  }
  // Sort by weekDate (date ascending)
  return Object.values(weekMap).sort((a, b) => a.weekDate.getTime() - b.weekDate.getTime());
}


// Compute top categories from recentTransactions
type Transaction = {
  transtype?: string;
  type?: string;
  catname?: string;
  category?: string;
  amt?: number;
  amount?: number;
  title?: string;
  entrydate?: string;
  created?: string;
  transdate?: string;
  date?: string;
};
type TopCategory = { name: string; income: number; expenses: number };
function getTopCategories(transactions: Transaction[]): TopCategory[] {
  const categoryMap: Record<string, TopCategory> = {};
  for (const tx of transactions) {
    const type = (tx.transtype || tx.type || "expense").toLowerCase();
    // Use tx.title as the display name if available, else fallback to catname/category/Other
    let displayName = tx.title || tx.catname || tx.category || "Other";
    displayName = String(displayName).trim();
    if (!categoryMap[displayName]) {
      categoryMap[displayName] = { name: displayName, income: 0, expenses: 0 };
    }
    const amt = Number(tx.amt ?? tx.amount ?? 0);
    if (type === "income") {
      categoryMap[displayName].income += Math.abs(amt);
    } else {
      categoryMap[displayName].expenses += Math.abs(amt);
    }
  }
  // Convert to array, sort by max(income, expenses) desc, take top 7
  return Object.values(categoryMap)
    .sort((a, b) => Math.max(b.income, b.expenses) - Math.max(a.income, a.expenses))
    .slice(0, 7);
}

const recentTransactions = [
  { id: 1, type: "expense", category: "Utilities", amount: -21300, date: "Thursday, July 24, 2025", time: "05:30 AM", icon: "⚡" },
  { id: 2, type: "income", category: "Freelance", amount: 25000, date: "Monday, July 21, 2025", time: "05:30 AM", icon: "💼" },
  { id: 3, type: "expense", category: "Shopping", amount: -2500, date: "Sunday, July 20, 2025", time: "05:30 AM", icon: "🛍️" },
  { id: 4, type: "expense", category: "Investment", amount: -22000, date: "Friday, July 18, 2025", time: "05:30 AM", icon: "📈" },
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
  // Filter state
  const [filterType, setFilterType] = useState<string>("all-types");
  const [filterCategory, setFilterCategory] = useState<string>("all-categories");
  const { user } = useAuth();
  const router = useRouter();

  // 🔒 Redirect to /login if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null; // Prevent dashboard flash before redirect

  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("INR");
  const [convertAmount, setConvertAmount] = useState("10");
  const [convertedAmount, setConvertedAmount] = useState("835.00");
  const [budgetInput, setBudgetInput] = useState("");
  const [currentLimit, setCurrentLimit] = useState<number | null>(null);
  const [limitId, setLimitId] = useState<number | null>(null);
  const [limitLoading, setLimitLoading] = useState(true);
  // Add state for income and expenses (replace with backend fetch in real app)
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  // State for recent transactions
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // Fetch recent transactions from backend
  const fetchRecentTransactions = async () => {
    setTransactionsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/auth/cust/translist", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        // data.data is the array of transactions
        if (data.status && Array.isArray(data.data)) {
  console.log("[fetchRecentTransactions] Transaction objects:", data.data);

  const formatted = data.data.map((tx: any) => {
    const dateRaw = tx.entrydate || tx.created;

    let formattedDate = "Invalid Date";
    let formattedTime = "";

    if (dateRaw) {
      const d = new Date(dateRaw);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        formattedTime = d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }

    // Always provide a readable time string
    let time = tx.time || formattedTime;
    if (!time || time === "Invalid Date") {
      // fallback: show --:-- if not available
      time = "--:--";
    }

    return {
      id: tx.transid,
      title: tx.title,
      type: tx.type?.toLowerCase() || "expense",
      category: tx.description || "-",
      amount: tx.amount ?? 0,
      date: formattedDate,
      time,
    };
  });

  // sort by real date

  const sorted = formatted.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  setRecentTransactions(sorted); // Show all transactions, not just 5

  // Calculate total income and expenses
  let income = 0;
  let expenses = 0;
  for (const tx of data.data) {
    const amt = Number(tx.amount) || 0;
    if ((tx.type?.toLowerCase?.() || "expense") === "income") {
      if (amt > 0) income += amt;
    } else {
      expenses += Math.abs(amt);
    }
  }
  setTotalIncome(income);
  setTotalExpenses(expenses);
}

        else {
          setRecentTransactions([]);
        }
      } else {
        setRecentTransactions([]);
      }
    } catch (err) {
      setRecentTransactions([]);
    }
    setTransactionsLoading(false);
  };

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  // Fetch current limit on mount and after reset
  const fetchLimit = async () => {
    setLimitLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/auth/cust/getlimit", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("[fetchLimit] Response from /getlimit:", data); // <-- Debug log
        if (data.status && data.data) {
          // Robust: support limit, limits, amount, or limiter property
          let limitValue = data.data.limit ?? data.data.limits ?? data.data.amount ?? data.data.limiter ?? null;
          if (typeof limitValue === "string") limitValue = parseFloat(limitValue);
          if (typeof limitValue !== "number" || isNaN(limitValue)) limitValue = 0;
          setCurrentLimit(limitValue);
          setLimitId(data.data.id || data.data.limiterid || null);
        } else {
          setCurrentLimit(null);
          setLimitId(null);
        }
      }
    } catch (err) {
      setCurrentLimit(null);
      setLimitId(null);
    }
    setLimitLoading(false);
  };
  useEffect(() => {
    fetchLimit();
  }, []);

  const handleCurrencyConvert = async () => {
    console.log("Converting currency:", { currencyFrom, currencyTo, convertAmount });
  };

  const handleSetBudget = async () => {
    if (!budgetInput) {
      alert("Please enter a budget amount.");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      let res;
      if (limitId) {
        // Update existing limit
        res = await fetch(`http://localhost:8080/auth/cust/updlimit/${limitId}/${parseFloat(budgetInput)}`, {
          method: "PUT",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      } else {
        // Save new limit
        res = await fetch("http://localhost:8080/auth/cust/savelimit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ title: "Monthly Budget", limits: parseFloat(budgetInput) }),
        });
      }
      if (res.ok) {
        alert("✅ Monthly budget set successfully");
        setBudgetInput("");
        fetchLimit();
      } else {
        const errorText = await res.text();
        alert("❌ Failed to set budget");
        console.error("Set budget error:", errorText);
      }
    } catch (err) {
      alert("❌ Failed to set budget");
      console.error("Set budget error:", err);
    }
  };

  const handleResetLimit = async () => {
    if (!limitId) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/auth/cust/dellimit/${limitId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        alert("✅ Limit reset/deleted");
        setCurrentLimit(null);
        setLimitId(null);
        fetchLimit();
      } else {
        alert("❌ Failed to reset limit");
      }
    } catch (err) {
      alert("❌ Failed to reset limit");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary font-[family-name:var(--font-heading)]">
            Money Trex
          </h1>
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
                <span className="text-chart-1 font-semibold">₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                  <span>Total Expenses:</span>
                </div>
                <span className="text-chart-2 font-semibold">₹{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span>Current Balance:</span>
                  <span className="text-primary font-bold text-lg">₹{(totalIncome - totalExpenses).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Monthly Budget</span>
                  <span>
                    {limitLoading ? <span>Loading...</span> : <>₹{typeof currentLimit === "number" && !isNaN(currentLimit) ? currentLimit.toLocaleString() : "0"}.00</>}
                  </span>
                </div>
                {/* Optionally, update Progress value to reflect budget usage */}
                <Progress 
                  value={
                    typeof currentLimit === "number" && currentLimit > 0 && typeof totalExpenses === "number" && totalExpenses > 0
                      ? Math.min((totalExpenses / currentLimit) * 100, 100)
                      : 0
                  }
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Set Monthly Budget (₹)</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="50000"
                    className="flex-1"
                    value={budgetInput}
                    onChange={e => setBudgetInput(e.target.value.replace(/[^0-9.]/g, ""))}
                  />
                  <Button onClick={handleSetBudget}>Set</Button>
                  {limitId && (
                    <Button variant="destructive" onClick={handleResetLimit}>Reset Limit</Button>
                  )}
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
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {/* Use normalized keys for SelectItem values */}
            {["Utilities","Freelance","Shopping","Investment","Salary","Food","Health","Other"].map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CardTitle>
  </CardHeader>
  <CardContent>

    {transactionsLoading ? (
      <div>Loading...</div>
    ) : recentTransactions.length === 0 ? (
      <div className="text-muted-foreground">No recent transactions found.</div>
    ) : (
      Object.entries(
        recentTransactions
          .filter((tx: any) => {
            const type = (tx.transtype || tx.type || "expense").toLowerCase();
            let category = tx.catname || tx.category || "Other";
            category = category.trim();
            const categoryKeyMap: Record<string, string> = {
              utilities: "Utilities",
              freelance: "Freelance",
              shopping: "Shopping",
              investment: "Investment",
              salary: "Salary",
              food: "Food",
              health: "Health",
              other: "Other",
            };
            const normalizedCategory = categoryKeyMap[category.toLowerCase()] || "Other";
            const typeMatch = filterType === "all-types" || type === filterType;
            // Compare to filterCategory directly (not lowercased)
            const catMatch = filterCategory === "all-categories" || normalizedCategory === filterCategory;
            return typeMatch && catMatch;
          })
          .reduce((acc: any, tx: any) => {
            const date = tx.transdate || tx.date;
            const formattedDate = new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            if (!acc[formattedDate]) acc[formattedDate] = [];
            acc[formattedDate].push(tx);
            return acc;
          }, {})
      ).map(([date, txs]: any) => (
        <div key={date} className="mb-5">
          {/* Date header */}
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">{date}</h3>
          <div className="space-y-4">
            {txs.map((transaction: any) => {
              const type = transaction.transtype || transaction.type || "expense";
              const category = transaction.catname || transaction.category || "Other";
              const amount = transaction.amt ?? transaction.amount ?? 0;
              const time =
                transaction.time ||
                new Date(transaction.transdate || transaction.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

              // Icon map using emoji
              const icons: Record<string, string> = {
                Utilities: "⚡",
                Freelance: "💼",
                Shopping: "🛍️",
                Investment: "📈",
                Salary: "💰",
                Food: "🍔",
                Health: "❤️",
                Other: "📦",
              };

              return (
                <div
                  key={transaction.transid || transaction.id}
                  className="flex items-center justify-between border-b border-border pb-2"
                >
                  {/* Left */}

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{icons[category] || icons["Other"]}</span>
                      {transaction.title && (
                        <span className="font-semibold">{transaction.title}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground ml-7">{category}</div>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <div
                      className={`font-semibold flex items-center gap-2 ${
                        type === "income" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      <span>{type === "income" ? "+" : "-"}{Math.abs(amount).toLocaleString()}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        {type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                    {/* Time removed as requested */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))
    )}

    <Link href="/statistics">
      <Button variant="ghost" className="w-full text-primary mt-4">
        Show Monthly Statistics
      </Button>
    </Link>
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
              {getTopCategories(recentTransactions as Transaction[]).map((category: TopCategory, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    {/* Show only the category name and summary, never transaction notes/titles */}
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
                <LineChart data={getSpendingTrendData(recentTransactions as Transaction[])}>
                  <XAxis dataKey="week" tick={{ fill: '#6366f1', fontWeight: 600 }} axisLine={{ stroke: '#6366f1' }} />
                  <YAxis tick={{ fill: '#10b981', fontWeight: 600 }} axisLine={{ stroke: '#10b981' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">Created by Rohit Kumar</div>
    </div>
  )
}
