import { Request,Response,NextFunction } from "express";
import { users } from "../storage/users";
import {authrequest} from "../storage/users"

export const authvalidate=(req:authrequest,res:Response,next:NextFunction)=>{

    const authheader = req.header("authorization");
    if(!authheader){
        return res.status(403).json({
            message:"Unauthorized"
        })
    }


    const base64credentials = authheader.split(" ")[1];
    const decodedcredentials = Buffer.from(base64credentials,"base64").toString('utf-8');

    const [username,passward]= decodedcredentials.split(":");

    if(!users[username]){
        return res.status(403).json({
            message:"Unauthorized"
        })
    }

    if(users[username].password !== passward){
        return res.status(403).json({
            message:"Unauthorized"
        })
    }

    req.user = {
        username:username,
        role:users[username].role
    }

    next();




    

}