import User from '../Models/UserModel.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup  = async (req, res, next) => {
    const { userName, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword });
    try{
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch(err){
        next(err);
    }
}

export const signin = async(req, res, next) => {
    const { email, password } = req.body;
    try{
        const validUser = await User.findOne({ email: email});
        if(!validUser){
            return next(errorHandler(404, 'User not found!'));
        }
        const validPassword = await bcryptjs.compare(password, validUser.password);
        if(!validPassword) {
            return next(errorHandler(404, 'Wrong credentials!'));
        }
        const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET);
        const { password:pass, ...rest } = validUser._doc ;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest)
    }catch(err){
        next(err);
    }
}