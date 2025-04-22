import { ReactNode } from "react";

import { ChatSidebar } from "./Sidebar";

type Props = {
  children: ReactNode;
};

export default async function ChatLayout({ children }: Props) {
  return (
    <div className="flex flex-grow">
      <ChatSidebar />

      <div className="flex-grow">{children}</div>
    </div>
  );
}
