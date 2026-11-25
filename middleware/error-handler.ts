import { Request,Response,NextFunction,ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors";
import mongoose from "mongoose";


interface MongoDuplicateKeyError extends Error {
  code: 11000;
  keyValue: Record<string, unknown>;
}

const isDuplicateKeyError = (e: unknown): e is MongoDuplicateKeyError =>
  e instanceof Error && (e as { code?: unknown }).code === 11000;

interface CustomError{
    statusCode:number;
    msg:string
}

export const errorHandler:ErrorRequestHandler=(err:Error,req:Request,res:Response,next:NextFunction)=>{
    //customError   
    let customError:CustomError={
    statusCode:
    typeof err.cause==='number' ? err.cause : StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
   }
    

    // console.log(err)
    // validateError
     if(err instanceof mongoose.Error.ValidationError){
        customError.msg=Object.values(err.errors).map((item)=>item.message).join(',')
        customError.statusCode=StatusCodes.BAD_REQUEST
     }
    
    if(err instanceof CustomAPIError){
        return res.status(err.statusCode).json({msg:err.message})
    }
    // duplicateError
    if(isDuplicateKeyError(err)){
     customError.msg=`Duplicate value entered for ${Object.keys(err.keyValue).join(", ")} field, pls choose another value`
     customError.statusCode=StatusCodes.BAD_REQUEST
    }
     
    // castError
    if(err instanceof mongoose.Error.CastError){
       customError.msg=`No item found with id :${err.value}`
       customError.statusCode=StatusCodes.BAD_REQUEST
    }
//   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
  return res.status(customError.statusCode).json({msg:customError.msg})

}