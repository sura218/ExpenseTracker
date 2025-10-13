import { Router } from "express";
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";

const budgetRouter = Router();

budgetRouter.post("/", createBudget);
budgetRouter.get("/", getBudgets);
budgetRouter.put("/:id", updateBudget);
budgetRouter.delete("/:id", deleteBudget);

export default budgetRouter;
