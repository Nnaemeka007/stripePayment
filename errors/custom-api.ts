import { StatusCodes } from "http-status-codes";

export class CustomAPIError extends Error{
    constructor(message:string, public readonly statusCode:number){
        super(message)
        this.name=new.target.name
        Object.setPrototypeOf(this,new.target.prototype)
    }
}

export const createCustomError=(msg:string,statusCode:number=StatusCodes.INTERNAL_SERVER_ERROR):CustomAPIError=>{
 return new CustomAPIError(msg,statusCode)
}