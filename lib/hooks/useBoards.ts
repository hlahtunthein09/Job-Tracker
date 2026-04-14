import { useEffect, useState } from "react";
import { Board, Column, JobApplication } from "../models/models.types";
import { updateJobApplication } from "../actions/job-applications-data";
import { deleteColumn } from "../actions/columns";



export function useBoards(initialBoard: Board | null) {
    const [ board, setBoard ] = useState<Board | null>(initialBoard || null);
    const [ columns, setColumns ] = useState<Column[]>(initialBoard?.columns || []);
    const [ error, setError ] = useState<string | null>(null);

    // tracking board changes
    useEffect(() => {

        if (initialBoard) {
            setTimeout(() => {
                setBoard(initialBoard);
                setColumns(initialBoard?.columns || []);
            }, 0);
        }
    }, [initialBoard]);

    // deleteColumn method
    async function handleDeleteColumn(columnId: string)
    {
        setColumns((prev) => prev.filter((col) => col._id !== columnId));

        try{
            const result = await deleteColumn(columnId, board?._id || "");
            if(result.error) {
                setError(result.error);
            }

        } catch (error) {
            setError("Failed to delete column");
            console.error("Error deleting column:", error);
        }
    }

    async function moveJob(jobApplicationId: string, newColumnId: string, newOrder: number) {

        setColumns((prev) => {
            const newColumns = prev.map((col) => ({
                ...col,
                jobApplications: [...col.jobApplications],
            }));

            // Find and remove job from old column

            let jobToMove : JobApplication | null = null;
            let oldColumnId : string | null = null;

            for(const col of newColumns) {
                const jobIndex = col.jobApplications.findIndex((job) => job._id === jobApplicationId);
                if(jobIndex !== -1 && jobIndex !== undefined) {
                    jobToMove = col.jobApplications[jobIndex];
                    oldColumnId = col._id;

                    col.jobApplications = col.jobApplications.filter((job) => job._id !== jobApplicationId);

                    break;
                }
                
            }

            if(jobToMove && oldColumnId) {
                const targetColumnIndex = newColumns.findIndex((col) => col._id === newColumnId);

                if(targetColumnIndex !== -1) {
                    const targetColumn = newColumns[targetColumnIndex];
                    const currentJobs = targetColumn.jobApplications || [];

                    const updatedJobs = [ ...currentJobs ];
                    updatedJobs.splice(newOrder, 0, {
                        ...jobToMove,
                        columnId: newColumnId,
                        order: newOrder * 100,
                    });

                    const jobsWithUpdatedOrders = updatedJobs.map((job, idx) => ({
                        ...job,
                        order: idx * 100,
                    }));

                    newColumns[targetColumnIndex] = {
                        ...targetColumn,
                        jobApplications: jobsWithUpdatedOrders,
                    };
                }

            }

            return newColumns;

        });

        try{

            const result = await updateJobApplication(jobApplicationId, { 
                columnId: newColumnId, 
                order: newOrder * 100 
            });

        } catch (err) {
            setError("Failed to update job application");
            console.error("Error updating job application:", err);

        }
    }   

    return { board, columns, error, moveJob, handleDeleteColumn };


} 