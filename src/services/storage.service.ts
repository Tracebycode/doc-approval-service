import fs from 'fs'
import path from 'path'
import {PostStatus, PostTypes} from '../types/posts'

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

    //future scope if the write want to update the post
    static async updatePostById(id:string,post:PostTypes){
        const storageData =await this.ReadStorage(this.StoragePath);
        const index = storageData.posts.findIndex((post:PostTypes)=>post.id===id);
        if(index!==-1){
            storageData.posts[index] = post;
            this.WriteStorage(this.StoragePath,storageData);
        }
    }


    //Submitting the post for the approval
    static async submitPostForApproval(id:string){
        const storageData =await this.ReadStorage(this.StoragePath);
        const index = storageData.posts.findIndex((post:PostTypes)=>post.id===id);
        if(index!==-1){
            storageData.posts[index].status = PostStatus.PENDING;
            this.WriteStorage(this.StoragePath,storageData);
        }
}



        static async approvePost(id:string){
    const storageData =await this.ReadStorage(this.StoragePath);
    const index = storageData.posts.findIndex((post:PostTypes)=>post.id===id);
    if(index!==-1){
        storageData.posts[index].status = PostStatus.APPROVED;
        this.WriteStorage(this.StoragePath,storageData);
    }
}


    static async rejectPost(id:string){
    const storageData =await this.ReadStorage(this.StoragePath);
    const index = storageData.posts.findIndex((post:PostTypes)=>post.id===id);
    if(index!==-1){
        storageData.posts[index].status = PostStatus.REJECTED;
        this.WriteStorage(this.StoragePath,storageData);
    }
}



}

