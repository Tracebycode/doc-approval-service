import { Request } from "express";


//users object
export const users:Record<string,{password:string;role:'writer'|'manager'}>={

    'writer1':{
        password:'writer123',
        role:'writer'
    },
    'manager1':{
        password:'manager123',
        role:'manager'
    }


}

//authrequest interface
export interface authrequest extends Request{
    user?:{
        username:string,
        role:'writer'|'manager'
    }
}