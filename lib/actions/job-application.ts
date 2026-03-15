"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import { dbConnect } from "../db";
import { Board, Column, JobApplication } from "../models";

const ORDER_STEP = 100;
interface AddJobApplicationData {
  company: string;
  position: string;
  location?: string;
  columnId: string;
  boardId: string;
  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
  notes?: string;
}

// server logic for adding a new job application to a column
export const addJobApplication = async (data: AddJobApplicationData) => {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await dbConnect();

  const {
    company,
    position,
    location,
    columnId,
    boardId,
    salary,
    jobUrl,
    tags,
    description,
    notes,
  } = data;

  if (!company || !position || !columnId || !boardId) {
    return { error: "Missing required fields" };
  }

  //   verify ownership of the board
  const board = Board.findOne({ _id: boardId, userId: session.user.id });

  if (!board) {
    return { error: "Board not found or unauthorized" };
  }

  const column = Column.findOne({ _id: columnId, boardId: boardId });
  if (!column) {
    return { error: "Column not found or unauthorized" };
  }

  const maxOrder = (await JobApplication.findOne({ columnId })
    .sort({ order: -1 })
    .select("order")
    .lean()) as { order: number } | null;

  const newJobApplication = await JobApplication.create({
    company,
    position,
    location,
    columnId,
    boardId,
    userId: session.user.id,
    salary: salary,
    jobUrl,
    tags: tags ?? [],
    description,
    notes,
    status: "applied",
    order: maxOrder ? maxOrder.order + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { jobApplications: newJobApplication._id },
  });

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(newJobApplication)) };
};

interface UpdateJobApplicationData {
  company?: string;
  position?: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId?: string;
  order?: number;
  tags?: string[];
  description?: string;
}

//server logic to update a job application, including moving it to a different column and reordering within the same column
export async function updateJobApplication(
  id: string,
  updates: UpdateJobApplicationData,
) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication) {
    return { error: "Job application not found" };
  }

  if (jobApplication.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const {
    columnId: columnIdFromUpdates,
    order: orderFromUpdates,
    ...otherUpdates
  } = updates;

  const updatesToApply: Partial<UpdateJobApplicationData> = otherUpdates;

  const currentColumnId = jobApplication.columnId.toString();
  const newColumnId = columnIdFromUpdates?.toString();

  const isMovingToDifferentColumn =
    newColumnId && newColumnId !== currentColumnId;

  if (isMovingToDifferentColumn) {
    // remove the job application from the current column's jobApplications array
    await Column.findByIdAndUpdate(currentColumnId, {
      $pull: { jobApplications: id },
    });

    // other jobs in the target column, excluding the one being moved
    const jobsInTargetColumn = await JobApplication.find({
      columnId: newColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    let newOrderValue: number;

    // if orderFromUpdates is provided and new column is different
    if (orderFromUpdates !== undefined && orderFromUpdates !== null) {
      newOrderValue = orderFromUpdates * ORDER_STEP;

      // take jobs with order more than the new order
      const jobsThatNeedToShift = jobsInTargetColumn.slice(orderFromUpdates);

      // increase their order by ORDER_STEP to make space for the moved job application
      for (const job of jobsThatNeedToShift) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: job.order + ORDER_STEP },
        });
      }
    } // if no orderFromUpdates is provided
    else {
      // if not empty
      if (jobsInTargetColumn.length > 0) {
        const lastJobOrder =
          jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;
        newOrderValue = lastJobOrder + ORDER_STEP;
      } // if empty
      else {
        newOrderValue = 0;
      }
    }

    updatesToApply.columnId = newColumnId;
    updatesToApply.order = newOrderValue;

    // push id to new column
    await Column.findByIdAndUpdate(newColumnId, {
      $push: { jobApplications: id },
    });
  } //moving to the same column but order is changing and orderFromUpdates is provided
  else if (orderFromUpdates !== undefined && orderFromUpdates !== null) {
    const otherJobsInColumn = await JobApplication.find({
      columnId: currentColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    const currentJobOrder = jobApplication.order || 0;

    const nextOrderPositionIndex = otherJobsInColumn.findIndex(
      (job) => job.order > currentJobOrder,
    );

    const oldPositionIndex =
      nextOrderPositionIndex === -1
        ? otherJobsInColumn.length
        : nextOrderPositionIndex;

    const newOrderValue = orderFromUpdates * ORDER_STEP;

    // moved to top
    if (orderFromUpdates < oldPositionIndex) {
      // take between
      const jobsToShiftDown = otherJobsInColumn.slice(
        orderFromUpdates,
        oldPositionIndex,
      );

      for (const job of jobsToShiftDown) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: job.order + ORDER_STEP },
        });
      }
      // moved to bottom
    } else if (orderFromUpdates > oldPositionIndex) {
      const jobsToShiftUp = otherJobsInColumn.slice(
        oldPositionIndex,
        orderFromUpdates,
      );
      for (const job of jobsToShiftUp) {
        const newOrder = Math.max(0, job.order - ORDER_STEP);
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: newOrder },
        });
      }
    }

    updatesToApply.order = newOrderValue;
  }

  const updated = await JobApplication.findByIdAndUpdate(id, updatesToApply, {
    new: true,
  });

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(updated)) };
}

export const deleteJobApplication = async (jobId: string) => {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await dbConnect();

  const jobApplication = await JobApplication.findById(jobId);

  if (!jobApplication) {
    return { error: "Job application not found" };
  }

  if (jobApplication.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await Column.findByIdAndUpdate(jobApplication.columnId, {
    $pull: { jobApplications: jobId },
  });

  await jobApplication.deleteOne({ _id: jobId });

  revalidatePath("/dashboard");
  return { success: true };
};
