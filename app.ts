import 'dotenv/config'
import mongoose from 'mongoose'
import express,{Request,Response} from 'express'
import { notFound as notFoudMiddlware } from "./middleware/not-found"
import { errorHandler as errorHandlerMiddleware } from "./middleware/error-handler"
import { stripeController } from './controller/stripeController'


const app=express()

app.use(express.json())

app.post('/stripe',stripeController)

app.use(notFoudMiddlware)
app.use(errorHandlerMiddleware)

const port=process.env.PORT
const start=async()=>{
    if(!process.env.DATABASE_URL){
        throw new Error('cannot read db_URL from env')
    }
 try {
    await mongoose.connect(process.env.DATABASE_URL)
    app.listen(port,()=>{
    console.log(`Server is hosted on ${port}...`)
})
 } catch (error) {
    console.log(error)
 }
}
start()