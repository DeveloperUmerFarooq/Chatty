import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app=express();
const server=http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:[process.env.BASE_URL]
    }
})

const getRecieverSocketId=(userId)=>{
        return userSocketMap[userId];
}

//used to store online users
const userSocketMap={};

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);

    const userId=socket.handshake.query?.userId
    if(!userId){
        console.warn("No userId provided in socket query")
        socket.disconnect();
        return
    }
    if(userId) userSocketMap[userId]=socket.id
    
    //broadcasts events to the clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap))


    socket.on("disconnect",()=>{
        console.log("A use disconnected",socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

export {io,app,server,getRecieverSocketId}