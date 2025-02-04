"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const getUserSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("user is not logged in");

    return session;
  } catch (error) {
    throw error;
  }
};
