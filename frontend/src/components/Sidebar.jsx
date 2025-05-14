import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore"
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";

export default function Sidebar() {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore()
    const { onlineUsers, authUser } = useAuthStore()
    const [onlineOnly,setOnlineOnly]=useState(false);

    useEffect(() => {
        getUsers()
        
    }, [getUsers])

    const filteredUsers= onlineOnly?users.filter(user=>onlineUsers.includes(user._id)):users

    if (isUsersLoading) return <SidebarSkeleton />
    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex gap-2 items-center">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>

                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2 select-none">
                    <input type="checkbox" 
                    checked={onlineOnly}
                    onChange={(e)=>setOnlineOnly(e.target.checked)}
                    className="checkbox checkbox-xs" />
                    <span className="text-sm">Show Online Only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length-1} online)</span>
                </div>
                
            </div>

            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.length === 0 && (<p className="text-center">No Online users found!</p>) }
                {filteredUsers.length === 1 && filteredUsers[0]._id === authUser._id ?
                    (<p className="text-center">No users found!</p>) :
                    [...filteredUsers]
                        .sort((a, b) => {
                            const aOnline = onlineUsers.includes(a._id);
                            const bOnline = onlineUsers.includes(b._id);
                            return aOnline === bOnline ? 0 : aOnline ? -1 : 1
                        }).map((user) => (
                            <button
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors cursor-pointer
                ${selectedUser?._id === user._id ? "bg-base-300 ring-2 ring-base-300" : ""}    
                `}
                            >
                                <div className="relative mx-auto lg:mx-0">
                                    <img src={user.avatar || "/avatar.png"} alt={user.name}
                                        className="size-12 object-cover rounded-full" />
                                    {onlineUsers.includes(user._id) && (
                                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                                    )
                                    }
                                </div>
                                {/* user info */}

                                <div className="hidden lg:block text-left min-w-0">
                                    <div className="font-medium truncate">{user.fullName}</div>
                                    <div className="text-sm text-zinc-400">{onlineUsers.includes(user._id) ? "Online" : "Offline"}</div>
                                </div>
                            </button>
                        ))}
            </div>


        </aside>
    )
}
