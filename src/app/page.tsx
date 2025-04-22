import Link from "next/link";

import FallingFlowers from "@/components/FallingFlowers";

import { LoginProvider } from "@/context/LoginProvider";
import Navbar from "@/components/Navbar";
import LandingClientWrapper from "@/app/LandingClientWrapper";

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <Navbar />
      <LandingClientWrapper />
    </>
  );
}
