import Link from "next/link";
import { LoginProvider } from "@/context/LoginProvider";
import { Logout } from "@/app/Logout";

export default function Navbar() {
  return (
    <nav className="bg-[#FFD1DC] p-6 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-wide text-[#EC407A]">
          <Link href="/">Yuri-Chat</Link>
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 italic">
            Socket Programming Project
          </span>
          <LoginProvider>
            <Logout />
          </LoginProvider>
        </div>
      </div>
    </nav>
  );
}
