"use client";

import React from "react";

import { LogInIcon } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

import { Button } from "../ui/button";

const LoginDialogTrigger: React.FC = () => {
  const [_, setIsLoginDialogOpen] = useQueryState(
    "login-dialog",
    parseAsBoolean.withDefault(false)
  );

  return (
    <Button
      className="justify-start gap-1.5"
      onClick={() => setIsLoginDialogOpen((prev) => !prev)}
      size={"sm"}
    >
      <LogInIcon size={16} strokeWidth={2} className="opacity-80" />
      Login
    </Button>
  );
};

export default LoginDialogTrigger;
