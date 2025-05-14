import { Image, Loader2, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";

export default function MessageInput() {
    const [text,setText]=useState("");
    const [imagePreview,setImagePreview]=useState(null);
    const fileInputRef = useRef(null)
    const {sendMessage,isSendingMessage}=useChatStore();

    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image file!");
            return;
        }

        const reader= new FileReader();
        reader.onload=()=>{
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file);
    }
    const removeImage=()=>{
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value=""
    }
    const handleSendMessage=async (e)=>{
        e.preventDefault();
        if(!text.trim()&&!imagePreview) return;
        try{
            await sendMessage(({
                text:text.trim(),
                image:imagePreview,
            }))

            setText("")
            setImagePreview(null)
            if(fileInputRef.current) fileInputRef.current.value=""

        }catch(error){
            console.error("Failed to send message:",error)
        }
    }
  return (
    <div className="p-4 w-full">
        {imagePreview&&(
            <div className="mb-3 flex items center gap-2">
                <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
                    <button 
                    onClick={removeImage}
                    type="button"
                    className="absolute -top-1 5 -right-1 5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center cursor-pointer">
                    <X className="size-3"/>
                    </button>
                </div>
            </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 flex gap-2">
                <input type="text"
                 placeholder="Type a message..." 
                 value={text} 
                 className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                 onChange={(e)=>setText(e.target.value)}/>
                 <input type="file" 
                 accept="image/*" 
                 ref={fileInputRef} 
                 onChange={handleImageChange} 
                 className="hidden" />
                 <button type="button"
                 className={`hidden sm:flex btn btn-circle ${imagePreview?"text-emerald-500":"text-zinc-400"}`}
                 onClick={()=>fileInputRef.current?.click()}>
                    <Image size={20}/>
                 </button>
            </div>
            {isSendingMessage?
            <button className="btn btn-sm btn-ghost flex items-center justify-center" onClick={(e)=>e.preventDefault()}>
                <Loader2 className="size-5 animate-spin"/>
            </button>:
            <button
            type="submit"
            className="btn btn-sm btn-gost flex items-center justify-center"
            disabled={!text.trim()&&!imagePreview}>
                <Send className="size-5"/>
            </button>
            }
        </form>
    </div>
  )
}
