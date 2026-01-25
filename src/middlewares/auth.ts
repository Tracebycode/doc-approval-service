import { Request,Response,NextFunction } from "express";
import { users } from "../storage/users";
import {authrequest} from "../storage/users"

// ---- AUTH MIDDLEWARE ----
export const authvalidate=(req:authrequest,res:Response,next:NextFunction)=>{

    // ---- AUTH VALIDATION ----
    const authheader = req.header("authorization");
    if(!authheader){
        return res.status(401).json({
            message:"Unauthorized ,please provide authorization header"
        })
    }

    // ---- AUTH VALIDATION ----
    const base64credentials = authheader.split(" ")[1];
    const decodedcredentials = Buffer.from(base64credentials,"base64").toString('utf-8');

    const [username,password]= decodedcredentials.split(":");

    if(!users[username]){
        return res.status(401).json({
            message:"Unauthorized, please provide valid credentials"
        })
    }

    if(users[username].password !== password){
        return res.status(401).json({
            message:"Unauthorized, please provide valid credentials"
        })
    }

    req.user = {
        username:username,
        role:users[username].role
    }

    next();


}