import newRequest from "./newRequest";


export interface Budgets {
    id?: string
  category: string;
  amount: number | string;
  period: "monthly" | "yearly";
}

export const createBudgets = async (budgets: Budgets)=>{
    const res = await newRequest.post("/budget", budgets)
    return res.data
}

export const getBudgets = async ()=>{
    const res = await newRequest.get("/budget")
    return res.data
}
export const updateBudget = async ({id, amount}: {id: string, amount: number})=>{
    const res = await newRequest.put(`/budget/${id}`, {amount})
    return res.data
}
export const deleteBudget = async (id: string)=>{
    const res = await newRequest.delete(`/budget/${id}`)
    return res.data
}