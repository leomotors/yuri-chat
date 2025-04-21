"use client";

import dynamic from "next/dynamic";

const FallingFlowers = dynamic(() => import("./FallingFlowers"), {
  ssr: false,
});

export default FallingFlowers;
