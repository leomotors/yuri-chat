"use client";

import Image from "next/image";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFE4EC] text-gray-800 relative overflow-hidden">
      {/* Falling flowers */}
      <div className="falling-flowers absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className={`flower-${index} absolute`}
            style={{
              animation: `fall ${
                Math.random() * 5 + 5
              }s linear infinite, sway ${
                Math.random() * 2 + 1
              }s ease-in-out infinite`,
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <Image
              src="/tralalero-tralala.png"
              alt="NikeShark"
              width={50}
              height={50}
              priority
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-[#FFD1DC] p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-wide text-[#EC407A]">
            Yuri-Chat
          </h1>
          <span className="text-sm text-gray-700 italic">
            Socket Programming Project
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-[#FFF0F5] p-12 rounded-xl shadow-lg w-full max-w-xl text-center space-y-6 z-20">
          <div className="flex justify-center gap-4">
            <Image
              src="/tralalero-tralala.png"
              alt="Logo 1"
              width={150}
              height={38}
              priority
            />
            <Image
              src="/Cappuccino_Assassino.png"
              alt="Logo 2"
              width={150}
              height={38}
              priority
            />
          </div>
          <form className="login-form space-y-4">
            <h2 className="text-3xl font-bold text-[#D81B60]">Login</h2>
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full p-3 border border-[#F8BBD0] bg-[#FCE4EC] text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F48FB1]"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-3 border border-[#F8BBD0] bg-[#FCE4EC] text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F48FB1]"
            />
            <button
              type="submit"
              className="w-full p-3 bg-[#F48FB1] text-white font-semibold rounded-md hover:bg-[#EC407A] transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#EC407A]"
            >
              Login
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FFD1DC] p-4 text-center text-gray-700 text-sm">
        <p>Yuri-Chat</p>
      </footer>

      {/* Add the flower animation styles */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px);
            opacity: 1;
          }
          100% {
            transform: translateY(500px);
            opacity: 0;
          }
        }

        .falling-flowers .flower-0,
        .falling-flowers .flower-1,
        .falling-flowers .flower-2,
        .falling-flowers .flower-3,
        .falling-flowers .flower-4,
        .falling-flowers .flower-5,
        .falling-flowers .flower-6,
        .falling-flowers .flower-7,
        .falling-flowers .flower-8,
        .falling-flowers .flower-9 {
          position: absolute;
          animation: fall 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
