"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { SignOutButton } from "./sign-out-button";
import { useSession } from "@/lib/auth/auth-client";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="bg-white p-4 shadow border-2 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-5">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div>
                <Briefcase className="h-6 w-6 mr-2 text-gray-800" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Job Tracker</h1>
            </Link>
          </div>
          <div className="flex items-center justify-between space-x-4 flex-1">
            <div className="flex gap-2">
              {session?.user && (
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Dashboard
                </Link>
              )}
            </div>
            <div className="flex gap-2">
              {session?.user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="hover:cursor-pointer"
                    >
                      <Avatar>
                        <AvatarFallback className="text-gray-800 rounded-full data-open:bg-primary data-open:text-white">
                          {session.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      sideOffset={10}
                      align="center"
                      className="bg-white border rounded-md shadow-lg p-2 w-auto max-w-auto"
                    >
                      <DropdownMenuLabel className="truncate">
                        {session.user.email}
                      </DropdownMenuLabel>
                      <DropdownMenuItem className="justify-center">
                        <SignOutButton />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button className="text-white" variant={"default"}>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button className="text-white" variant={"default"}>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
