import { SocketProvider } from "@/context/SocketProvider";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return <SocketProvider>{children}</SocketProvider>;
}
