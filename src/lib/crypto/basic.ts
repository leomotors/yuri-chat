import { bufferToBase64, base64ToBuffer } from "./utils";

async function getKeyFromPassword(password: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptWithPassword(text: string, password: string) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await getKeyFromPassword(password, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(text),
  );
  return {
    cipherText: bufferToBase64(encrypted),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
  };
}

export async function decryptWithPassword(
  cipherText: string,
  password: string,
  ivB64: string,
  saltB64: string,
) {
  const dec = new TextDecoder();
  const iv = base64ToBuffer(ivB64);
  const salt = base64ToBuffer(saltB64);
  const encryptedData = base64ToBuffer(cipherText);
  const key = await getKeyFromPassword(password, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData,
  );
  return dec.decode(decrypted);
}
