"use client";

import { useActionState } from "react";
import { twMerge } from "tailwind-merge";

import { useServerContext } from "@/context/serverContext";
import { useSocket } from "@/context/socketContext";
import { getURLFromKey } from "@/lib/s3client";
import buttonStyles from "@/styles/button.module.css";
import formStyles from "@/styles/form.module.css";

import { createGroup } from "./actions";

export function GroupChat() {
  const { username } = useServerContext();
  const { allGroupChats } = useSocket();

  const [newGcState, newGcAction] = useActionState(createGroup, { error: "" });

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-text-primary text-lg font-semibold">Group Chats</h2>
      <ul className="flex w-full flex-col gap-2">
        {allGroupChats.map((groupChat) => (
          <li
            key={groupChat.id}
            className="bg-foreground text-text-primary-light flex w-full flex-col items-center rounded-lg p-4"
          >
            <div className="flex w-full justify-between gap-2">
              <p>{groupChat.name}</p>
              <p>{groupChat.chatMemberships.length} members</p>
            </div>

            <div className="flex w-full justify-between gap-2">
              <div>
                {groupChat.chatMemberships.map((member) => (
                  <img
                    key={member.user.username}
                    src={getURLFromKey(member.user.profilePicture)}
                    alt="pfp"
                    className="h-8 w-8 rounded-full"
                  />
                ))}
              </div>

              <button className={buttonStyles.smallButton}>
                {groupChat.chatMemberships.some(
                  (member) => member.user.username === username,
                )
                  ? "Chat"
                  : "Join"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-foreground rounded-xl p-4 text-center">
        <h2 className="text-text-primary text-lg font-semibold">
          Create new Group
        </h2>

        {newGcState.error && <p className="text-red-500">{newGcState.error}</p>}

        <form
          action={newGcAction}
          className={twMerge(formStyles.form, "text-text-primary-light")}
        >
          <div>
            <label htmlFor="groupName">Group Name</label>
            <input
              type="text"
              name="groupName"
              id="groupName"
              placeholder="Enter Name"
              required
            />
          </div>

          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}
