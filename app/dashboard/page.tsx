import { KanbanBoard } from "@/components/kanbanBoard";
import { DEFAULT_BOARD_NAME } from "@/constants/constants";
import { getSession } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export async function getBoard(userId: string) {
  "use cache";
  await dbConnect();

  const boardDoc = await Board.findOne({
    userId: userId,
    name: DEFAULT_BOARD_NAME,
  }).populate({
    path: "columns",
    populate: {
      path: "jobApplications",
    },
  });

  if (!boardDoc) {
    return null;
  }

  return JSON.parse(JSON.stringify(boardDoc));
}

function DashboardPageSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <p className="text-gray-500">Loading your dashboard...</p>
    </div>
  );
}

async function Dashboard() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const board = await getBoard(session.user.id);

  if (!board) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-gray-500">
          Oops...Looks like you don&apos;t have any board
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <div className="container mx-auto p-6 max-w-9xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">{board.name}</h1>
          <p className="text-muted-foreground">
            Track your job applications and progress here.
          </p>
        </div>
        <KanbanBoard
          board={JSON.parse(JSON.stringify(board))}
          userId={session.user.id}
        />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
