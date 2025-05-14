import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../src/lib/axios";
import {useAuthStore} from "./useAuthStore"

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage:false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage:async (data)=>{
    const {selectedUser,messages}=get()
    set({isSendingMessage:true})
    try {
      const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,data);
      set({messages:[...messages,res.data]});
    } catch (error) {
      toast.error(error.response.message); 
    }finally{
      set({isSendingMessage:false})
    }
  },

  subscribeToMessages:()=>{
    const{selectedUser}=get();
    if(!selectedUser) return;
    const socket=useAuthStore.getState().socket;
    
    
    socket.on("newMessage",(data)=>{
      if(data.senderId!==selectedUser._id) return;
      set({messages:[...get().messages,data]})
    })
  },

  unsubscribeToMessages:()=>{
    const socket=useAuthStore.getState().socket;
    socket.off("newMessage");
  },
 
  setSelectedUser: async(user)=>{
    set({selectedUser:user})
  },

}));
