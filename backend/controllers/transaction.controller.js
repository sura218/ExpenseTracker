import { db } from "../config/env.js";

export const createTransaction = async (req, res) => {
  try {
    const docRef = await db.collection("transactions").add({
      ...req.body, // type, description, amount, category, date
      createdAt: new Date(), // you can also add server-side fields
    });

    res.status(201).send({ id: docRef.id, message: "Transaction created" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const snapshot = await db.collection("transactions").get();

    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const docRef = db.collection("transactions").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).send({ message: "Transaction not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("transactions").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists)
      return res.status(404).json({ message: "Transaction not found" });

    await docRef.delete();
    res.status(201).json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("deleteTransaction error: ", error);
    req.status(500).json({ error: error.message });
  }
};
