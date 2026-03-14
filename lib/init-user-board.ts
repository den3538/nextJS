import { DEFAULT_BOARD_NAME, DEFAULT_COLUMNS } from "@/constants/constants";
import { dbConnect } from "./db";
import { Board, Column } from "./models";
import mongoose from "mongoose";

export async function initializeUserBoard(userId: string) {
  await dbConnect();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingBoard = await Board.findOne({ userId }).session(session);
    if (existingBoard) {
      await session.commitTransaction();
      session.endSession();
      return existingBoard;
    }

    const [newBoard] = await Board.create(
      [
        {
          name: DEFAULT_BOARD_NAME,
          userId,
          columns: [],
        },
      ],
      { session },
    );

    const columns = await Column.insertMany(
      DEFAULT_COLUMNS.map((col) => ({
        name: col.name,
        boardId: newBoard._id,
        order: col.order,
        jobApplications: [],
      })),
      { session },
    );

    newBoard.columns = columns.map((c) => c._id);
    await newBoard.save({ session });

    await session.commitTransaction();
    session.endSession();

    return newBoard;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error initializing user board:", error);
    throw error;
  }
}
