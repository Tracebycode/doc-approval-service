import {Router} from 'express';
import { CreatePostController ,PostlistController,PostSubmitController} from '../controllers/post.controller';
import multer from 'multer';
import { authvalidate } from '../middlewares/auth';

const router = Router();


const upload  = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5* 1024 * 1024 } // 5 MB limit
})







router.post('/create',upload.single('file'),authvalidate,CreatePostController);
router.get('/list',authvalidate,PostlistController);
router.post('/:id/submit',authvalidate,PostSubmitController);


export default router;