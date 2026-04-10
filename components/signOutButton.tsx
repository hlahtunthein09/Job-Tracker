"use client";

import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function SignOutButton(){
    const router = useRouter();

    const handleSignOut = async () => {
       const result =  await signOut();

       if(result.data) {
        router.push("/sign-in");
        router.refresh(); // This is the magic line that forces Navbar to re-check the session
       }
       else{
        alert("Failed to sign out.")
       }

    };

    return(
        <DropdownMenuItem onClick={handleSignOut}>
            Log out
        </DropdownMenuItem>
    )
}