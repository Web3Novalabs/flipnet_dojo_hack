import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface CoinFlipAnimationProps {
  isFlipping?: boolean;
  result?: "heads" | "tails" | null;
  onAnimationComplete?: () => void;
}

const CoinFlipAnimation: React.FC<CoinFlipAnimationProps> = ({
  isFlipping = false,
  result = null,
  onAnimationComplete,
}) => {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isFlipping) {
      setAnimationClass("animate-[spin_2s_ease-in-out]");
      const timer = setTimeout(() => {
        setAnimationClass("");
        onAnimationComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isFlipping, onAnimationComplete]);

  return (
    <div className="relative flex flex-col mt-5 items-center w-full">
      {/* Pool info at top */}
      <div className="mb-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl px-6 py-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-300 font-black text-lg">POOL #189</span>
          <span className="text-orange-300 font-bold">300 STRK</span>
        </div>
      </div>

      {/* Coin container with glow */}
      <div className="relative">
        {/* Multi-layer glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-30 blur-3xl animate-pulse scale-150" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-40 blur-xl animate-pulse scale-125" />

        <div
          className={cn("relative w-32 h-32 perspective-1000", animationClass)}
          style={{ perspective: "1000px" }}
        >
          <div
            className={cn(
              "w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 shadow-2xl transform-gpu transition-transform duration-700",
              "border-4 border-yellow-200 relative overflow-hidden",
              "flex items-center justify-center",
              isFlipping &&
                "animate-[flip_2s_ease-in-out,bounce_2s_ease-in-out]"
            )}
            style={{
              transformStyle: "preserve-3d",
              animation: isFlipping
                ? "flip 2s ease-in-out, bounce 2s ease-in-out"
                : undefined,
            }}
          >
            {/* Coin texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />

            {/* Inner coin design */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-400 shadow-inner flex items-center justify-center border-2 border-yellow-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-yellow-400" />
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/40 blur-sm" />
          </div>

          {/* Result indicator */}
          {result && !isFlipping && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/70 backdrop-blur-sm text-yellow-400 px-4 py-2 rounded-full font-black text-lg animate-fade-in border border-yellow-500/50">
                {result.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced odds display */}
      <div className="mt-6 flex gap-6">
        {/* Heads side */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg px-6 py-4 text-center hover:border-green-400/50 transition-all cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <span className="text-black font-black text-xs">H</span>
              </div>
              <span className="text-green-300 font-black text-sm">HEADS</span>
            </div>
            <div className="text-2xl font-black text-green-400 mb-1">60%</div>
            <div className="text-green-200 text-xs font-bold">1.8x PAYOUT</div>
            <div className="text-green-300/70 text-xs mt-1">142 BETS</div>
          </div>
        </div>

        {/* VS indicator */}
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full font-black text-xs border-2 border-white/20">
            VS
          </div>
        </div>

        {/* Tails side */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-lg px-6 py-4 text-center hover:border-red-400/50 transition-all cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                <span className="text-white font-black text-xs">T</span>
              </div>
              <span className="text-red-300 font-black text-sm">TAILS</span>
            </div>
            <div className="text-2xl font-black text-red-400 mb-1">40%</div>
            <div className="text-red-200 text-xs font-bold">2.5x PAYOUT</div>
            <div className="text-red-300/70 text-xs mt-1">98 BETS</div>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="mt-4 flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-red-300 font-bold text-sm">LIVE BETTING</span>
      </div>

      {/* Add CSS keyframes for 3D flip animation */}
      <style jsx>{`
        @keyframes flip {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: rotateY(90deg) rotateX(45deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(90deg);
          }
          75% {
            transform: rotateY(270deg) rotateX(135deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(180deg);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default CoinFlipAnimation;
