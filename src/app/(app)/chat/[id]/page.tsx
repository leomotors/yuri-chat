import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Chat({ params }: Props) {
  const { id } = await params;

  const chatRoom = await prisma.chat.findUnique({
    where: {
      id,
    },
  });

  if (!chatRoom) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-text-primary text-2xl font-bold">{chatRoom.name}</h1>
      <p className="text-text-primary-light">Chat with {id}</p>
    </div>
  );
}
