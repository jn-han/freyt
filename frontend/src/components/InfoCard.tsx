"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type InfoCardProps = {
  title: string;
  total: number;
  breakdown?: Record<string, number>;
  percentage?: number;
  diffAmount?: number;
};

const InfoCard = ({
  title,
  total,
  breakdown,
  percentage,
  diffAmount,
}: InfoCardProps) => {
  const [showPercentage, setShowPercentage] = useState(true); // default to % view
  console.log(diffAmount);
  return (
    <motion.div
      className="flex flex-col bg-background-dark w-full p-5 rounded-xl my-3 cursor-pointer"
      whileHover={{ scale: 1.05 }}
    >
      <h1 className="text-md font-light">{title}</h1>
      <p className="text-2xl font-semibold">{total}</p>
      {breakdown && (
        <div className=" space-y-1 text-sm text-gray-400">
          {(percentage !== undefined || diffAmount !== undefined) && (
            <p
              className={`text-sm ${
                (showPercentage ? percentage : diffAmount) !== undefined &&
                (showPercentage ? percentage! : diffAmount!) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {showPercentage && percentage !== undefined && (
                <>
                  {percentage > 0 ? "+" : ""}
                  {percentage}%
                </>
              )}
              {!showPercentage && diffAmount !== undefined && (
                <>
                  {diffAmount > 0 ? "+" : ""}
                  {diffAmount} {title}
                </>
              )}
            </p>
          )}
          {Object.entries(breakdown).map(([dc, val]) => (
            <div key={dc}>
              <p>
                {dc}: {val}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default InfoCard;
