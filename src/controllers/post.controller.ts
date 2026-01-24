import { Request, Response, NextFunction } from 'express';
import { storageService } from '../services/storage.service';
import { PostTypes, PostStatus } from '../types/posts';
import {DocumentParseService} from '../services/parser.service';
import { v4 as uuidv4 } from 'uuid';
import { authrequest } from '../storage/users';
import { EmailService } from '../services/email.service';


export class PostController{


    static async CreatePostController(req: authrequest, res: Response, next: NextFunction) {

    const file = req.file;
    const author = req.user?.username;
    if (!file) {
        return res.status(409).json({
            message: "No file uploaded"
        })
    }
    try {
        const parsedDocument = await DocumentParseService.ParseDocument(file.buffer, file.originalname);
        const post: PostTypes = {
            id: uuidv4(),
            author:author!,
            title: parsedDocument.title,
            content: parsedDocument.content,
            image: parsedDocument.image,
            status: PostStatus.DRAFT,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString()

        }

        await storageService.CreatePost(post);
        res.status(201).json({
            id:post.id,
            message: "Post created successfully"
        })
    } catch (error) {
            console.log(error)
        return res.status(403).json({
            message: "An unexpected error occurred"
        })
    }



}

//post list controller

static async PostlistController(req: Request, res: Response, next: NextFunction) {

    try {
        const posts = await storageService.GetPosts();
        res.status(200).json({
            message: "Posts fetched successfully",
            data: posts
        })
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message: "An unexpected error occurred"
        })
    }
}


//post submit contoller

static async PostSubmitController(req:authrequest,res:Response,next:NextFunction){
   const {id} = req.params;
   if(!id || Array.isArray(id)){
       return res.status(407).json({
           message:"Invalid post id"
       })
   }

  
   const post = await storageService.GetPostsbyID(id);
   if(!post){
       return res.status(404).json({
           message:"Post not found"
       })
   }
   if(post.status !== PostStatus.DRAFT){
       return res.status(403).json({
           message:"Post is not in draft status"
       })
   }



   let previousstatus = post.status;
   try{
   await storageService.submitPostForApproval(id)
   await EmailService.sendApproveEmail(post)
   res.status(200).json({

       message:"Post submitted  and mailed successfully"
   })}
   catch(error){
       console.log(error)
       post.status = previousstatus;
       return res.status(403).json({
           message:"An unexpected error occurred"
       })
   }


}




//approve post controller

static async ApprovePostController(req:authrequest,res:Response,next:NextFunction){
    const {id} = req.params;
    if(!id || Array.isArray(id)){
        return res.status(407).json({
            message:"Invalid post id"
        })
    }
   
    const post = await storageService.GetPostsbyID(id);
    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }
    if(post.status !== PostStatus.PENDING){
        return res.status(407).json({
            message:"Post is not in pending status"
        })
    }


    let previousstatus = post.status;
    try{
    await storageService.approvePost(id)
    post.status = PostStatus.APPROVED
    res.status(200).json({
        message:"Post approved successfully"
    })
    }
    catch(error){
        console.log(error)
        post.status = previousstatus;
        return res.status(403).json({
            message:"An unexpected error occurred"
        })
    }
    
}

//reject post controller

static async RejectPostController(req:authrequest,res:Response,next:NextFunction){
    const {id} = req.params;
    console.log(id);
    if(!id || Array.isArray(id)){
        return res.status(407).json({
            message:"Invalid post id"
        })
    }
    const post = await storageService.GetPostsbyID(id);
    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }
    if(post.status !== PostStatus.PENDING){
        return res.status(407).json({
            message:"Post is not in pending status"
        })
    }


    let previousstatus = post.status;
    try{
    await storageService.rejectPost(id)
    post.status = PostStatus.REJECTED
    res.status(200).json({
        message:"Post rejected successfully"
    })
    }
    catch(error){
        console.log(error)
        post.status = previousstatus;
        return res.status(403).json({
            message:"An unexpected error occurred"
        })
    }
    
}



}