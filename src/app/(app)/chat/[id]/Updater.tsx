"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { eventNames } from "@/constants";
import { useServerContext } from "@/context/serverContext";
import { useSocket } from "@/context/socketContext";

export function Updater() {
  const pathname = usePathname();
  const { allGroupChats, socket } = useSocket();
  const { username } = useServerContext();

  useEffect(() => {
    if (pathname.includes("/chat/")) {
      const currentChatId = pathname.split("/chat/").at(-1)!;

      const gc = allGroupChats.find((gc) => gc.id === currentChatId);

      if (
        gc &&
        gc.chatMemberships.some((cm) => cm.user.username === username)
      ) {
        return;
      }

      // Not in group, request server to update
      socket?.emit(eventNames.requestRefreshGroupChats);
    }
  }, [pathname, allGroupChats]);

  return <></>;
}
