import { model } from "mongoose";
import { categories, transactions } from "../models/model.js";

export const create_Categories = (req, res) => {
    const { type, color } = req.body;
    const new_categories = new categories({ type, color });
    new_categories.save()
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err))

    console.log("saved")
}

export const get_Categories = async (req, res) => {
    let data = await categories.find({})

    let filter = data.map(v => Object.assign({}, {type: v.type, color: v.color}))

    return res.json(filter)
}

export const create_transaction = async (req, res) => {
    const { name, amount, type } = req.body;
    const new_categories = new transactions({ name, amount, type });
    new_categories.save()
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err))

    console.log("saved")
}

export const get_transaction = async (req, res) => {
     let data = await transactions.find({});
     return res.json(data);
}

export const delete_transaction = async (req, res) => {
     let data = await transactions.deleteOne({ _id: req.body._id });
    console.log("deleted")
    return res.json("deleted");

}

export const get_labels =  (req, res) => {
    transactions.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "type",
                foreignField: "type",
                as: "categories_info"
            },
        },
        {
            $unwind: "$categories_info"
        }
    ]).then(result => {
        let data = result.map(v => Object.assign({}, {_id: v._id, name: v.name, amount: v.amount, type: v.type, color: v.categories_info['color'] }))
        res.json(data);
        // console.log(data, "from labels")
    }).catch(error => {
        res.status(400).json(error)
    })

    
}