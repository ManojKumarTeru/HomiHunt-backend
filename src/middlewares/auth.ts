import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
  try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("Token is not valid!!!");
        }

        const decodedObj=await jwt.verify(token,process.env.JWT_SECRET,{expiresIn:"7d"}) as { id: string };
        const {id}=decodedObj;

        const user=await User.findById(id);
        if(!user){
            throw new Error("User not found!!");
        }

        req.user={id};
        next();
        
    }
    catch(err){
        res.status(400).send("ERROR :"+err.message);  
    }
};
