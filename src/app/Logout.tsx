"use client";

import { useEffect, useState } from "react";

import { localStoragePrivateKey } from "@/constants";
import styles from "@/styles/button.module.css";

export function Logout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const privateKey = localStorage.getItem(localStoragePrivateKey);
    setIsLoggedIn(!!privateKey);
  }, []);

  function handleLogout() {
    localStorage.removeItem(localStoragePrivateKey);

    fetch("/api/logout", { method: "POST" });
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
