"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { SignInType } from "@/feature/auth/schema";

export const getPlayListDetails = async () => {
  try {
  } catch (error) {
    console.log({ error });
  }
};

export const createUser = async (value: SignInType) => {
  try {
    const [user] = await db
      .insert(users)
      .values({
        email: value.email,
        name: `${value.firstName} ${value.lastName}`,
        emailVerified: false,
        // image: value.,
      })
      .returning();

    if (!user) {
      throw new Error("User not created");
    }

    return user;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
