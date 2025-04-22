export const limits = {
  username: {
    min: 3,
    max: 16,
  },
  password: {
    min: 6,
    max: 64,
  },
  name: {
    min: 3,
    max: 32,
  },
} as const satisfies Record<string, { min: number; max: number }>;

export const authCookieName = "yuri-token";
export const pfpFolderName = "profilePictures";
export const chatImagesFolderName = "chatImages";
export const localStoragePrivateKey = "privateKey";

export const eventNames = {
  allUsers: "allUsers",
  allGroupChats: "allGroupChats",
  requestRefreshGroupChats: "requestRefreshGroupChats",
  sendMessage: "sendMessage",
  newMessage: "newMessage",
} as const satisfies Record<string, string>;
