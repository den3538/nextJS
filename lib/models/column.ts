import mongoose, { Schema, Document } from "mongoose";

export interface iColumn extends Document {
  name: string;
  boardId: mongoose.Types.ObjectId;
  columns: number;
  jobApplications: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema: Schema = new Schema<iColumn>(
  {
    name: { type: String, required: true },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    columns: { type: Number, required: true },
    jobApplications: [{ type: Schema.Types.ObjectId, ref: "JobApplication" }],
  },
  {
    timestamps: true,
  },
);

export const Column =
  mongoose.models.Column || mongoose.model<iColumn>("Column", ColumnSchema);
