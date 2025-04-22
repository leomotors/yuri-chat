import fs from "fs";
import path from "path";

const stickersFolder = path.join(process.cwd(), "public", "stickers");
const soundbitesFolder = path.join(process.cwd(), "public", "soundbites");

const imageExtensions = [".png", ".jpg", ".jpeg", ".gif"];
const soundbiteExtensions = [".mp3", ".wav", ".ogg"];

const stickerFiles: string[] = fs
  .readdirSync(stickersFolder)
  .filter((file) => imageExtensions.some((ext) => file.endsWith(ext)));

const stickers = stickerFiles.map((file) => {
  const name = path.basename(file, path.extname(file));

  const soundbiteFile = soundbiteExtensions
    .map((ext) => path.join(soundbitesFolder, `${name}${ext}`))
    .find((filePath) => fs.existsSync(filePath));

  return {
    name,
    imageUrl: `/stickers/${file}`,
    soundbiteUrl: soundbiteFile
      ? `/soundbites/${path.basename(soundbiteFile)}`
      : undefined,
  };
});

const stickersFilePath = path.join(
  process.cwd(),
  "src",
  "constants",
  "stickers.ts",
);

const stickersFileContent = `export const stickers = ${JSON.stringify(stickers, null, 2)} as const;`;

fs.writeFileSync(stickersFilePath, stickersFileContent);
