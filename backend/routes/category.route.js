import { Router } from "express";
import { createCategory, getCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const categoryRoute = Router();

categoryRoute.post("/", createCategory)
categoryRoute.get("/", getCategory)
categoryRoute.put("/:id", updateCategory)
categoryRoute.delete("/:id", deleteCategory)

export default categoryRoute;