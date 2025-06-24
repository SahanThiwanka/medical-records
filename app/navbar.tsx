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
import HomePage from "./Home";

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
    <div className="relative w-full bg-gradient-to-br from-gray-900 via-black to-gray-950">
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
      <HomePage />
    </div>
  );
}
