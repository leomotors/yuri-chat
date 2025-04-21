"use client";

import Image from "next/image";

export default function FallingFlowers() {
  return (
    <>
      <div
        className={`falling-flowers pointer-events-none absolute top-0 left-0 z-10 h-full w-full`}
      >
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className={`flower-${index} absolute`}
            style={{
              animation: `fall ${Math.random() * 5 + 5}s linear infinite, sway ${
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

        .falling-flowers {
          position: absolute;
          animation: fall 5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
