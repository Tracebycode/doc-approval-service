// ---- POST ROUTES ----
import {Router} from 'express';
import {PostController} from '../controllers/post.controller.ts';
import multer from 'multer';
import { authvalidate } from '../middlewares/auth.ts';
import { requireRole } from '../middlewares/requireRole.ts';

const router = Router();

//multer
const upload  = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5* 1024 * 1024 } // 5 MB limit
})






//create post
router.post('/create',upload.single('file'),authvalidate,requireRole('writer'),PostController.CreatePostController);
//post list
router.get('/list',authvalidate,requireRole('manager'),PostController.PostlistController);
//post submit
router.post('/submit',authvalidate,requireRole('writer'),PostController.PostSubmitController);
//post approve
router.get('/approve',authvalidate,requireRole('manager'),PostController.ApprovePostController);
//post reject
router.get('/reject',authvalidate,requireRole('manager'),PostController.RejectPostController);


export default router;