import newRequest from "./newRequest";

export interface CategoryWithSpent extends Category {
  spent: number;
}
 
export interface Category {
  id?: string
  name: string;
  color: {
    class: string;
    name: string;
    value: string;
  };
}

export const createCategory = async (category: Category) => {
  const res = await newRequest.post("/category", category);
  return res.data;
};

export const getCategory = async () => {
  const res = await newRequest.get("/category");
  return res.data;
};
export const updateCategory = async ({
  id,
  category,
}: {
  id: string;
  category: Category;
}) => {
  const res = await newRequest.put(`/category/${id}`, category);
  return res.data;
};
export const deleteCategory = async (id: string) => {
  const res = await newRequest.delete(`/category/${id}`);
  return res.data;
};
