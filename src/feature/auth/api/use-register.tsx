"use client";

import { useRef, useState } from "react";

import { toast } from "sonner";

import { signUp } from "@/lib/auth-client";

import { SignInType } from "../schema";

export const useRegister = () => {
  const toastId = useRef<string | number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (data: SignInType) => {
    try {
      const res = await signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        callbackURL: "/",
        fetchOptions: {
          onRequest: () => {
            setIsLoading(true);
            toastId.current = toast.loading("Validating your credentials...");
          },
          onResponse: () => {
            setIsLoading(false);
            toast.success("You have successfully registered!", {
              id: toastId.current,
            });
          },
          onError: (ctx) => {
            setIsLoading(false);
            toast.error(ctx.error.error, {
              id: toastId.current,
            });
            toast.error(ctx.error.message, {
              id: toastId.current,
            });
          },
        },
      });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  };

  return {
    register,
    isLoading,
  };
};
