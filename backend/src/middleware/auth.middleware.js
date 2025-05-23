import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({success:false,messgae:"Unauthorized - No Token Provided"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({success:false,message:"Unauthorized - Invalid Token"})
        }

        const user =await User.findById(decoded.userID).select("-password");

        if(!user){
            return res.status(404).json({success:false,message:"User not Found"})
        }
        req.user=user
        next()
    } catch (error) {
        console.log("Error From Auth Middleware",error.message)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}