export interface PostTypes{
    id:string,
    title:string,
    image?:string,
    content:string,
    status:PostStatus,
    createdAt:string,
    updatedAt:string

}

export enum PostStatus{
    PENDING,
    APPROVED,
    REJECTED
    
}


