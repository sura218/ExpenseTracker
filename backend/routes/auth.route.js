import { response, Router } from "express";

const authRoutr = Router();

authRoutr.post("/sign-up", (req, response) =>
  response.send({ title: "Sign-up" })
);
authRoutr.post("/sign-in", (req, response) =>
  response.send({ title: "Sign-in" })
);
authRoutr.post("/sign-out", (req, response) =>
  response.send({ title: "Sign-out" })
);

export default authRoutr;
