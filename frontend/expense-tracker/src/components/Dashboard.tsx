import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  BarChart3,
  History,
} from "lucide-react";
import { Badge } from "./ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";

import AddTransactions from "../pages/AddTransactions";
import ExpenseHistory from "./ExpenseHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import CategoryManager from "./CategoryManager";
import { useQuery } from "@tanstack/react-query";
import { getTransactions, TransactionForm } from "../utils/transaction";
import { Category, CategoryWithSpent, getCategory } from "../utils/category";




export default function Dashboard() {

  const { data, isLoading, error } = useQuery<TransactionForm[]>({
    queryKey: ["transaction"],
    queryFn: getTransactions,
  });


  const {
    data: category ,
    isLoading: categoryLoded,
    error: cateerror,
  } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  if (isLoading && categoryLoded) return <p>Loading...</p>;

  if (error && cateerror)
    return (
      <p>
        Error {error.message} {error.message} {cateerror.message}
      </p>
    );

  const income = data
  ?.filter((t: TransactionForm) => t.type.toLowerCase() === "income")
  .reduce((sum: number, t: TransactionForm) => sum + Number(t.amount), 0)??0;

const expense = data
  ?.filter((t: TransactionForm) => t.type === "expense")
  .reduce((sum: number, t: TransactionForm) => sum + Number(t.amount), 0)??0;
  const balance = income - expense;


  const categorySpending: CategoryWithSpent[] | undefined = category?.map((category: Category) => ({
    ...category,
    spent: data
      ?.filter(
        (expense) =>
          expense.category === category.name && expense.type === "expense"
      )
      .reduce((sum, expense) => sum + Number(expense.amount), 0) ?? 0,
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Expense Tracker
          </h1>
          <p className="text-muted-foreground text-pretty">
            Track your spending and manage your finances
          </p>
        </div>
        <div className="flex gap-2">
          {
            <CategoryManager
              
            />
          }
          <AddTransactions/>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Transaction History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${balance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {balance >= 0 ? "+" : ""}${(balance - 3000).toFixed(2)} from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-2">
                  ${income?.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
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
                  ${expense?.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  -8% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Categories and Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>
                  Your expenses organized by category this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySpending
                  ?.filter((category ) => category.spent > 0)
                  .map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${category.color.class}`}
                        />
                        <span className="font-medium text-foreground">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ${category.spent.toFixed(2)}
                      </span>
                    </div>
                  ))}
                {categorySpending?.filter((category) => category.spent > 0)
                  .length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No expenses recorded yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data?.slice(0, 5).map((expense: TransactionForm) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {expense.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {expense.date} • {expense.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium text-sm ${
                          expense.type === "income"
                            ? "text-chart-2"
                            : "text-chart-3"
                        }`}
                      >
                        {expense.type === "income" ? "+" : "-"}$
                        {Number(expense.amount).toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          expense.type === "income" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {expense.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <ExpenseHistory
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
