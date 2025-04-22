import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authCookieName } from "@/constants";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete(authCookieName);

  redirect("/");
}
