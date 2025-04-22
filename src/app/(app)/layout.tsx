import { unauthorized } from "next/navigation";
import { ReactNode } from "react";

import { ServerProvider } from "@/context/ServerProvider";
import { SocketProvider } from "@/context/SocketProvider";
import { getUser } from "@/lib/auth";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
  const username = await getUser();

  if (!username) {
    unauthorized();
  }

  return (
    <ServerProvider username={username}>
      <SocketProvider>{children}</SocketProvider>
    </ServerProvider>
  );
}
