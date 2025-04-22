import fs from "fs";
import path from "path";

const stickersFolder = path.join(process.cwd(), "public", "stickers");
const soundbitesFolder = path.join(process.cwd(), "public", "soundbites");

const stickerFiles: string[] = fs.readdirSync(stickersFolder).filter((file) => file.endsWith(".png"));

const stickers = stickerFiles.map((file) => {
  const name = path.basename(file, ".png");

  const soundbitePath = path.join(soundbitesFolder, `${name}.mp3`);
  const soundbiteExists = fs.existsSync(soundbitePath);

  return {
    name,
    imageUrl: `/stickers/${file}`,
    soundbiteUrl: soundbiteExists ? `/soundbites/${name}.mp3` : undefined,
  };
});

const stickersFilePath = path.join(process.cwd(), "src", "constants", "stickers.ts");

const stickersFileContent = `export const stickers = ${JSON.stringify(stickers, null, 2)} as const;`;

fs.writeFileSync(stickersFilePath, stickersFileContent);
