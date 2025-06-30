"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const SimpleNavbar = () => {
  const router = useRouter();
  const [dropdown, setDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const menus = {
    doctor: [
      { name: "View Profile", link: "/view-doctor-profile" },
      { name: "Edit Profile", link: "/edit-doctor" },
      { name: "Make Medical Record", link: "/make-appointment" },
      { name: "Update Medical Record", link: "/edit-appointment" },
    ],
    patient: [
      { name: "View Profile", link: "/view-patient-profile" },
      { name: "Edit Profile", link: "/edit-patient" },
      { name: "Allow Access", link: "/approve-doctor" },
      { name: "Revoke Access", link: "/revoke-doctor" },
    ],
    register: [
      { name: "Register Patient", link: "/register-patient" },
      { name: "Register Doctor", link: "/register-doctor" },
    ],
  };

  const handleNavigate = (link: string) => {
    router.push(link);
    setDropdown(null);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>MedBlockChain</div>

        <div className="hidden md:flex gap-6 items-center">
          <button onClick={() => handleNavigate("/")} className="hover:text-blue-400">Home</button>
          <button onClick={() => handleNavigate("/dashboard")} className="hover:text-blue-400">Dashboard</button>
          <button onClick={() => handleNavigate("/list")} className="hover:text-blue-400">Records List</button>

          {Object.entries(menus).map(([key, items]) => (
            <div key={key} className="relative">
              <button
                onClick={() => setDropdown(dropdown === key ? null : key)}
                className="hover:text-blue-400 capitalize"
              >
                {key}
              </button>
              {dropdown === key && (
                <div className="absolute left-0 mt-3 bg-white text-black rounded-md shadow-lg w-56 py-2 space-y-1 z-50">
                  {items.map((item) => (
                    <button
                      key={item.link}
                      onClick={() => handleNavigate(item.link)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="md:hidden">
          <button onClick={() => setDropdown(dropdown === "mobile" ? null : "mobile")}>☰</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {dropdown === "mobile" && (
        <div className="md:hidden bg-black text-white px-6 pb-4 space-y-3">
          <button onClick={() => handleNavigate("/")} className="block w-full text-left">Home</button>
          <button onClick={() => handleNavigate("/dashboard")} className="block w-full text-left">Dashboard</button>
          <button onClick={() => handleNavigate("/list")} className="block w-full text-left">Records List</button>

          {Object.entries(menus).map(([key, items]) => (
            <div key={key}>
              <div className="font-semibold capitalize mt-2">{key}</div>
              {items.map((item) => (
                <button
                  key={item.link}
                  onClick={() => handleNavigate(item.link)}
                  className="block w-full text-left px-4 py-1 hover:bg-gray-800"
                >
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default SimpleNavbar;
