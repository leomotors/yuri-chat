"use client";

import {
  FormEvent,
  ReactNode,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";

import { loginUser } from "./actions";
import { decryptWithPassword } from "@/lib/crypto";
import { localStoragePrivateKey } from "@/constants";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  children: ReactNode;
};

export function LoginForm({ className = "", children }: Props) {
  const [state, formAction] = useActionState(loginUser, { error: "" });
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function decryptKey(encryptedPrivateKey: string, password: string) {
    const [cipherText, iv, salt] = encryptedPrivateKey.split(";");

    const decryptedPrivateKey = await decryptWithPassword(
      cipherText,
      password,
      iv,
      salt,
    );

    if (decryptedPrivateKey) {
      localStorage.setItem(localStoragePrivateKey, decryptedPrivateKey);
    }

    router.replace("/home");
  }

  useEffect(() => {
    if (state.encryptedPrivateKey && password) {
      decryptKey(state.encryptedPrivateKey, password);
    }
  }, [state.encryptedPrivateKey, password]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password")?.toString();

    if (!password) {
      formAction(formData);
      return;
    }

    startTransition(() => {
      setPassword(password);
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
