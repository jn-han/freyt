const InfoCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-background-dark w-full p-5 rounded-xl my-3 animate-pulse space-y-3">
      {/* Title */}
      <div className="h-4 w-1/4 bg-gray-300 rounded"></div>

      {/* Total */}
      <div className="h-6 w-1/3 bg-gray-300 rounded"></div>

      {/* Breakdown block */}
      <div className="space-y-2 pt-2">
        <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default InfoCardSkeleton;
