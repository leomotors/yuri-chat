import os
import json

stickers_folder = os.path.join(os.getcwd(), "public", "stickers")
soundbites_folder = os.path.join(os.getcwd(), "public", "soundbites")

image_extensions = [".png", ".jpg", ".jpeg", ".gif"]
soundbite_extensions = [".mp3", ".wav", ".ogg"]

sticker_files = [f for f in os.listdir(stickers_folder) if any(
    f.endswith(ext) for ext in image_extensions)]

sticker_files.sort()

stickers = []

for file in sticker_files:
    name = os.path.splitext(file)[0]

    soundbite_file = next((os.path.join(soundbites_folder, f"{name}{ext}") for ext in soundbite_extensions if os.path.exists(
        os.path.join(soundbites_folder, f"{name}{ext}"))), None)

    sticker = {
        "name": name,
        "imageUrl": f"/stickers/{file}",
        "soundbiteUrl": f"/soundbites/{os.path.basename(soundbite_file)}" if soundbite_file else None,
    }

    stickers.append(sticker)

stickers_file_path = os.path.join(
    os.getcwd(), "src", "constants", "stickers.ts")

stickers_file_content = f"export const stickers = {json.dumps(stickers, indent=2)} as const;"

with open(stickers_file_path, "w") as f:
    f.write(stickers_file_content)

print("Sticker data has been generated and saved to stickers.ts.")
