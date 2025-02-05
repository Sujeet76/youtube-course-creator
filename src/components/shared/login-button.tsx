"use client";

import React, { PropsWithChildren } from "react";

import { LogInIcon } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

import { cn } from "@/lib/utils";

import { Button, ButtonVariants } from "../ui/button";

interface LoginButtonProps extends ButtonVariants, PropsWithChildren {
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  className,
  ...props
}) => {
  const [_, setIsLoginDialogOpen] = useQueryState(
    "login-dialog",
    parseAsBoolean.withDefault(false)
  );

  return (
    <Button
      className={cn("justify-start gap-1.5", className)}
      onClick={() => setIsLoginDialogOpen((prev) => !prev)}
      size={"sm"}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          <LogInIcon size={16} strokeWidth={2} className="opacity-80" />
          Login
        </>
      )}
    </Button>
  );
};

export default LoginButton;
