"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  PenIcon,
  Trash,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CreateJobApplicationDialog } from "./CreateJobApplicationDialog";
import JobApplicationCard from "./JobApplicationCard";
import { useBoards } from "@/lib/hooks/useBoards";

interface KanbanBoardProps {
  board: Board;
  userId?: string;
}

const COLUMN_CONFIG: { color: string; icon: React.ReactNode }[] = [
  {
    color: "bg-whish",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-chart-4",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-muted-foreground",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-success",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-destructive",
    icon: <XCircle className="h-4 w-4" />,
  },
];

interface ColumnConfig {
  color: string;
  icon: React.ReactNode;
}

interface DroppableColumnProps {
  column: Column;
  config: ColumnConfig;
  boardId: string;
  sortedColumns?: Column[];
}

function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: DroppableColumnProps) {
  const sortedJobs =
    column.jobApplications.sort((a, b) => a.order - b.order) ?? [];
  return (
    <Card className="p-0 rounded-b-lg mb-5 gap-0">
      <CardHeader
        className={`flex justify-between gap-2 items-center ${config.color} py-2 px-4 `}
      >
        <div className="flex items-center gap-2">
          <span>{config.icon}</span>
          <span>{column.name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none data-[state=open]:bg-muted hover:bg-muted hover:cursor-pointer rounded-md p-2">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem>
              <PenIcon />
              Edit Column
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash />
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {sortedJobs.map((job) => (
          <SortableJobCard
            key={job._id}
            job={{ ...job, columnId: job.columnId ?? column._id }}
            columns={sortedColumns ?? []}
          />
        ))}
        <CreateJobApplicationDialog colId={column._id} boardId={boardId} />
      </CardContent>
    </Card>
  );
}

function SortableJobCard({
  job,
  columns,
}: {
  job: JobApplication;
  columns: Column[];
}) {
  return (
    <div className="bg-white rounded-md ">
      <JobApplicationCard job={job} columns={columns} />
    </div>
  );
}

export function KanbanBoard({ board }: KanbanBoardProps) {
  const { columns, moveJob } = useBoards(board);
  console.log("columns in kanban board:", columns);

  const sortedColumns = [...(columns ?? [])].sort((a, b) => a.order - b.order);
  return (
    <div>
      <div>
        {sortedColumns.map((col, index) => {
          const config = COLUMN_CONFIG[index] ?? {
            name: col.name,
            color: "bg-muted-foreground",
            icon: <Calendar className="h-4 w-4" />,
          };
          return (
            <DroppableColumn
              key={index}
              column={col}
              config={config}
              boardId={board._id}
              sortedColumns={sortedColumns}
            />
          );
        })}
      </div>
    </div>
  );
}
