import { Request } from "express";

export const users:Record<string,{password:string;role:'writer'|'manager'}>={

    'writer':{
        password:'writer123',
        role:'writer'
    },
    'manager':{
        password:'manager123',
        role:'manager'
    }


}

export interface authrequest extends Request{
    user?:{
        username:string,
        role:'writer'|'manager'
    }
}