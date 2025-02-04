"use server";

import { headers } from "next/headers";

import { eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { auth } from "@/lib/auth";

export const getCurrentUserDB = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("user is not logged in");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .execute();

  if (!user) throw new Error("user not found");

  return user;
};
