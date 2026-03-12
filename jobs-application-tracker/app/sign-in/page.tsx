"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const request = await signIn.email({
        email,
        password,
      });

      if (request.error) {
        setError(
          request.error.message || "Failed to sign in. Please try again.",
        );
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-1 items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md mx-auto border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black">
            Sign In
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your account to continue tracking your job applications
            and managing your career journey effectively.
          </CardDescription>
        </CardHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <p role="alert">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Your email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Your password"
                type="password"
                required
                className="border-gray-300 focus:border-primary"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-primary text-white hover:bg-white hover:text-primary hover:border hover:border-primary"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <p className="gap-x-10">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
