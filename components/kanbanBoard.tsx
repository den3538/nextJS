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
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";

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
  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
    data: {
      type: "column",
      columnId: column._id,
    },
  });

  const sortedJobs =
    column.jobApplications.sort((a, b) => a.order - b.order) ?? [];
  return (
    <Card className="p-0 rounded-b-lg mb-5 gap-0 min-w-75">
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
      <CardContent
        ref={setNodeRef}
        className={`p-4 space-y-4 ${isOver ? "ring-2 ring-primary" : ""}`}
      >
        <SortableContext
          items={sortedJobs.map((job) => job._id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedJobs.map((job) => (
            <SortableJobCard
              key={job._id}
              job={{ ...job, columnId: job.columnId ?? column._id }}
              columns={sortedColumns ?? []}
            />
          ))}
        </SortableContext>
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
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: job._id,
    data: {
      type: "job",
      job,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-md ">
      <JobApplicationCard
        job={job}
        columns={columns}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function KanbanBoard({ board }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { columns, moveJob, isPending } = useBoards(board);
  console.log("columns in kanban board:", columns);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const sortedColumns = [...(columns ?? [])].sort((a, b) => a.order - b.order);

  async function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (!over || !board._id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let draggedJob: JobApplication | null = null;
    let sourceColumn: Column | null = null;
    let sourceIndex = -1;

    for (const column of sortedColumns ?? []) {
      const jobs =
        column.jobApplications.sort((a, b) => a.order - b.order) ?? [];
      const jobIndex = jobs.findIndex((job) => job._id === activeId);

      if (jobIndex !== -1) {
        draggedJob = jobs[jobIndex];
        sourceColumn = column;
        sourceIndex = jobIndex;
        break;
      }
    }

    if (!draggedJob || !sourceColumn) return;

    // we check what is the target - a column or a job
    const targetColumn = sortedColumns.find((col) => col._id === overId);
    const targetJob = sortedColumns
      .flatMap((col) => col.jobApplications || [])
      .find((job) => job._id === overId);

    let targetColumnId: string;
    let newOrder: number;
    if (targetColumn) {
      targetColumnId = targetColumn._id;
      const jobsInTargetColumn =
        targetColumn.jobApplications
          .filter((j) => j._id !== activeId)
          .sort((a, b) => a.order - b.order) ?? [];

      newOrder = jobsInTargetColumn.length;
    } else {
      if (targetJob) {
        const targetJobColumn = sortedColumns.find((col) => {
          return col.jobApplications.some((j) => j._id === targetJob._id);
        });

        targetColumnId = targetJob.columnId ?? targetJobColumn?._id ?? "";
        if (!targetColumnId) return;

        const targetColumn = sortedColumns.find(
          (col) => col._id === targetColumnId,
        );

        if (!targetColumn) return;

        const allJobsInTargetColumn =
          targetColumn.jobApplications.sort((a, b) => a.order - b.order) ?? [];

        const allJobsInTargetColumnWithoutDragged =
          allJobsInTargetColumn.filter((j) => j._id !== activeId);

        const targetIndexInOriginal = allJobsInTargetColumn.findIndex(
          (j) => j._id === targetJob._id,
        );

        const targetIndexInFiltered =
          allJobsInTargetColumnWithoutDragged.findIndex(
            (j) => j._id === targetJob._id,
          );

        // isn't last item
        if (targetIndexInFiltered !== -1) {
          if (sourceColumn._id === targetColumnId) {
            if (sourceIndex < targetIndexInOriginal) {
              newOrder = targetIndexInFiltered + 1;
            } else {
              newOrder = targetIndexInFiltered;
            }
          } else {
            newOrder = targetIndexInFiltered;
          }
        } else {
          newOrder = allJobsInTargetColumnWithoutDragged.length;
        }
      } else {
        return;
      }

      if (!targetColumnId) return;

      await moveJob(activeId, targetColumnId, newOrder);
    }
  }

  const activeJob = useMemo<JobApplication | undefined>(() => {
    return sortedColumns
      .flatMap((col) => col.jobApplications || [])
      .find((job) => job._id === activeId);
  }, [activeId, sortedColumns]);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`${isPending ? "opacity-50" : ""} space-y-4`}>
        <div className="flex gap-4 overflow-x-auto pb-4 max-w-full px-2">
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
      <DragOverlay>
        {activeJob && (
          <div className=" opacity-50">
            <JobApplicationCard job={activeJob} columns={sortedColumns} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
