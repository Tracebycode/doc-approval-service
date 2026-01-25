//PostTypes interface
export interface PostTypes{
    id:string,
    author:string,
    title:string,
    image?:string,
    content:string,
    status:PostStatus,
    createdAt:string,
    updatedAt:string

}

//PostStatus enum
export enum PostStatus{
    PENDING,
    APPROVED,
    REJECTED,
    DRAFT
    
}


