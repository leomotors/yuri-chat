import { bufferToBase64, base64ToBuffer } from "./utils";

export async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  return {
    publicKey: await crypto.subtle.exportKey("spki", keyPair.publicKey),
    privateKey: await crypto.subtle.exportKey("pkcs8", keyPair.privateKey),
  };
}

export async function importPublicKey(spki: ArrayBuffer) {
  return crypto.subtle.importKey(
    "spki",
    spki,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"],
  );
}

export async function importPrivateKey(pkcs8: ArrayBuffer) {
  return crypto.subtle.importKey(
    "pkcs8",
    pkcs8,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"],
  );
}

export async function encryptWithPublicKey(publicKey: CryptoKey, text: string) {
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    enc.encode(text),
  );
  return bufferToBase64(encrypted);
}

export async function decryptWithPrivateKey(
  privateKey: CryptoKey,
  base64CipherText: string,
) {
  const encrypted = base64ToBuffer(base64CipherText);
  const decrypted = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encrypted,
  );
  return new TextDecoder().decode(decrypted);
}
