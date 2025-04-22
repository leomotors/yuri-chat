import { ReactNode } from "react";

import { SocketProvider } from "@/context/SocketProvider";
import { getUser } from "@/lib/auth";
import { unauthorized } from "next/navigation";
import { ServerProvider } from "@/context/ServerProvider";

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
