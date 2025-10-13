import { db } from "../config/env.js";

export const createCategory = async (req, res) =>{
    try {
        const { name, color} = req.body

        const docRef = await db.collection("categories").add({
            name,
            color
        })

        res.status(201).send({ id: docRef.id, message: "Categories Created"})

    } catch (error) {
        res.status(500).send({error: error.message})
    }
}
export const getCategory = async (req, res) =>{
    try {
        const Snapshot = await db.collection("categories").get()
        const categories = Snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }))
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
export const updateCategory = async (req, res) =>{
    try {
        const {id} = req.params
        const {name, color} = req.body

        const categoryRef = db.collection("categories").doc(id)
        const docSnap = await categoryRef.get()

        if(!docSnap.exists) return res.status(404).json({message: "Categories not found"})
        
        await categoryRef.update({
            ...(name && {name}),
            ...(color && {color})
        })
        res.status(200).json({message: "Categories updated successfully!"})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
export const deleteCategory = async (req, res) =>{
    try {
        const {id} = req.params

        const docRef = db.collection("categories").doc(id)
        const docSnap = await docRef.get()

        if(!docSnap.exists)return res.status(404).json({message: "Categories not found"})

        await docRef.delete()
        res.status(201).json({message: "Categories deleted successfully!"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}