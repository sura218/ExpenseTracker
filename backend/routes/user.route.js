import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.get("/", (req, res) => res.send({ title: "GET all users" }));
userRouter.get("/:id", (req, res) => res.send({ title: "GET user details" }));
userRouter.put("/:id", (req, res) => res.send({ title: "update user" }));
userRouter.delete("/:id", (req, res) => res.send({ title: "delete user" }));

export default userRouter;
