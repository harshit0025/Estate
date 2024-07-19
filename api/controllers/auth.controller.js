import User from '../Models/UserModel.js';
import bcryptjs from 'bcryptjs';

export const signup  = async (req, res) => {
    const { userName, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword });
    try{
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch(err){
        res.status(500).json(err.message)
    }
}