import  Express  from "express";
import  Router  from "express";
import multer from "multer";
import { parseContoller } from "../controllers/parser.controller";




const router = Router();

// Multer configuration for file uploads
const upload  = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5* 1024 * 1024 } // 5 MB limit
})


router.post('/upload',upload.single('file'), parseContoller);





export default router;
