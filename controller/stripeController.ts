import { Request,Response } from "express";
import Stripe from "stripe"


const stripeKey=process.env.STRIPE_SECRET_KEY
if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY is missing from environment variables.');
}

const stripe=new Stripe(stripeKey)

export const stripeController=async (req:Request,res:Response)=>{
    const{purchase,total_amount,shipping_fees}=req.body

    const calcualteOrderAmount=()=>{
       return total_amount + shipping_fees
    }

    const paymentIntent=await stripe.paymentIntents.create({
        amount:calcualteOrderAmount(),
        currency:'usd'
    })
    res.json({clientSecret:paymentIntent.client_secret})
}