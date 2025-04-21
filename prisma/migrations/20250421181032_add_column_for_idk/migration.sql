-- AlterTable
ALTER TABLE "chat" ADD COLUMN     "last_message_sent" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "chat_membership" ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
