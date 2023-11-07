import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import devotLogo from "../assets/devot-logo-white.svg";
import Image from "next/image";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [url, setUrl] = useState(null);

  useEffect(() => {
    setUrl(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSignout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-between px-[45px] bg-[#181846] rounded-b-[22px] h-[112px] ">
      <div>
        <Image priority={true} src={devotLogo} alt="Devot tracking tool logo" />
      </div>
      {user ? (
        <div className="flex items-center justify-center rounded-b-[22px] h-full">
          <Link
            href="/trackers"
            className={`navbar-item ${
              url === "/trackers" ? "active-link" : ""
            }`}
          >
            <i className="pi pi-clock mr-3" style={{ fontSize: "18px" }}></i>
            Trackers
          </Link>
          <Link
            className={`navbar-item ${url === "/history" ? "active-link" : ""}`}
            href="/history"
          >
            <i className="pi pi-history mr-3" style={{ fontSize: "18px" }}></i>
            History
          </Link>
          <div>
            <button
              className="flex items-center px-[45px] text-[15px] text-[#c4c5d7] hover:text-[#f9f9fd]"
              onClick={handleSignout}
            >
              <i
                className="pi pi-power-off mr-3"
                style={{ fontSize: "18px" }}
              ></i>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Navbar;
