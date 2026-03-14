import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

const sessionGuardedPaths = ["/api/"];
const authPaths = ["/api/auth"];

export default async function proxy(request: NextRequest) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname;

  const isGuardedPath = sessionGuardedPaths.some(
    (path) =>
      pathname.startsWith(path) &&
      !authPaths.some((authPath) => pathname.startsWith(authPath)),
  );
  if (isGuardedPath && !session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const publicPaths = ["/sign-in", "/sign-up"];
  if (session?.user && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
