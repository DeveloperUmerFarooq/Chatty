import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app,server } from './lib/socket.js'
import path from "path"

dotenv.config()
const dirname=path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser())
app.use(cors({
    origin:process.env.BASE_URL,
    credentials:true,
}))

//auth api
app.use("/api/auth",authRoutes);

//message routes
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV==="production"){

    app.use(express.static(path.join(dirname,"../frontend/dist")));
    app.get("/",(req,res)=>{
        res.sendFile(path.join(dirname,"../frontend/dist/index.html"))
    })
}
//Start Server
const PORT= process.env.PORT
server.listen(PORT,()=>{
    connectDB();
    console.log(`server is running at port:${PORT}`);
})