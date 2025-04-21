import Link from "next/link";
import { twMerge } from "tailwind-merge";

import DuoMascot from "@/components/DuoMascot";
import FallingFlowers from "@/components/FallingFlowers";
import { limits } from "@/constants";
import styles from "@/styles/form.module.scss";

import { LoginForm } from "./LoginForm";

export default function Home() {
  return (
    <div className="flex flex-grow items-center justify-center px-4">
      <FallingFlowers />

      <main className="bg-foreground flex flex-col items-center justify-center gap-6 rounded-xl p-12 shadow-lg">
        <h1 className="text-text-primary text-2xl font-bold">
          Welcome to Yuri Chat
        </h1>

        <DuoMascot />

        <p className="text-text-primary-light text-xl">Please Login</p>

        <LoginForm className={twMerge(styles.form, "text-text-primary-light")}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              minLength={limits.username.min}
              maxLength={limits.username.max}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              minLength={limits.password.min}
              maxLength={limits.password.max}
              required
            />
          </div>

          <button type="submit">Login</button>
        </LoginForm>

        <p className="text-text-primary-light">
          {"Don't have an account? "}
          <Link
            href="/register"
            className="text-text-primary hover:text-text-primary/60 transition-colors"
          >
            Register
          </Link>
        </p>
      </main>
    </div>
  );
}
