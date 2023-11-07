"use client";

import { useEffect } from "react";
import Login from "./(routes)/login/page";
import Trackers from "./(routes)/trackers/page";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth;
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return <main className="flex flex-col min-h-screen "></main>;
}
