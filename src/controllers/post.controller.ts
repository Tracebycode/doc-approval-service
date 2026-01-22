import { Request, Response, NextFunction } from 'express';
import { storageService } from '../services/storage.service';
import { PostTypes, PostStatus } from '../types/posts';
import {DocumentParseService} from '../services/parser.service';
import { v4 as uuidv4 } from 'uuid';



export const CreatePostController = async (req: Request, res: Response, next: NextFunction) => {

    const file = req.file;
    if (!file) {
        return res.status(409).json({
            message: "No file uploaded"
        })
    }
    try {
        const parsedDocument = await DocumentParseService.ParseDocument(file.buffer, file.originalname);
        const post: PostTypes = {
            id: uuidv4(),
            title: parsedDocument.title,
            content: parsedDocument.content,
            image: parsedDocument.image,
            status: PostStatus.PENDING,
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