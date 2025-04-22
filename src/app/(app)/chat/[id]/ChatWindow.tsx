"use client";

import { BadgeCheck, ImagePlay, Sticker, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { eventNames, localStoragePrivateKey } from "@/constants";
import { stickers } from "@/constants/stickers";
import { useServerContext } from "@/context/serverContext";
import { useSocket } from "@/context/socketContext";
import {
  base64ToBuffer,
  decryptWithPrivateKey,
  encryptWithPublicKey,
  importPrivateKey,
  importPublicKey,
} from "@/lib/crypto";
import { getURLFromKey } from "@/lib/s3client";
import btnStyles from "@/styles/button.module.css";
import styles from "@/styles/form.module.css";
import {
  ClientSendMessage,
  MessageWithEncryptionStatus,
  MessageWithSender,
  PublicGroupChat,
} from "@/types";

type Props = {
  roomId: string;
  initialMessages: MessageWithSender[];
  chatRoom: PublicGroupChat;
};

export function ChatWindow({ roomId, initialMessages, chatRoom }: Props) {
  const { username } = useServerContext();
  const { socket } = useSocket();
  const [privateKey, setPrivateKey] = useState<string>();
  const [messages, setMessages] = useState<MessageWithEncryptionStatus[]>();

  const [init, setInit] = useState(false);

  const [importedPrivateKey, setImportedPrivateKey] = useState<CryptoKey>();

  const [isStickerPopupVisible, setStickerPopupVisible] = useState(false);

  useEffect(() => {
    setPrivateKey(localStorage.getItem(localStoragePrivateKey) || undefined);
  }, []);

  useEffect(() => {
    async function importKey() {
      if (!privateKey) return;

      const imported = await importPrivateKey(
        base64ToBuffer(privateKey).buffer,
      );

      setImportedPrivateKey(imported);
    }

    importKey();
  }, [privateKey]);

  async function decryptMessages(message: MessageWithSender[]) {
    if (chatRoom.isGroupChat)
      return message.map((msg) => ({
        ...msg,
        encrypted: false,
        failure: false,
      }));

    return await Promise.all(
      message.map(async (msg) => {
        // todo handle this :skull:
        if (msg.contentType !== "TEXT" || !msg.content.startsWith("{")) {
          return {
            ...msg,
            encrypted: false,
            failure: false,
          };
        }

        const content = JSON.parse(msg.content) as Record<string, string>;

        if (!importedPrivateKey || !content[username]) {
          return {
            ...msg,
            content: "Failed to decrypt message",
            encrypted: true,
            failure: true,
          };
        }

        const decrypted = await decryptWithPrivateKey(
          importedPrivateKey,
          content[username],
        );

        return {
          ...msg,
          content: decrypted,
          encrypted: true,
          failure: false,
        };
      }),
    );
  }

  useEffect(() => {
    if (!importedPrivateKey) return;
    if (init) return;

    async function initMessages() {
      const decryptedMessages = await decryptMessages(initialMessages);
      setMessages(decryptedMessages);
      setInit(true);
    }

    initMessages();
  }, [init, importedPrivateKey]);

  useEffect(() => {
    if (!socket) return;

    const listener = async (message: MessageWithSender) => {
      if (message.chatId !== roomId) return;

      const decrypted = (await decryptMessages([message]))[0];

      if (decrypted.contentType === "STICKER") {
        const content = JSON.parse(decrypted.content) as {
          imageUrl: string;
          soundbiteUrl: string | null;
        };

        if (content.soundbiteUrl) {
          const audio = new Audio(content.soundbiteUrl);
          audio.play().catch((err) => {
            console.error("Error playing soundbite:", err);
          });
        }
      }

      setMessages((prev) => [...(prev || []), decrypted]);
    };

    socket.on(eventNames.newMessage, listener);

    return () => {
      socket.off(eventNames.newMessage, listener);
    };
  });

  useEffect(() => {
    const ele = document.getElementById("chatWindow");
    if (!ele) return;
    ele.scrollTop = ele.scrollHeight;
  }, [messages]);

  const [inputMsg, setInputMsg] = useState("");

  async function encryptMessage(message: string) {
    if (chatRoom.isGroupChat) return message;

    const totalContent = {} as Record<string, string>;

    for (const membership of chatRoom.chatMemberships.map((m) => m.user)) {
      const importedPub = await importPublicKey(
        base64ToBuffer(membership.publicKey).buffer,
      );
      const encrypted = await encryptWithPublicKey(importedPub, message);
      totalContent[membership.username] = encrypted;
    }

    return JSON.stringify(totalContent);
  }

  async function handleSendMessage() {
    if (!inputMsg) return;

    socket?.emit(eventNames.sendMessage, {
      content: await encryptMessage(inputMsg),
      messageType: "TEXT",
      roomId,
    } satisfies ClientSendMessage);

    setInputMsg("");
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  function imageButtonClick() {
    if (!fileInputRef.current) return;

    fileInputRef.current.click();
  }

  async function handleFileInput() {
    const file = fileInputRef.current?.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", roomId);
    formData.append("type", file.type);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error(`Error uploading file: ${await res.text()}`);
      return;
    }

    const key = await res.text();

    socket?.emit(eventNames.sendMessage, {
      content: key,
      messageType: "MEDIA",
      roomId,
    } satisfies ClientSendMessage);
  }

  async function handleStickerClick(sticker: (typeof stickers)[number]) {
    const content = {
      imageUrl: sticker.imageUrl,
      soundbiteUrl: sticker.soundbiteUrl || null,
    };

    socket?.emit(eventNames.sendMessage, {
      content: JSON.stringify(content),
      messageType: "STICKER",
      roomId,
    } satisfies ClientSendMessage);

    setStickerPopupVisible(false);
  }

  const toggleStickerPopup = () => {
    setStickerPopupVisible((prev) => !prev);
  };

  return (
    <main className="bg-foreground flex h-[calc(1vh)] flex-grow flex-col justify-between rounded-lg p-4 shadow-lg">
      {/* Messages */}
      <div className="flex flex-col gap-4 overflow-y-auto py-2">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={twMerge(
              "flex items-center gap-2",
              message.sender.username === username
                ? "flex-row-reverse items-end"
                : "flex-row items-start",
            )}
          >
            <img
              src={getURLFromKey(message.sender.profilePicture)}
              alt="pfp"
              className="h-16 w-16 rounded-full"
            />

            <div>
              <p
                className={twMerge(
                  "text-text-primary flex items-center gap-1 text-sm",
                  message.sender.username === username
                    ? "justify-end"
                    : "justify-start",
                )}
              >
                <span>{message.sender.name}</span>
                {message.encrypted && !message.failure && (
                  <BadgeCheck className="h-4 w-4" />
                )}
              </p>
              <p
                className={twMerge(
                  "text-text-primary-light rounded-lg bg-white p-2 shadow-md",
                  message.sender.username === username
                    ? "rounded-br-none text-end"
                    : "rounded-bl-none text-start",
                  message.failure && "text-red-500",
                )}
              >
                {message.contentType === "TEXT" ? (
                  message.content
                ) : message.contentType === "MEDIA" ? (
                  <img
                    src={getURLFromKey(message.content)}
                    alt="something"
                    className="max-w-md"
                  />
                ) : message.contentType === "STICKER" ? (
                  <img
                    src={JSON.parse(message.content).imageUrl}
                    alt="sticker"
                    className={twMerge(
                      "max-w-md",
                      JSON.parse(message.content).soundbiteUrl
                        ? "cursor-pointer"
                        : "pointer-events-none",
                    )}
                    onClick={() => {
                      const content = JSON.parse(message.content);
                      if (content.soundbiteUrl) {
                        const audio = new Audio(content.soundbiteUrl);
                        audio.play().catch((err) => {
                          console.error("Error playing soundbite:", err);
                        });
                      }
                    }}
                  />
                ) : (
                  "Unsupported"
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/*Input Section*/}
      <div className="flex gap-4 pt-4">
        <button className={btnStyles.smallButton} onClick={imageButtonClick}>
          <ImagePlay />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInput}
        />

        <button
          className={twMerge(btnStyles.smallButton, "relative")}
          onClick={toggleStickerPopup}
        >
          <Sticker />

          {/* Stickers Popup */}
          {isStickerPopupVisible && (
            <div className="absolute right-0 bottom-16 left-0 z-50 mx-auto max-h-64 w-128 overflow-y-scroll rounded-lg bg-white p-4 shadow-lg">
              <div className="grid grid-cols-12 gap-2">
                {stickers.map((sticker) => (
                  <div key={sticker.name} className="relative">
                    {/* Sticker Image */}
                    <img
                      src={sticker.imageUrl}
                      alt={sticker.name}
                      title={sticker.name}
                      className="h-16 w-16 cursor-pointer object-contain"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStickerClick(sticker);
                      }}
                    />

                    {/* Volume Icon */}
                    {sticker.soundbiteUrl && (
                      <Volume2 className="absolute top-0 right-2 h-4 w-4 text-black" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </button>

        <form
          className="flex h-fit flex-grow gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            className={twMerge(styles.input, "flex-grow")}
            placeholder="Type your Message"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <button className={btnStyles.smallButton} onClick={handleSendMessage}>
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
