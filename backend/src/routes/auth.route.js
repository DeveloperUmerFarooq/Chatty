import express from 'express'
import {signup,login,logout,updateProfile,checkAuth} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';
const router=express.Router()

//POST route Sign Up
//Access Public
router.post("/signup",signup);


//POST route Login
//Access Public
router.post("/login",login);


//POST route Logout
//Access Public
router.post("/logout",logout);


//PUT route avatar
//Access Public
router.put("/update-profile",protectRoute,updateProfile)


//GET route check
//Access Public
router.get("/check",protectRoute,checkAuth)

export default router;