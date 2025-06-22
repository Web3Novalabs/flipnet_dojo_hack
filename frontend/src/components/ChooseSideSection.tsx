import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Target, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

const ChooseSideSection: React.FC = () => {
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(
    null
  );

  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1 bg-yellow-500/20 rounded-lg">
          <Target className="w-4 h-4 text-yellow-400" />
        </div>
        <h3 className="text-lg font-black text-yellow-400">CHOOSE SIDE</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => setSelectedSide("heads")}
          className={cn(
            "h-20 flex flex-col cursor-pointer items-center justify-center gap-1 transition-all duration-300 transform hover:scale-105 font-black",
            selectedSide === "heads"
              ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-2 border-green-400"
              : "bg-black/30 border border-green-500/30 text-green-300 hover:bg-green-500/20"
          )}
        >
          <div className="text-xl font-black">H</div>
          <div className="text-xs">HEADS</div>
          <div className="text-xs opacity-70">1.8x</div>
        </Button>

        <Button
          onClick={() => setSelectedSide("tails")}
          className={cn(
            "h-20 flex flex-col cursor-pointer items-center justify-center gap-1 transition-all duration-300 transform hover:scale-105 font-black",
            selectedSide === "tails"
              ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg border-2 border-red-400"
              : "bg-black/30 border border-red-500/30 text-red-300 hover:bg-red-500/20"
          )}
        >
          <div className="text-xl font-black">T</div>
          <div className="text-xs">TAILS</div>
          <div className="text-xs opacity-70">2.5x</div>
        </Button>
      </div>

      {selectedSide && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg animate-fade-in">
          <div className="flex items-center gap-2 text-yellow-300">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold">
              Selected {selectedSide.toUpperCase()} •{" "}
              {selectedSide === "heads" ? "1.8x" : "2.5x"} multiplier
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChooseSideSection;
