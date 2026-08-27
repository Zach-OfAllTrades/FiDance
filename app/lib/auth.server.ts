import type { User } from "@prisma/client";
import { prisma } from "~/db.server";

/**
 * Returns the single user row, or null if the database hasn't been seeded yet.
 */
export function getUser(): Promise<User | null> {
  return prisma.user.findFirst();
}

/**
 * Returns the single user row, throwing a 500 if it's missing (the app has no
 * real auth yet — every loader/action scopes queries to this one user).
 */
export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) {
    throw new Response("No user found — run `npm run db:seed`.", { status: 500 });
  }
  return user;
}
