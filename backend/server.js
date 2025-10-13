import express from "express";
import { PORT } from "./config/env.js";
import router from "./routes/transaction.route.js";
import userRouter from "./routes/user.route.js";
import budgetRouter from './routes/budget.route.js'
import categoryRoute from "./routes/category.route.js";
import cors from "cors"


const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];



app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/api/transaction", router)
app.use("/api/budget", budgetRouter)
app.use("/api/category", categoryRoute)


app.listen(PORT, () => {
  console.log(`🚀 Expense Tracker API running on http://localhost:${PORT}`);
});
