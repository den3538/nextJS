import { KanbanBoard } from "@/components/kanbanBoard";
import { DEFAULT_BOARD_NAME } from "@/constants/constants";
import { getSession } from "@/lib/auth/auth";
import { dbConnect } from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  await dbConnect();

  const board = await Board.findOne({
    userId: session.user.id,
    name: DEFAULT_BOARD_NAME,
  });

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
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">{board.name}</h1>
          <p className="text-muted-foreground">
            Track your job applications and progress here.
          </p>
        </div>
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  );
}
