import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore"
import {CameraIcon, Mail, UserRound} from 'lucide-react';
export default function ProfilePage() {
  const {authUser,isUpdatingProfile,updateProfile}=useAuthStore();
  const [img,setImg]=useState(null);
  const handleUpload = async (e)=>{
      const file=e.target.files[0];
      if(!file) return;
      const reader= new FileReader();

      reader.readAsDataURL(file);
      reader.onload=async ()=>{
        const Image=reader.result;
        setImg(Image);
        await updateProfile({src:Image});
      }
  }
  console.log(authUser)
  return (
    <>
    <div className="h-screen pt-10 sm:pt-20">
      <div className="max-w-2xl mx-auto px-4 pb-10">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div>
            <h1 className="text-4xl text-zinc-400 font-semibold text-center">Profile</h1>
            <p className="mt-2 text-center">Your Profile Information</p>
          </div>

        {/* avatar upload section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img src={img ||authUser.avatar || "/avatar.png"} alt="profile-image" className={`size-32 rounded-full object-cover border-4 cursor-pointer ${isUpdatingProfile ? "animate-pulse pointer-events-none":""}`} loading="lazy" />
            <label htmlFor="avatar-upload"
            className={`
            absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer
            transition-all duration-200 opacity-75 hover:opacity-100
            ${isUpdatingProfile ? "animate-bounce pointer-events-none":""}
            `}>
              <CameraIcon className="w-5 h-5 text-base-200"/>
            </label>
            <input type="file" id="avatar-upload" className="hidden" accept="image/*" 
            onChange={handleUpload} disabled={isUpdatingProfile} />
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile?"Uploading":"Click the camera icon to update your image"}
          </p>
        </div>

        {/* User Info */}
        <div className="space-y-5">
          <div className="space-y-1 5">
            <div className="test-sm text-zinc-400 hover:text-white cursor-pointer inline-flex items-center gap-2">
              <UserRound className="w-4 h-4"/>Full Name
            </div>
            <p className="px-4 py-2 5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
          </div>
          <div className="space-y-1 5">
            <div className="test-sm text-zinc-400 inline-flex cursor-pointer items-center hover:text-white gap-2">
              <Mail className="w-4 h-4"/>Email
            </div>
            <p className="px-4 py-2 5 bg-base-200 rounded-lg border">{authUser?.email}</p>
          </div>
        </div>
        <div className="mt-6 bg-base-300 rounded-xl py-6">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>MemberSince</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
        
        </div>
      </div>
    </div>
    </>
  )
}
