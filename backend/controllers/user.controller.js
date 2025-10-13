import { db } from "../config/env.js";


// Create new user
export const createUser = async (req, res) => {
  try {
    const docRef = await db.collection("users").add({
      username: req.body.username,
      email: req.body.email,
    });
    res.status(201).send({ id: docRef.id, message: "User created" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


// Get all users
export const getUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};