import Link from "next/link";
import React from "react";
import { Grid2X2, User, ChartColumnBig, History, Grid } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-1/5 bg-background-light text-black flex flex-col items-center justify-items-between p-3">
      <div className=" h-1/2 flex flex-col justify-items-center items-start">
        <Link href="/" className="my-4">
          Freyt
        </Link>
        {/* Dashboard */}
        <Link href="/dashboard" className="my-4 flex flex-row">
          <Grid2X2 /> Dashboard
        </Link>
        {/* Roster */}
        <Link href="/" className="my-4 flex flex-row">
          <User /> Roster
        </Link>
        {/* Store Performance */}
        <Link href="/" className="my-4 flex flex-row">
          <ChartColumnBig /> Store Performance
        </Link>
        {/* Shipment History */}
        <Link href="/" className="my-4 flex flex-row">
          <History /> Shipment History
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
