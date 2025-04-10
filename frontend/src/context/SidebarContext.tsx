"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SidebarContextType = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
