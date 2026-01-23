import { Request, Response, NextFunction } from 'express';
import { storageService } from '../services/storage.service';
import { PostTypes, PostStatus } from '../types/posts';
import {DocumentParseService} from '../services/parser.service';
import { v4 as uuidv4 } from 'uuid';
import { authrequest } from '../storage/users';



//post create controller
export const CreatePostController = async (req: authrequest, res: Response, next: NextFunction) => {

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
            message: "Post created successfully"
        })
    } catch (error) {
        return res.status(403).json({
            message: "An unexpected error occurred"
        })
    }



}

//post list controller

export const PostlistController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const posts = await storageService.GetPosts();
        res.status(200).json({
            message: "Posts fetched successfully",
            data: posts
        })
    } catch (error) {
        return res.status(403).json({
            message: "An unexpected error occurred"
        })
    }
}


//post submit contoller

export const PostSubmitController= async(req:authrequest,res:Response,next:NextFunction)=>{
   const {id} = req.params;
   console.log(id);
   if(!id || Array.isArray(id)){
       return res.status(407).json({
           message:"Invalid post id"
       })
   }

   if(req.user?.role !== 'writer'){
       return res.status(403).json({
           message:"Unauthorized"
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
   post.status = PostStatus.PENDING
   await storageService.submitPostForApproval(id)
   res.status(200).json({
       message:"Post submitted successfully"
   })

}