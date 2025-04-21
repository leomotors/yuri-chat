import { limits } from "@/constants";
import styles from "@/styles/form.module.scss";
import { RegisterForm } from "./RegisterForm";

export default function Register() {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Register</h1>

        <RegisterForm className={styles.form}>
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

          <button type="submit">Login</button>
        </RegisterForm>
      </div>
    </main>
  );
}
