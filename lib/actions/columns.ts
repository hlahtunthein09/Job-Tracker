"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";
import { success } from "better-auth";

export async function deleteColumn(columnId: string, boardId: string) {
    // Implementation for deleting a column
    const session = await getSession();
    if( !session?.user) return { error: "Unauthorized" };

    await connectDB();

    const board = await Board.findOne({ _id: boardId, userId: session.user.id });
    if( !board ) return { error: "Board not found" };

    const column = await Column.findOne({ _id: columnId, boardId: boardId });
    if(!column) return { error: "Column not found" };

    await JobApplication.deleteMany({ _id: {
        $in: column.jobApplicationIds || [],
    }});

    await Board.findByIdAndUpdate(boardId, {
        $pull: {
            columns: columnId,
        }
    });

    await Column.findByIdAndDelete(columnId);

    revalidatePath("/dashboard");
    return { success: true };
}