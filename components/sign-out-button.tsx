import { signOut } from "@/lib/auth/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const res = await signOut();
    if (res.data?.success) {
      return router.push("/sign-in");
    }
    // imagine it's sentry or other logging service
    console.error("Failed to sign out:", res.error);
  };

  return (
    <Button variant={"link"} onClick={handleSignOut}>
      Log out
    </Button>
  );
}
