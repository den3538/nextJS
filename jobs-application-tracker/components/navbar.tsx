import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
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
                    <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
                </div>
                <div className="flex gap-2">
                    <Button className="text-white" variant={"default"}>
                        <Link href="/sign-in" >Sign In</Link>
                    </Button>
                    <Button className="text-white" variant={"default"}>
                        <Link href="/sign-up" >Sign Up</Link>
                    </Button>
                </div>
            </div>        
        </div>
      </div>
    </nav>
  );
}

export default Navbar;