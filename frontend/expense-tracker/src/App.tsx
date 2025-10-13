import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budgets"
import Reports from "./pages/Reports"
import Profile from "./pages/Profile";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <div className="">
      <QueryClientProvider client={queryClient}>

      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/transactions" element={<Transactions/>} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/reports" element={<Reports/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
      </QueryClientProvider>
    </div>
  );
}

{
}
