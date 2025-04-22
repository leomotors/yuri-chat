"use client";

import { BadgeCheck, ImagePlay, Sticker } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { eventNames, localStoragePrivateKey } from "@/constants";
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
import { stickers } from "@/constants/stickers";

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

  async function handleStickerClick(sticker: typeof stickers[number]) {
    if (sticker.soundbiteUrl) {
      const audio = new Audio(sticker.soundbiteUrl);
      audio.play().catch((err) => {
        console.error("Error playing soundbite:", err);
      });
    }
    
    const content = {
      imageUrl: sticker.imageUrl,
      soundbiteUrl: sticker.soundbiteUrl || null
    };

    socket?.emit(eventNames.sendMessage, {
      content: JSON.stringify(content),
      messageType: "STICKER",
      roomId,
    } satisfies ClientSendMessage);

    setStickerPopupVisible(false);
  };

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
                    className="max-w-lg"
                  />
                ): message.contentType === "STICKER" ? (
                  <img
                    src={JSON.parse(message.content).imageUrl}
                    alt="sticker"
                    className="w-24 h-24"
                  />
                ) : (
                  "Unsupported"
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Stickers Popup */}
      {isStickerPopupVisible && (
      <div className="absolute bottom-16 left-0 right-0 mx-auto w-64 bg-white shadow-lg rounded-lg p-4 z-50">
        <div className="grid grid-cols-6 gap-2">
          {stickers.map((sticker) => (
            <div key={sticker.name} className="relative">
              {/* Sticker Image */}
              <img
                src={sticker.imageUrl}
                alt={sticker.name}
                title={sticker.name}
                className="cursor-pointer w-16 h-16 object-contain"
                onClick={() => handleStickerClick(sticker)}
              />

              {/* Volume Icon */}
              {sticker.soundbiteUrl && (
                <div className="absolute top-0 right-0 bg-black bg-opacity-50 rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5l-6 6m0 0l6 6m-6-6h12"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

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

        <button className={btnStyles.smallButton} onClick={toggleStickerPopup}>
          <Sticker />
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
