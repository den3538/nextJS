"use client";

import { Board, Column } from "@/lib/models/models.types";
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
import { Button } from "./ui/button";
import { CreateJobApplicationDialog } from "./CreateJobApplicationDialog";

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
}

function DroppableColumn({ column, config, boardId }: DroppableColumnProps) {
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
      <CardContent className="p-4">
        {/* Render tasks here */}
        <CreateJobApplicationDialog colId={column._id} boardId={boardId} />
        <div className="space-y-2 pt-4 bg-gray-50/50 min-h-96 rounded-b-lg">
          Tasks will go here
        </div>
      </CardContent>
    </Card>
  );
}

export function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const columns = board.columns;
  console.log("Rendering KanbanBoard with columns:", columns);
  return (
    <div>
      <div>
        {columns.map((col, index) => {
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
            />
          );
        })}
      </div>
    </div>
  );
}
