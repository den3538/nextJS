"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="flex flex-1 items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md mx-auto border-gray-200 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Create an account to start tracking your job applications and manage your career journey effectively.
                    </CardDescription>
                </CardHeader>
                <form className="space-y-4">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="Your full name" type="text" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" placeholder="Your email address" type="email" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" placeholder="Your password" type="password" required className="border-gray-300 focus:border-primary" minLength={8}/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full bg-primary text-white hover:bg-white hover:text-primary hover:border hover:border-primary">
                            Sign Up
                        </Button>
                        <p className="gap-x-10">Already have an account? <Link href="/sign-in" className="underline">Sign In</Link></p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}