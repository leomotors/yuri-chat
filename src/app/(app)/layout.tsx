import { ReactNode } from "react";

import { SocketProvider } from "@/context/SocketProvider";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return <SocketProvider>{children}</SocketProvider>;
}
