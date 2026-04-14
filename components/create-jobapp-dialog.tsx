"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import createJobApplicationsData from "@/lib/actions/job-applications-data";

interface CreateJobApplicationDialogProps {
    columnId: string;
    boardId: string;
}

const INITIAL_FORM_DATA = {
        company: "",
        position: "",
        location: "",
        salary: "",
        jobUrl: "",
        tags: "",
        notes: "",
        description: "",
}
export default function CreateJobApplicationDialog({ columnId, boardId} : CreateJobApplicationDialogProps)
{
    const [ open, setOpen ] = useState<boolean>(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    // handleSubmit
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Handle form submission logic
        try
        {
            const result = await createJobApplicationsData({ 
                ...formData,
                columnId,
                boardId,
                tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0),
            });

            if(!result.error)
            {
                setFormData(INITIAL_FORM_DATA);
                setOpen(false);

            }
            else{
                console.error("Failed to create job", result.error);
            }
        }
        catch(err)
        {
            console.error("Error: ", err);
        }
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline"
                    className="w-full mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50"  
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Job
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Add Job Application
                    </DialogTitle>
                    <DialogDescription>
                        Track a new job application
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* form content */}
                    <div className="space-y-4">
                        {/* for first two labels, company and position placed horizontally */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* for company label */}
                            <div className="space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input 
                                    type="text" 
                                    id="company" 
                                    required 
                                    value={formData.company}
                                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                                />
                            </div>
                            {/* for position label */}
                            <div className="space-y-2">
                                <Label htmlFor="position">Position *</Label>
                                <Input 
                                    type="text" 
                                    id="position" 
                                    required 
                                    value={formData.position}
                                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* 2 grids for location and salary */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* for location label */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input 
                                    type="text" 
                                    id="location" 
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                />              
                            </div>
                            {/* for salary label */}
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input 
                                    type="text" 
                                    id="salary" 
                                    value={formData.salary}
                                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                    placeholder="e.g., $100k - $150k"
                                />
                            </div>
                        </div>

                        {/* Job url */}
                        <div className="space-y-2">
                            <Label htmlFor="jobUrl">Job URL</Label>
                            <Input 
                                type="url" id="jobUrl" 
                                placeholder="http://..." 
                                value={formData.jobUrl}
                                onChange={(e) => setFormData({...formData, jobUrl: e.target.value})} 
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input 
                                type="text" 
                                id="tags" 
                                placeholder="e.g., React, Tailwind, High-Paying" 
                                value={formData.tags}
                                onChange={(e) => setFormData({...formData, tags: e.target.value})} 
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                rows={3}
                                placeholder="Brief description of the role..." 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea 
                                id="notes" 
                                rows={4}
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* form footer */}
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Application
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
