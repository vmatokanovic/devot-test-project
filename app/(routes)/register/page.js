"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";
import RegisterForm from "@/app/components/RegisterForm";

export default function Register() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/trackers");
    }
  }, [user, router]);

  return (
    <main className="flex flex-col gap-4 w-[400px] mt-[150px] mx-[auto]">
      <RegisterForm />
    </main>
  );
}
