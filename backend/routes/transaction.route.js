import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  getTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransaction);
router.delete("/:id", deleteTransaction);

export default router;
