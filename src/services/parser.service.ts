import path from 'path';
import mammoth from 'mammoth';


export interface Document_details {
    title: string;
    content: string;
    image?: string;

}


export  class  DocumentParseService {

    // Parses a document buffer and returns its content and metadata
    static async ParseDocument(buffer:Buffer,originalName: string): Promise<Document_details> {
        const extname = path.extname(originalName);
        let text: string;

       if(extname === '.txt' || extname === '.md'){
         text  =  buffer.toString('utf-8');

       }else if(extname === '.docx'){


        const result  = await mammoth.extractRawText({buffer});
         text = result.value;

       }else{
        throw new Error('Unsupported file type');
       }


       return this.parseText(text);

    }


    // Helper method to parse text into title and content

    private static parseText(text: string): Document_details {
        if(!text){
            throw new Error('Empty document');
        }


        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

       if(lines.length === 0){
        throw new Error('No content found in document');
       }


       let title='';
       let image:string |undefined;
       let startIndex =1;

       const imageRegex =/^!\[.*\]\(.*\)$|^https?:\/\//i

       const firstLine = lines[0];

      if(imageRegex.test(firstLine)){
        image = firstLine.match(imageRegex)?.[0];
        title = lines[1];
        startIndex =2;
      }else if (firstLine.startsWith( 'https')){
        image = firstLine;
        title = lines[1];
        startIndex =2;
      }else{
        title = firstLine;
        startIndex =1;
      }

       const content = lines.slice(startIndex).join('\n');

    return {        title,
        content,
        image
    }

          
    }

}