"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";
import LoginForm from "@/app/components/LoginForm";

export default function Login() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/trackers");
    }
  }, [user, router]);

  return (
    <main className="flex flex-col gap-4 w-[400px] mt-[150px] mx-[auto]">
      <LoginForm />
    </main>
  );
}
