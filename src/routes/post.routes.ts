import {Router} from 'express';
import { CreatePostController } from '../controllers/post.controller';
import multer from 'multer';

const router = Router();


const upload  = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5* 1024 * 1024 } // 5 MB limit
})







router.post('/create',upload.single('file'),CreatePostController);


export default router;