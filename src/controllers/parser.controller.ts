import { Request,Response,NextFunction } from "express"
import { DocumentParseService } from "../Services/parser.service";

export const  parseContoller = async (req:Request,res:Response,next:NextFunction)=>{


    const file = req.file;
    if(!file){
        return res.status(400).json({error:'No file uploaded'});

    }
      const parsedDocument = await DocumentParseService.ParseDocument(file.buffer,file.originalname);
        return res.status(200).json({data:parsedDocument});
    }



