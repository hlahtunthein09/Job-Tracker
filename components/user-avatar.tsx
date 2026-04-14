"use client";

import { uploadAvatar } from "@/lib/actions/upload";
import { useRef, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import SignOutButton from "./signOutButton";


export default function UserAvatar({ user } : { user: { name: string; email: string; image?: string | null; } }) {
    const [ image, setImage ] = useState(user.image);
    const [ isUploading, setIsUploading ] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange( e: React.ChangeEvent<HTMLInputElement> ) {
        console.log("handleFileChange fired");
        const file = e.target.files?.[0];
        if(!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadAvatar(formData);
            console.log("Upload result:", result);
            if(result.error || !result.url) {
                console.error("Upload failed:", result.error);
                setIsUploading(false);
                return;
            }

            setImage(result.url);
        } catch (err) {
            console.error("Error uploading avatar:", err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    return(
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="w-8 h-8">
                            <AvatarImage 
                                key={image || "fallback"} 
                                src={image || undefined} 
                                alt={user.name} 
                                onLoadingStatusChange={(status) => console.log("Avatar load status: ", status, "src: ", image || undefined)}
                            />
                            <AvatarFallback className="bg-primary text-white font-bold">
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : user.name[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs text-muted-foreground leading-none">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                    </DropdownMenuItem>
                    
                    <SignOutButton />
                </DropdownMenuContent>
            </DropdownMenu>

            <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </>
    );
}