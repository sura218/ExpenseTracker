import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import { Card } from "../components/ui/Card";
import { Settings, Trash2, Edit } from "lucide-react";
import { Category, createCategory, deleteCategory, getCategory, updateCategory } from "../utils/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



const colorOptions = [
  { name: "Green", value: "#84cc16", class: "bg-chart-1" },
  { name: "Blue", value: "#3b82f6", class: "bg-chart-2" },
  { name: "Orange", value: "#ea580c", class: "bg-chart-3" },
  { name: "Gray", value: "#6b7280", class: "bg-chart-4" },
  { name: "Purple", value: "#8b5cf6", class: "bg-chart-5" },
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "Yellow", value: "#eab308", class: "bg-yellow-500" },
  { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
];

const CategoryManager = () => {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: {
      class: "",
      name: "",
      value: "",
    },
  });


  const queryClient = useQueryClient();

  const {data: Category, isLoading} = useQuery({
    queryKey:["categorys"],
    queryFn:getCategory
  })

  const addMutation = useMutation({
    mutationFn:createCategory,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["category"]})
      setFormData({
      name: "",
      color: {
        class: "",
        name: "",
        value: "",
      },
    })
    }
  })

  const updateMutation = useMutation({
    mutationFn:updateCategory,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["category"]})
      setFormData({
      name: "",
      color: {
        class: "",
        name: "",
        value: "",
      },
    })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["category"]})
    }
  })

  if(isLoading) return <p>Loading...</p>

  // console.log("Category ", Category)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    if (editingCategory) {
      // Update existing category
      const updatedCategory: Category = {
      ...editingCategory,
      name: formData.name,
      color: {
        class: formData.color.class,
        name: formData.color.name,
        value: formData.color.value,
      },
    };
    updateMutation.mutate({ id: editingCategory.id!, category: updatedCategory });

    } else {
      // Add new category
      const newCategory: Category = {
        name: formData.name,
        color: {
          class: formData.color.class,
          name: formData.color.name,
          value: formData.color.value,
        },
      };
      console.log("newCategory", newCategory,"formData",formData)
      addMutation.mutate(newCategory)
    }
    // Reset form
    ;
    setEditingCategory(null);
    setOpen(false);
  };

  const handleEdit = (category: Category) => {
  setEditingCategory(category);
  setFormData({
    name: category.name,
    color: {
      class: category.color.class,
      name: category.color.name,
      value: category.color.value,
    },
  });
  setOpen(true);
};

  const handleDelete = (categoryId: string) => {
    console.log("categoryId", categoryId)
    deleteMutation.mutate(categoryId)
    // const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
    // onUpdateCategories(updatedCategories);
  };

  const handleColorSelect = (classes: string, name: string, value: string) => {
    setFormData((prev) => ({ ...prev, color:{...prev.color, class:classes,name, value} }));
    console.log(formData)
  };

  return (

    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Manage Categories
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add, edit, or delete expense categories to organize your
              transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Existing Categories */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">
                Current Categories
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-32 overflow-y-auto">
                {Category.map((category: Category) => (
                  <Card key={category.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                    {/* {console.log(category)} */}
                        <div
                          className={`w-3 h-3 rounded-full ${category.color.class}`}
                        />
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id!)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium text-foreground">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h4>
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  placeholder="Enter category name..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`p-2 rounded-md border-2 transition-colors ${
                        formData.color.value === option.value
                          ? "border-primary"
                          : "border-border"
                      }`}
                      onClick={() =>
                        handleColorSelect(option.class, option.name, option.value)
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${option.class}`} />
                        <span className="text-xs">{option.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({
                      name: "",
                      color: {
                        class: "",
                        name: "",
                        value: "",
                      },
                    });
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? "Update" : "Add"} Category
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
