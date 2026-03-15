import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  company: string;
  position: string;
  location?: string;
  status: string;
  boardId: mongoose.Types.ObjectId;
  columnId: mongoose.Types.ObjectId;
  userId: string;
  order: number;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  appliedDate?: Date;
  tags?: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema: Schema = new Schema<IJobApplication>(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String },
    status: { type: String, required: true },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    columnId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Column",
      index: true,
    },
    userId: { type: String, required: true },
    order: { type: Number, required: true },
    notes: { type: String },
    salary: { type: String },
    jobUrl: { type: String },
    appliedDate: { type: Date },
    tags: [{ type: String }],
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

export const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);

export default JobApplication;
