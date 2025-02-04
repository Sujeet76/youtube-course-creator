"use client";

import { useCallback } from "react";

import { parseAsBoolean, useQueryState } from "nuqs";

import GithubIcon from "@/assets/icons/github.icon";
import GoogleIcon from "@/assets/icons/google.icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signIn } from "@/lib/auth-client";

interface SignInDialogProps {
  showTrigger?: boolean;
}

const SignInDialog = ({ showTrigger }: SignInDialogProps) => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useQueryState(
    "login-dialog",
    parseAsBoolean.withDefault(false)
  );

  const handelOpenChange = useCallback(() => {
    setIsLoginDialogOpen((prev) => !prev);
  }, [setIsLoginDialogOpen]);

  const handleLogin = useCallback(async (provider: "google" | "github") => {
    await signIn.social({
      provider,
      callbackURL: "/",
    });
  }, []);

  return (
    <Dialog open={isLoginDialogOpen} onOpenChange={handelOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline">Sign in</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login/signup to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Button onClick={() => handleLogin("google")} variant="outline">
          <GoogleIcon />
          Login with Google
        </Button>
        <Button variant="outline" onClick={() => handleLogin("github")}>
          <GithubIcon />
          Login with Github
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
