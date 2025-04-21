"use client";

import { ReactNode, useActionState } from "react";
import { registerUser } from "./actions";

type Props = {
  className?: string;
  children: ReactNode;
};

export function RegisterForm({ className = "", children }: Props) {
  const [state, formAction] = useActionState(registerUser, { error: "" });

  return (
    <form action={formAction} className={className}>
      {state.error && <p className="text-red-500">{state.error}</p>}

      {children}
    </form>
  );
}
