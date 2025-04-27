"use client";

import { useEffect } from "react";

import { localStoragePrivateKey } from "@/constants";
import styles from "@/styles/button.module.css";
import { useLoginContext } from "@/context/loginContext";

import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, refetch } = useLoginContext();

  useEffect(() => {
    refetch();
  }, []);

  function handleLogout() {
    localStorage.removeItem(localStoragePrivateKey);

    fetch("/api/logout", { method: "POST" });
    setIsLoggedIn(false);
    refetch();
    router.push("/?r=" + Date.now());
  }

  return (
    <>
      {isLoggedIn && (
        <button className={styles.smallButton} onClick={handleLogout}>
          Logout
        </button>
      )}
    </>
  );
}
