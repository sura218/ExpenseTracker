import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import {
  ArrowUpDown,
  Calendar,
  CreditCard,
  Filter,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "./ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { deleteTransaction, getTransactions } from "../utils/transaction";
import { Category, getCategory } from "../utils/category";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
}

type Filters = {
  search: string;
  category: string;
  type: string;
  dateFrom: string;
  dateTo: string;
};

const ExpenseHistory = () => {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const queryClient = useQueryClient()

  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });

  const { data: categories } = useQuery<Category[]>({
      queryKey: ["category"],
      queryFn: getCategory,
    });

  const deleteMutation = useMutation({
    mutationFn:deleteTransaction,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["transaction"]})
    }
  })

  // Sorting logic
  const handleSort = (field: keyof Expense) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Clear filters and reset sorting
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      type: "all",
      dateFrom: "",
      dateTo: "",
    });
    setSortField("date");
    setSortOrder("desc");
  };

  const handleDelete = (id: string)=>{
    console.log(id)
    deleteMutation.mutate(id)
  }

  // Filter + sort in frontend
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense: Expense) => {
      if (
        filters.search &&
        !expense.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.category !== "all" && expense.category !== filters.category) {
        return false;
      }
      if (filters.type !== "all" && expense.type !== filters.type) {
        return false;
      }
      if (filters.dateFrom && expense.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && expense.date > filters.dateTo) {
        return false;
      }
      return true;
    });
  }, [expenses, filters]);

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      let compare = 0;
      if (sortField === "amount") {
        compare = a.amount - b.amount;
      } else if (sortField === "date") {
        compare = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        compare = a[sortField].toString().localeCompare(b[sortField].toString());
      }
      return sortOrder === "asc" ? compare : -compare;
    });
  }, [filteredExpenses, sortField, sortOrder]);

  const totalFiltered = sortedExpenses.reduce((sum, expense) => {
    return expense.type === "income"
      ? sum + expense.amount
      : sum - expense.amount;
  }, 0);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters & Search
          </CardTitle>
          <CardDescription>
            Filter and search through your transaction history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${category.color.class}`}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing {sortedExpenses.length} transactions
              </p>
              <p className="text-lg font-semibold">
                Net Total:{" "}
                <span
                  className={
                    totalFiltered >= 0 ? "text-chart-2" : "text-chart-3"
                  }
                >
                  ${Math.abs(totalFiltered).toFixed(2)}{" "}
                  {totalFiltered >= 0 ? "surplus" : "deficit"}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Complete list of your income and expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sort Headers */}
          <div className="grid grid-cols-12 gap-4 pb-3 border-b text-sm font-medium text-muted-foreground">
            <div className="col-span-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("description")}
                className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
              >
                Description <ArrowUpDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="col-span-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("category")}
                className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
              >
                Category <ArrowUpDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="col-span-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("date")}
                className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
              >
                Date <ArrowUpDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="col-span-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("amount")}
                className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
              >
                Amount <ArrowUpDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Transaction Rows */}
          <div className="space-y-3 mt-4">
            {sortedExpenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found</p>
              </div>
            ) : (
              sortedExpenses.map((expense: Expense) => (
                <div
                  key={expense.id}
                  className="grid grid-cols-12 gap-4 py-3 border-b border-border/50 hover:bg-muted/50 rounded-lg px-2"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {expense.description}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    {(() => {
                      const cat = categories?.find(
                        (c) => c.name === expense.category
                      );
                      const colorClass = cat?.color?.class || "bg-gray-400";
                      return (
                        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                      );
                    })()}
                    <span className="text-sm">{expense.category}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm">{expense.date}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`font-medium text-sm ${
                        expense.type === "income"
                          ? "text-chart-2"
                          : "text-chart-3"
                      }`}
                    >
                      {expense.type === "income" ? "+" : "-"}$
                      {expense.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Badge
                      variant={
                        expense.type === "income" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {expense.type}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseHistory;
