import React, { useState } from "react";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import { Label } from "../components/ui/Label";
import { RadioGroup, RadioGroupItem } from "../components/ui/RadioGroup";
//import { Transactions } from "./Reports";
import { Input } from "../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";

import { createTransactions, TransactionForm } from "../utils/transaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category, getCategory } from "../utils/category";


const AddTransactions = () => {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<TransactionForm>({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense" as "income" | "expense",
  });

  const queryClient = useQueryClient();

  const addMutation = useMutation({
  mutationFn: createTransactions,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["transaction"] });
    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
    });
    setOpen(false); // ✅ close modal
  },
});

const {data} = useQuery<Category[]>({
  queryKey:["category"],
  queryFn:getCategory
})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleValueChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: Number(formData.amount), // convert string → number
    };

    addMutation.mutate(payload);
  };

  const relevantCategories = data?.filter((cat) =>
    formData.type === "income" ? cat.name === "income" : cat.name !== "income"
  );

  return (
    <div>
      <div className="flex ">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              AddTransaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="sm:max-w-[425px]">
              <DialogTitle className="flex items-center gap-5">
                <Plus className="w-5 h-5" />
                Add New Transaction
              </DialogTitle>
              <DialogDescription className="font-medium">
                Record your income or expense transaction
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="">
              <div className="space-y-3">
                <Label>Transaction Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(Value) => {
                    handleValueChange("type", Value);
                  }}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="income" />
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <TrendingUp className="w-4 h-4 text-chart-2" />
                      <span className="font-medium text-chart-2">Income</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <TrendingDown className="w-4 h-4 text-chart-3" />
                      <span className="font-medium text-chart-3">Expense</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-3">
                <Label>
                  {formData.type === "income"
                    ? "Income Source"
                    : "Expense Description"}
                </Label>
                <Input
                  name="description"
                  className="w-full"
                  value={formData.description}
                  placeholder={
                    formData.type === "income"
                      ? "e.g., Salary, Freelance work"
                      : "e.g., Grocery shopping, Gas"
                  }
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label className=" font-medium text-foreground">
                  Amount ($)
                </Label>
                <Input
                  name="amount"
                  value={formData.amount}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleValueChange("category", value)
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={`Select ${formData.type} category`}
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {relevantCategories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color.value }}
                            />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  name="date"
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  type={"submit"}
                  className={`flex-1 ${
                    formData.type === "income"
                      ? "bg-chart-2 hover:bg-chart-2/90"
                      : "bg-chart-3 hover:bg-chart-3/90"
                  }`}
                >
                  {formData.type === "income" ? "Add Income" : "Add Expense"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddTransactions;
