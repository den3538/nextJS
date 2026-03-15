"use client";

import { useEffect, useState, useTransition } from "react";
import { Board, Column, JobApplication } from "../models/models.types";
import { updateJobApplication } from "../actions/job-application";
import { start } from "repl";

export function useBoards(initialBoard?: Board | null) {
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const board = initialBoard;

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: number,
  ) {
    const copyColumns = columns.map((col) => ({
      ...col,
      jobApplications: [...col.jobApplications],
    }));

    let jobToMove: JobApplication | null = null;
    let oldColumnId: string | null = null;

    for (const col of copyColumns) {
      const jobIndex = col.jobApplications.findIndex(
        (job) => job._id === jobApplicationId,
      );

      if (jobIndex !== -1) {
        jobToMove = col.jobApplications[jobIndex];
        oldColumnId = col._id;
        col.jobApplications.splice(jobIndex, 1);
        break;
      }
    }

    if (jobToMove && oldColumnId) {
      const targetColumnIndex = copyColumns.findIndex(
        (col) => col._id === newColumnId,
      );

      if (targetColumnIndex !== -1) {
        const targetColumn = copyColumns[targetColumnIndex];
        const currentJobs = targetColumn.jobApplications || [];

        const updatedJobs = [...currentJobs];
        updatedJobs.splice(newOrder, 0, {
          ...jobToMove,
          columnId: newColumnId,
          order: newOrder * 100,
        });

        const jobsWithUpdatedOrders = updatedJobs.map((job, index) => ({
          ...job,
          order: index * 100,
        }));

        copyColumns[targetColumnIndex] = {
          ...targetColumn,
          jobApplications: jobsWithUpdatedOrders,
        };
      }
    }

    setColumns(copyColumns);

    startTransition(async () => {
      try {
        const result = await updateJobApplication(jobApplicationId, {
          columnId: newColumnId,
          order: newOrder,
        });

        if (result.error) {
          setError("Failed to move job application. Please try again.");
          console.error("Error moving job application:", result.error);
        }
      } catch (err) {
        setError(
          "Unexpected error occurred while moving job application. Please try again.",
        );
        console.error("Unexpected error moving job application:", err);
      }
    });
  }

  return { board, columns, error, moveJob, isPending };
}
