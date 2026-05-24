import { getServerSession } from "next-auth";

import { authOptions } from "./options";

export function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUserId() {
  const session = await getCurrentSession();

  return session?.user?.id ?? null;
}
