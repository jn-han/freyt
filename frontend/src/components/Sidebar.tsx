"use client";

import Link from "next/link";
import React from "react";
import {
  House,
  ChartColumnBig,
  History,
  Box,
  ArrowLeftFromLine,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

const Sidebar = () => {
  const pathName = usePathname();
  const todayDateString = new Date().toLocaleDateString("sv-SE");

  const { isCollapsed, toggleCollapse } = useSidebar();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <House />,
      isActive: pathName === "/dashboard",
    },
    {
      label: "Today's Shipment",
      href: `/shipment/${todayDateString}`,
      icon: <Box />,
      isActive: pathName.startsWith("/shipment/"),
    },
    {
      label: "Shipment History",
      href: "/shipmentHistory",
      icon: <History />,
      isActive: pathName === "/shipmentHistory",
    },
    {
      label: "Store Performance",
      href: "/storePerformance",
      icon: <ChartColumnBig />,
      isActive: pathName === "/storePerformance",
    },
    {
      label: "Roster",
      href: "/roster",
      icon: <History />,
      isActive: pathName === "/roster",
    },
  ];

  return (
    <div
      className={`relative ${
        isCollapsed ? "w-[5%]" : "w-1/6"
      } bg-background-light text-black flex flex-col items-center p-3 transition-all duration-300`}
    >
      {/* Collapse Button */}
      <button
        onClick={toggleCollapse}
        className={`absolute top-4 ${
          isCollapsed ? "left-1/2 transform -translate-x-1/2" : "right-4"
        } z-10`}
      >
        <ArrowLeftFromLine
          className={`transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Sidebar Content */}
      <div className="mt-12 flex flex-col items-center w-full gap-4 px-2">
        <Link href="/" className="py-4 text-xl font-bold w-full">
          {isCollapsed ? "Freyt" : "Freyt"}
        </Link>

        {navItems.map(({ label, href, icon, isActive }) => (
          <Link
            key={label}
            href={href}
            className={`flex flex-row gap-3 items-center w-full p-3 rounded-xl hover:bg-background-dark transition ${
              isActive ? "bg-background-dark" : ""
            }`}
          >
            {icon} {!isCollapsed && label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
