import { db } from "../config/env.js";

export const createBudget = async (req, res) => {
  try {
    const { category, amount, period } = req.body;

    /*if (
      !category ||
      !["transportation", "food", "entertainment", "utilities"].includes(
        category
      )
    )
      return res.status(400).json({ message: "invalid category" });*/

 

    if (!amount === null || isNaN(Number(amount)))
      return res.status(400).json({ message: "amount must be a number" });

    if (!period || !["monthly", "yearly"].includes(period))
      return res.status(400).json({ message: "invalid period" });
    const pailod = {
      category: category,
      amount: Number(amount),
      period: period,
    };

    const docRef = await db.collection("budegt").add(pailod);
    res.status(201).json({ message: "Budget Created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getBudgets = async (req, res) => {
  try {
    const snapshot = await db.collection("budegt").get();

    const budget = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const budgetRef = db.collection("budegt").doc(id);
    const docSnap = await budgetRef.get();

    if (!docSnap.exists)
      return res.status(404).json({ message: "Budget not found" });

    await budgetRef.update({ amount });

    res.status(200).send({ message: "Budget updated successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budgetRef = db.collection("budegt").doc(id);
    const docSnap = await budgetRef.get();

    if (!docSnap.exists)
      return res.status(404).json({ message: "Budget not found" });
    await budgetRef.delete();
    res.status(201).json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
