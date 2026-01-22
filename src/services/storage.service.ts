import fs from 'fs'
import path from 'path'
import {PostTypes} from '../types/posts'

interface storageshape{
    posts:[]
}

export class storageService{
    private static StoragePath:string=path.join(__dirname,'../storage/post.json')

     private static ReadStorage(StoragePath:string){

        if(fs.existsSync(StoragePath)){
            const fileContent = fs.readFileSync(StoragePath,'utf-8');
            return JSON.parse(fileContent);
        }

    }

    private static WriteStorage(StoragePath:string,data:storageshape){
        fs.writeFileSync(StoragePath,JSON.stringify(data,null,2));
    }


    static async CreatePost(post:PostTypes){
        const  storageData =await this.ReadStorage(this.StoragePath);
        storageData.posts.push(post);
        this.WriteStorage(this.StoragePath,storageData);
    }

    static async GetPostsbyID(id:string){
        const storageData =await this.ReadStorage(this.StoragePath);
        return storageData.posts.find((post:PostTypes)=>post.id===id);

    }

    static async GetPosts(){
        const storageData =await this.ReadStorage(this.StoragePath);
        return storageData.posts;
    }


    static async updatePostById(id:string,post:PostTypes){
        const storageData =await this.ReadStorage(this.StoragePath);
        const index = storageData.posts.findIndex((post:PostTypes)=>post.id===id);
        if(index!==-1){
            storageData.posts[index] = post;
            this.WriteStorage(this.StoragePath,storageData);
        }
    }



    
    
    
}

