"use client";

import Image from "next/image";

export default function FallingFlowers() {
  return (
    <>
      <div
        className={`falling-flowers pointer-events-none absolute top-0 left-0 z-10 h-full w-full`}
      >
        {[...Array(30)].map((_, index) => (
          <div
            key={index}
            className={`flower-${index} absolute`}
            style={{
              animation: `fall ${Math.random() * 5 + 5}s linear infinite`,
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <div
              className="swaying"
              style={{
                animation: `sway ${Math.random() * 2 + 1}s ease-in-out infinite`,
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

        @keyframes sway {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
          100% {
            transform: translateX(0);
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
        }

        .swaying {
          display: inline-block;
        }
      `}</style>
    </>
  );
}
