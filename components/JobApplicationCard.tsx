"use client";
import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/actions/job-application";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { HTMLAttributes, SyntheticEvent, useState } from "react";
import { Input } from "./ui/input";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
  dragHandleProps?: HTMLAttributes<HTMLElement>;
}

export default function JobApplicationCard({
  job,
  columns,
  dragHandleProps,
}: JobApplicationCardProps) {
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job?.location,
    salary: job?.salary,
    jobUrl: job?.jobUrl,
    tags: job?.tags,
    description: job?.description,
    notes: job?.notes,
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateJobApplication(job._id, { ...formData });

      if (result.error) {
        console.error("Error updating job application:", result.error);
      }
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Unexpected error via updating:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMove(newColumnId: string) {
    try {
      const result = await updateJobApplication(job._id, {
        columnId: newColumnId,
      });

      if (result.error) {
        console.error("Error moving job application:", result.error);
      }
    } catch (error) {
      console.error("Unexpected error via moving:", error);
    }
  }

  async function handleRemove(id: string) {
    try {
      const result = await deleteJobApplication(id);

      if (result.error) {
        console.error("Error deleting job application:", result.error);
      }
    } catch (error) {
      console.error("Unexpected error via deleting:", error);
    }
  }

  return (
    <div>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        {...dragHandleProps}
      >
        <CardContent>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {job.company}
              </p>
              {job.description && (
                <p className="text-xs text-muted-foreground mb-2 ">
                  {job.description}
                </p>
              )}
              {job.tags && job.tags.length > 0 && (
                <div className=" flex flex-wrap gap-1 mb-2">
                  {job.tags.map((tag, index) => (
                    <span
                      className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      key={index}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs hover:underline mt-1 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <div className="flex items-start gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-4">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-auto">
                  <DropdownMenuItem
                    onClick={() => {
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {columns.length > 1 && (
                    <>
                      {columns
                        .filter((col) => col._id !== job.columnId)
                        .map((col) => (
                          <DropdownMenuItem
                            key={col._id}
                            onClick={() => handleMove(col._id)}
                          >
                            Move to {col.name}
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      handleRemove(job._id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          aria-describedby={"Editing job application form"}
          className={`w-full sm:max-w-2xl overflow-y-auto max-h-screen no-scrollbar`}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Edit Job Application
            </DialogTitle>
          </DialogHeader>
          <form
            className={`space-y-4 ${isLoading ? "pointer-events-none opacity-60" : ""}`}
            onSubmit={handleUpdate}
          >
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Google"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    placeholder="e.g. Software Engineer"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. New York"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    placeholder="e.g. $100,000"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job URL</Label>
                <Input
                  id="jobUrl"
                  placeholder="https://www.linkedin.com/jobs"
                  value={formData.jobUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, jobUrl: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="JavaScript, React, Next.js, Tailwind"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief job description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Additional notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
