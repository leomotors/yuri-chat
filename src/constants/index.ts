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

export const pfpBucketName = "profilePictures";
