import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Progress } from "../components/ui/Progress";
import { Badge } from "../components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import {
  PiggyBank,
  Target,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Edit,
  Plus,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTransactions } from "../utils/transaction";
import {
  createBudgets,
  deleteBudget,
  getBudgets,
  updateBudget,
} from "../utils/budget";
import { Budgets } from "./../utils/budget";
import { Category, getCategory } from "../utils/category";

// ✅ Your Category type is already defined elsewhere

function Budget() {
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [newBudgetForm, setNewBudgetForm] = useState<Budgets>({
    category: "",
    amount: 0,
    period: "monthly" as "monthly" | "yearly",
  });
  const [editBudget, setEditBudget] = useState<{ id: string; amount: number }>({
    id: "",
    amount: 0,
  });

  const queryClient = useQueryClient();

  const { data: transaction, isLoading: loadingTransaction } = useQuery({
    queryKey: ["transaction"],
    queryFn: getTransactions,
  });

  const { data: budget = [], isLoading: loadingBudgets } = useQuery<Budgets[]>({
    queryKey: ["budget"],
    queryFn: getBudgets,
  });

  const createBudget = useMutation({
    mutationFn: createBudgets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      setNewBudgetForm({
        category: "",
        amount: "",
        period: "monthly",
      });
      setIsAddingBudget(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });
  // ✅ Helpers
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getCurrentSpending = (categoryName: string) => {
    if (!transaction || !Array.isArray(transaction)) return 0;
    return transaction
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const isCurrentPeriod =
          selectedPeriod === "monthly"
            ? transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear
            : transactionDate.getFullYear() === currentYear;

        return (
          transaction.type.toLowerCase() === "expense" &&
          transaction.category.toLowerCase() === categoryName.toLowerCase() &&
          isCurrentPeriod
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100)
      return {
        status: "over",
        color: "text-destructive",
        bgColor: "bg-destructive",
      };
    if (percentage >= 80)
      return {
        status: "warning",
        color: "text-orange-600",
        bgColor: "bg-orange-500",
      };
    return { status: "good", color: "text-chart-2", bgColor: "bg-chart-2" };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBudget.mutate(newBudgetForm);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id: editBudget.id,
      amount: editBudget.amount,
    });
  };

  const handleDeleteBudget = (budgetId: string) => {
    deleteMutation.mutate(budgetId);
  };

  // ✅ Calculations
  const filteredBudgets = budget.filter(
    (budget) => budget.period === selectedPeriod
  );
  console.log(budget);

  const totalBudget = filteredBudgets.reduce(
    (sum, budget) => sum + Number(budget.amount),
    0
  );
  const totalSpent = filteredBudgets.reduce(
    (sum, budget) => sum + getCurrentSpending(budget.category),
    0
  );

  const remainingBudget = totalBudget - totalSpent;

  const availableCategories = categories?.filter(
    (category) =>
      category.name !== "Income" &&
      !budget.some(
        (budget) =>
          budget.id === category.id && budget.period === selectedPeriod
      )
  );

  if (loadingBudgets || loadingTransaction) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Budget Management
          </h1>
          <p className="text-muted-foreground text-pretty">
            Set and track your spending limits by category
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedPeriod}
            onValueChange={(value: "monthly" | "yearly") =>
              setSelectedPeriod(value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddingBudget} onOpenChange={setIsAddingBudget}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Budget</DialogTitle>
                <DialogDescription>
                  Set a spending limit for a category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newBudgetForm.category}
                      name="select"
                      onValueChange={(value) =>
                        setNewBudgetForm((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories?.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: category.color.value,
                                }}
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Budget Amount ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={Number(newBudgetForm.amount)}
                      onChange={(e) =>
                        setNewBudgetForm((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Select
                      value={newBudgetForm.period}
                      onValueChange={(value: "monthly" | "yearly") =>
                        setNewBudgetForm((prev) => ({ ...prev, period: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingBudget(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type={"submit"} className="flex-1">
                      Add Budget
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${totalBudget.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === "monthly" ? "This month" : "This year"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">
              ${totalSpent.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <PiggyBank className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                remainingBudget >= 0 ? "text-chart-2" : "text-destructive"
              }`}
            >
              ${remainingBudget.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {remainingBudget >= 0 ? "Under budget" : "Over budget"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Budget Categories
        </h2>

        {filteredBudgets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No budgets set
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by adding a budget for your expense categories
              </p>
              <Button onClick={() => setIsAddingBudget(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Budget
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredBudgets.map((budget) => {
              const cat = categories?.find(
                (c) => c.name.toLowerCase() === budget.category.toLowerCase()
              );

              const colorClass = cat?.color?.class || "bg-gray-400";
              const spent = getCurrentSpending(budget.category);
              const percentage = Math.min((spent / Number(budget.amount)) * 100, 100);
              const status = getBudgetStatus(spent, Number(budget.amount));
              console.log("budget", budget);

              return (
                <Card key={budget.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                        <div>
                          <h3 className="font-medium text-foreground">
                            {budget.category}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ${spent.toFixed(2)} of $
                            {Number(budget.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            status.status === "good" ? "default" : "destructive"
                          }
                        >
                          {status.status === "over" && (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {status.status === "good" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {status.status === "warning" && (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {percentage.toFixed(0)}%
                        </Badge>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Budget</DialogTitle>
                              <DialogDescription>
                                Update the budget amount for {budget.category}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <form onSubmit={handleEdit}>
                                <div className="space-y-2">
                                  <Label>Budget Amount ($)</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    defaultValue={budget.amount}
                                    onChange={(e) =>
                                      setEditBudget({
                                        id: budget.id!,
                                        amount:
                                          Number.parseFloat(e.target.value) ||
                                          0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex gap-3 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleDeleteBudget(budget.id!)
                                    }
                                    className="flex-1 text-destructive hover:text-destructive"
                                  >
                                    Delete
                                  </Button>
                                  <Button type={"submit"} className="flex-1">
                                    {updateMutation.isPending
                                      ? "Saving..."
                                      : "Save Changes"}
                                  </Button>
                                </div>
                              </form>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Spent: ${spent.toFixed(2)}</span>
                        <span>
                          Remaining: $
                          {Math.max(0, Number(budget.amount) - spent).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default Budget;
