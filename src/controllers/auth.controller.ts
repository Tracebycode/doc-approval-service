import {users} from '../storage/users';
import { Response,NextFunction } from 'express';
import { authrequest } from '../storage/users';

    
export const authcontroller = (req:authrequest,res:Response,next:NextFunction)=>{

    const {username,password} = req.body;
     if(!username){
        return res.status(403).json({
            message:"Unauthorized"
        })
     }
     if(!password){
        return res.status(403).json({
            message:"Unauthorized"
        })
     }

     if(!users[username]){
        return res.status(403).json({
            message:"Unauthorized"
        })
     }

     if(users[username].password !== password){
        return res.status(403).json({
            message:"Unauthorized"
        })
     }

  

     res.status(200).json({
        message:"Authorized"
     })
    
}
