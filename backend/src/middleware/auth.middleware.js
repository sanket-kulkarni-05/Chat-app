import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

 export const protectRoutes = async(req,res,next) =>{
    try{
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({message:"unathorized -no token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message:"Unathorized -no token provided"}); 
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        req.user = user

        next()


    }catch(error){
        console.log("errorin protected routemiddleware ", error.message);
        res.status(500).json({message:"internal error"});
    }
 }; 