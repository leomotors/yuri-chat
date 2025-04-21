import { twMerge } from "tailwind-merge";

import DuoMascot from "@/components/DuoMascot";
import FallingFlowers from "@/components/FallingFlowers";
import { limits } from "@/constants";
import styles from "@/styles/form.module.scss";

import { RegisterForm } from "./RegisterForm";

export default function Register() {
  return (
    <div className="flex flex-grow items-center justify-center px-4">
      <FallingFlowers />

      <main className="bg-foreground flex flex-col items-center justify-center gap-6 rounded-xl p-12 shadow-lg">
        <h1 className="text-text-primary text-2xl font-bold">Register</h1>

        <DuoMascot />

        <RegisterForm
          className={twMerge(styles.form, "text-text-primary-light")}
        >
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
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              minLength={limits.name.min}
              maxLength={limits.name.max}
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

          <div>
            <label htmlFor="profilePicture">Upload your Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              required
            />
          </div>

          <button type="submit">Register</button>
        </RegisterForm>
      </main>
    </div>
  );
}
