import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try {

        const users = await User.find().exec();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json(error);
    }
   
}