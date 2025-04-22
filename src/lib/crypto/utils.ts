export function bufferToBase64(buf: Uint8Array<ArrayBuffer> | ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export function base64ToBuffer(base64: string) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}
