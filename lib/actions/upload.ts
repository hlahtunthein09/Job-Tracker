// For profile image upload
"use server";

import path from "path";
import { getSession, db } from "../auth/auth";
import { mkdir } from "fs/promises";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";


export async function uploadAvatar(formData: FormData)
{
    try{

        const session = await getSession();
        if(!session?.user) return { error: "Unauthorized" };

        const file = formData.get("file") as File;
        if(!file) return { error: "No file provided" };

        // Only accept images
        if(!file.type.startsWith("image/")) return { error: "Only image files are allowed" };

        // Limit to 2MB
        if(file.size > 2 * 1024 * 1024) return { error: "File too large. Maximum size is 2MB." };

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
        await mkdir(uploadDir, { recursive: true });

        const fileName = `${session.user.id}-${Date.now()}.${file.name.split(".").pop()}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/avatars/${fileName}`;

        // Update user image in database (handle both string and ObjectId _id formats)
        const query: Record<string, unknown> = { _id: session.user.id };
        try {
            query._id = new ObjectId(session.user.id);
        } catch(err) {
            // keep as string
            console.error("Error creating ObjectId:", err);
        }

        const updateResult = await db.collection("user").updateOne(
            query,
            { $set: { image: imageUrl, updatedAt: new Date() } }
        );

        console.log("Avatar uploaded:", imageUrl, "DB update:", updateResult);

        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true, url: imageUrl, dbUpdated: updateResult.modifiedCount };
    }
    catch(err) {
        console.error("Error uploading avatar:", err);
        return { error: "Failed to upload avatar" };
    }
    
}