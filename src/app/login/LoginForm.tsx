"use client";

import { ReactNode, useActionState } from "react";
import { loginUser } from "./actions";

type Props = {
  className?: string;
  children: ReactNode;
};

export function LoginForm({ className = "", children }: Props) {
  const [state, formAction] = useActionState(loginUser, { error: "" });

  return (
    <form action={formAction} className={className}>
      {state.error && <p className="text-red-500">{state.error}</p>}

      {children}
    </form>
  );
}
