"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

// Declare global Ethereum object
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

type MenuItem = {
  name: string;
  link?: string;
  action?: () => void;
};

export function NavbarDemo() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleViewDoctor = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      router.push(`/doctor/${accounts[0]}`);
    }
  };

  const handleViewPatient = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      router.push(`/record/${accounts[0]}`);
    }
  };

  const navItems: MenuItem[] = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Records List", link: "/list" },
  ];

  const doctorMenu: MenuItem[] = [
    { name: "View Profile", action: handleViewDoctor },
    { name: "Edit Profile", link: "/edit-doctor" },
    { name: "Make Medical Record", link: "/make-appointment" },
    { name: "Update Medical Record", link: "/edit-appointment" },
  ];

  const patientMenu: MenuItem[] = [
    { name: "View Profile", action: handleViewPatient },
    { name: "Edit Profile", link: "/edit-patient" },
    { name: "Allow Access", link: "/approve-doctor" },
    { name: "Revoke Access", link: "/revoke-doctor" },
  ];

  const registerMenu: MenuItem[] = [
    { name: "Register Patient", link: "/register-patient" },
    { name: "Register Doctor", link: "/register-doctor" },
  ];
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [isPatientOpen, setIsPatientOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems.filter(
              (item): item is { name: string; link: string } =>
                typeof item.link === "string"
            )}
          />

          <div className="flex items-center gap-4">
            {/* Doctor Dropdown */}
            {/* Doctor dropdown */}
            <div className="relative">
              <NavbarButton
                variant="primary"
                onClick={() => {
                  setIsDoctorOpen(!isDoctorOpen);
                  setIsPatientOpen(false);
                  setIsRegisterOpen(false);
                }}
              >
                Doctor
              </NavbarButton>
              {isDoctorOpen && (
                <div className="absolute right-0 bg-white dark:bg-black border rounded-md mt-2 shadow-lg w-48 z-50">
                  {doctorMenu.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsDoctorOpen(false);
                        if (item.action) {
                          item.action();
                        } else if (item.link) {
                          router.push(item.link);
                        }
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-neutral-800 text-sm"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Patient dropdown */}
            <div className="relative">
              <NavbarButton
                variant="primary"
                onClick={() => {
                  setIsPatientOpen(!isPatientOpen);
                  setIsDoctorOpen(false);
                  setIsRegisterOpen(false);
                }}
              >
                Patient
              </NavbarButton>
              {isPatientOpen && (
                <div className="absolute right-0 bg-white dark:bg-black border rounded-md mt-2 shadow-lg w-48 z-50">
                  {patientMenu.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsPatientOpen(false);
                        if (item.action) {
                          item.action();
                        } else if (item.link) {
                          router.push(item.link);
                        }
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-neutral-800 text-sm"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Register dropdown */}
            <div className="relative">
              <NavbarButton
                variant="primary"
                onClick={() => {
                  setIsRegisterOpen(!isRegisterOpen);
                  setIsDoctorOpen(false);
                  setIsPatientOpen(false);
                }}
              >
                Register
              </NavbarButton>
              {isRegisterOpen && (
                <div className="absolute right-0 bg-white dark:bg-black border rounded-md mt-2 shadow-lg w-48 z-50">
                  {registerMenu.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsRegisterOpen(false);
                        router.push(item.link!);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-neutral-800 text-sm"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="max-h-[calc(100vh-180px)] overflow-y-auto"
          >
            {[...navItems, ...doctorMenu, ...patientMenu, ...registerMenu].map(
              (item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (item.action) {
                      item.action();
                    } else if (item.link) {
                      router.push(item.link);
                    }
                  }}
                  className="w-full text-left py-2 px-4 text-neutral-700 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-700"
                >
                  {item.name}
                </button>
              )
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <DummyContent />
    </div>
  );
}
const DummyContent = () => {
  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="mb-4 text-center text-3xl font-bold">
        Check the navbar at the top of the container
      </h1>
      <p className="mb-10 text-center text-sm text-zinc-500">
        For demo purpose we have kept the position as{" "}
        <span className="font-medium">Sticky</span>. Keep in mind that this
        component is <span className="font-medium">fixed</span> and will not
        move when scrolling.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            id: 1,
            title: "The",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 2,
            title: "First",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 3,
            title: "Rule",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 4,
            title: "Of",
            width: "md:col-span-3",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 5,
            title: "F",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 6,
            title: "Club",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 7,
            title: "Is",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 8,
            title: "You",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 9,
            title: "Do NOT TALK about",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 10,
            title: "F Club",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
        ].map((box) => (
          <div
            key={box.id}
            className={`${box.width} ${box.height} ${box.bg} flex items-center justify-center rounded-lg p-4 shadow-sm`}
          >
            <h2 className="text-xl font-medium">{box.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};
