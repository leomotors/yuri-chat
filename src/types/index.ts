import { User } from "@prisma/client";

export type PublicUser = Pick<User, "username" | "name" | "profilePicture">;
