import {
  ArrowUpDown,
  Calendar,
  CreditCard,
  DollarSign,
  Filter,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import AddTransactions from "./AddTransactions";
import CategoryManager from "../components/CategoryManager";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction, getTransactions, TransactionForm } from "../utils/transaction";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Category, getCategory } from "../utils/category";



interface Transaction {
  id: number;
  description: string;
  amount: number | string;
  category: string;
  date: string;
  type: "income" | "expense" | "Income";
}

const Transactions = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
  });

  // Sort state
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<TransactionForm[]>({
    queryKey: ["transaction"],
    queryFn: getTransactions,
  });

  const deleteMutation = useMutation({
    mutationFn:deleteTransaction,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["transaction"]})
    }
  })

  const { data: categorys } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  const clearFilters = () => {
    setFilters({ search: "", category: "all", type: "all" });
  };

  const transactions = Array.isArray(data) ? data : [];

  const filteredData = useMemo(() => {
    return transactions.filter((tx) => {
      if (
        filters.search &&
        !tx.description.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.category !== "all" && tx.category !== filters.category)
        return false;
      if (
        filters.type !== "all" &&
        tx.type.toLowerCase() !== filters.type.toLowerCase()
      )
        return false;
      return true;
    });
  }, [transactions, filters]);

  const sortedData = useMemo(() => {
  return [...filteredData].sort((a, b) => {
    let compare = 0;

    if (sortField === "amount") {
      compare = Number(a.amount) - Number(b.amount);
    } else if (sortField === "date") {
      compare = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      const aValue = a[sortField]?.toString() ?? "";
      const bValue = b[sortField]?.toString() ?? "";
      compare = aValue.localeCompare(bValue);
    }

    return sortOrder === "asc" ? compare : -compare;
  });
}, [filteredData, sortField, sortOrder]);


  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id: string)=>{
    deleteMutation.mutate(id)
  }

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error {error.message}</p>;

  const totalTransactions = data?.length;
  const income = data?.filter((transaction) => transaction.type.toLowerCase() === "Income".toLowerCase());
  const totalIncome = income?.reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );
  console.log(totalIncome);
  const expenses = data?.filter((expense) => expense.type === "expense");
  const totalExpense = expenses?.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="mx-auto p-6 space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className=" text-3xl font-medium text-foreground">
            Transactions
          </h1>
          <p className="text-foreground text-sm">
            Manage all your income and expense transactions
          </p>
        </div>
        <div>
          <div className="flex  gap-2">
            <CategoryManager
            />
            <AddTransactions />
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-between items-center">
        <div className="Total rounded-md flex-1 p-3 border-solid border-[1px] shadow-md">
          <div className=" m-2 ">
            <div className="flex justify-between items-center">
              <p>Total Transactions</p>
              <DollarSign className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <h1 className=" font-bold text-2xl text-foreground">
                {totalTransactions}
              </h1>
              <p className="font-semibold text-foreground">
                {totalTransactions} shown after filters
              </p>
            </div>
          </div>
        </div>
        <div className="Income rounded-md flex-1 p-3 border-solid border-[1px] shadow-md">
          <div className=" m-2 ">
            <div className="flex justify-between items-center">
              <p className="">Total Income</p>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className=" font-bold text-2xl text-sidebar-primary">
                ${totalIncome}
              </h1>
              <p className="font-semibold text-muted-foreground">
                From {income?.length} transactions
              </p>
            </div>
          </div>
        </div>
        <div className="Expenses flex-1 rounded-md p-3 border-solid border-[1px] shadow-md">
          <div className=" m-2 ">
            <div className="flex justify-between items-center">
              <p>Total Expenses</p>
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h1 className=" font-bold font-roboto text-2xl text-red-600">
                ${totalExpense}
              </h1>
              <p className=" font-semibold text-muted-foreground">
                From {expenses?.length} transactions
              </p>
            </div>
          </div>
        </div>
      </div>

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
                value={filters.category || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categorys?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${cat.color.class}`}
                        />
                        {cat.name}
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
                value={filters.type || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
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
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Showing {sortedData.length} filtered transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
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

          <div className="space-y-3 mt-4">
            {sortedData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions found</p>
              </div>
            ) : (
              sortedData.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-12 gap-4 py-3 border-b border-border/50 hover:bg-muted/50 rounded-lg px-2"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="font-medium text-sm">{tx.description}</p>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    {(() => {
                      const cat = categorys?.find(
                        (c) => c.name === tx.category
                      );
                      const colorClass = cat?.color?.class || "bg-gray-400";
                      return (
                        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                      );
                    })()}
                    <span className="text-sm">{tx.category}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{tx.date}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`p-2 ${
                        tx.type === "expense"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}$
                      {Number(tx.amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Badge
                      variant={tx.type === "income" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {tx.type}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Button
                    onClick={()=>handleDelete(tx.id!)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
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

export default Transactions;
