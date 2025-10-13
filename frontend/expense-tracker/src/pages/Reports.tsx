import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../components/ui/Select";

import { useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import {
  Calendar,
  DollarSign,
  Download,
  PieChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import {
  Area,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  AreaChart,
  BarChart,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../utils/transaction";
import { getCategory } from "../utils/category";



const Reports = () => {
  const {
    data: transaction = [],
    isLoading: transactionLoading,
    error: transactionError,
  } = useQuery({
    queryKey: ["transaction"],
    queryFn: getTransactions,
  });

  // ✅ Fetch categories
  const {
    data: categories = [],
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedChart, setSelectedChart] = useState("overview");

  // ✅ Filter transactions by selected period
  const filteredTransactions = useMemo(() => {
    if (!transaction.length) return [];

    const now = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case "1month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        startDate = new Date(0);
        break;
    }

    return transaction.filter(
      (t: any) => new Date(t.date) >= startDate
    );
  }, [transaction, selectedPeriod]);

  // ✅ Summary stats
  const summaryStats = useMemo(() => {
    const income = filteredTransactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const expenses = filteredTransactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const balance = income - expenses;

    const avgMonthlyIncome =
      income / Math.max(1, getMonthsInPeriod(selectedPeriod));
    const avgMonthlyExpenses =
      expenses / Math.max(1, getMonthsInPeriod(selectedPeriod));

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: balance,
      avgMonthlyIncome,
      avgMonthlyExpenses,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions, selectedPeriod]);

  // ✅ Monthly trend
  const monthlyTrendData = useMemo(() => {
    const monthlyData: Record<
      string,
      { income: number; expenses: number; month: string }
    > = {};

    filteredTransactions.forEach((t: any) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expenses: 0, month: label };
      }

      if (t.type === "income") {
        monthlyData[key].income += Number(t.amount);
      } else {
        monthlyData[key].expenses += Number(t.amount);
      }
    });

    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [filteredTransactions]);

  console.log("monthlyTrendData: ", monthlyTrendData.length)

  // ✅ Category breakdown
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};

    filteredTransactions
      .filter((t: any) => t.type === "expense")
      .forEach((t: any) => {
        totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
      });


    return Object.entries(totals)
      .map(([name, value]) => {
        const categoryInfo = categories.find((c: any) => c.name === name);
        return {
          name,
          value,
          color: categoryInfo?.color || "#6b7280",
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categories]);

  const topCategories = categoryData.slice(0, 5)
  // ✅ Helper
  function getMonthsInPeriod(period: string): number {
    switch (period) {
      case "1month":
        return 1;
      case "3months":
        return 3;
      case "6months":
        return 6;
      case "1year":
        return 12;
      case "all":
        return Math.max(1, Math.ceil(transaction.length / 30));
      default:
        return 6;
    }
  }

  // ✅ Chart rendering
  const renderChart = () => {
    switch (selectedChart) {
      case "overview":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "monthly":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  // ✅ Loading or error
  if (transactionLoading || categoryLoading)
    return <div>Loading reports...</div>;
  if (transactionError || categoryError)
    return <div>Error loading reports.</div>;

  return (
    <div className="mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance text-foreground">
            Financial Reports
          </h1>
          <p className=" text-foreground text-pretty">
            Analyze your spending and financial trends
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedPeriod}
            onValueChange={(value: "6 Months" | "1 Year") =>
              setSelectedPeriod(value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full flex items-center gap-2" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">
              ${summaryStats.totalIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: ${summaryStats.avgMonthlyIncome.toFixed(2)}/month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">
              ${summaryStats.totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: ${summaryStats.avgMonthlyExpenses.toFixed(2)}/month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summaryStats.netBalance >= 0 ? "text-chart-2" : "text-chart-3"
              }`}
            >
              ${summaryStats.netBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.netBalance >= 0 ? "Positive" : "Negative"} cash flow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {summaryStats.transactionCount}
            </div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-foreground">
                  Financial Trends
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Income and expense patterns over time
                </CardDescription>
              </div>
              <Select value={selectedChart} onValueChange={setSelectedChart}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Top Spending Categories
            </CardTitle>
            <CardDescription>
              Highest expense categories in selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCategories.map((category, index) => {
              const percentage = (category.value / summaryStats.totalExpenses) * 100
              return (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of expenses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">${category.value.toFixed(2)}</p>
                  </div>
                </div>
              )
            })}

            {topCategories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No expense data available for the selected period.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>
            Detailed monthly income and expense summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 gap-4 p-4 font-medium text-sm border-b bg-muted/50">
              <div>Month</div>
              <div className="text-right">Income</div>
              <div className="text-right">Expenses</div>
              <div className="text-right">Net</div>
            </div>
            {monthlyTrendData.map((month, index) => {
              const net = month.income - month.expenses;
              return (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 p-4 text-sm border-b last:border-b-0"
                >
                  <div className="font-medium">{month.month}</div>
                  <div className="text-right text-chart-2">
                    ${month.income.toFixed(2)}
                  </div>
                  <div className="text-right text-chart-3">
                    ${month.expenses.toFixed(2)}
                  </div>
                  <div
                    className={`text-right font-medium ${
                      net >= 0 ? "text-chart-2" : "text-chart-3"
                    }`}
                  >
                    ${net.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {monthlyTrendData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No data available for the selected period.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
