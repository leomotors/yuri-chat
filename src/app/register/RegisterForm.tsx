"use client";

import { FormEvent, ReactNode, startTransition, useActionState } from "react";

import { registerUser } from "./actions";
import {
  bufferToBase64,
  encryptWithPassword,
  generateKeyPair,
} from "@/lib/crypto";
import { localStoragePrivateKey } from "@/constants";

type Props = {
  className?: string;
  children: ReactNode;
};

export function RegisterForm({ className = "", children }: Props) {
  const [state, formAction] = useActionState(registerUser, { error: "" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password")?.toString();

    if (!password) {
      formAction(formData);
      return;
    }

    const { publicKey, privateKey } = await generateKeyPair();
    const publicKeyB64 = bufferToBase64(publicKey);
    const privateKeyB64 = bufferToBase64(privateKey);
    const { cipherText, iv, salt } = await encryptWithPassword(
      privateKeyB64,
      password,
    );

    formData.set("publicKey", publicKeyB64);
    formData.set("encryptedPrivateKey", `${cipherText};${iv};${salt}`);

    localStorage.setItem(localStoragePrivateKey, privateKeyB64);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {state.error && <p className="text-red-500">{state.error}</p>}

      {children}
    </form>
  );
}
