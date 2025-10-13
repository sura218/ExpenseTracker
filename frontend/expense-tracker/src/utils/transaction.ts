import newRequest from './newRequest';
export 
interface TransactionForm {
  id?:string
  description: string;
  amount: number | string; // still string for input binding
  category: string;
  date: string;
  type: ("income" | "expense");
}

export const createTransactions = async ( transactions:TransactionForm)=>{
    const res = await newRequest.post("/transaction", transactions)
    return res.data
}

export const getTransactions =  async () =>{
    const res = await newRequest.get("/transaction")
    return res.data
}

export const deleteTransaction = async (id: string) => {
  const res = await newRequest.delete(`/transaction/${id}`);
  return res.data;
};