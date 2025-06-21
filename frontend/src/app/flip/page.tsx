"use client";

import React, { useState } from "react";
import Header from "@/components/Header_flip";
import CoinFlipAnimation from "@/components/CoinFlipAnimation";
import StakeSection from "@/components/StakeSection";
import ChooseSideSection from "@/components/ChooseSideSection";
import PoolActivity from "@/components/PoolActivity";
import GameChat from "@/components/GameChat";
import UserInfoSection from "@/components/UserInfoSection"; // New component

const Page = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);

  const handlePlaceStake = () => {
    setIsFlipping(true);
    setResult(null);
    setTimeout(() => {
      const outcomes: ("heads" | "tails")[] = ["heads", "tails"];
      const randomResult =
        outcomes[Math.floor(Math.random() * outcomes.length)];
      setResult(randomResult);
    }, 2000);
  };

  const handleAnimationComplete = () => {
    setIsFlipping(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      <div className="relative z-10 flex flex-col min-h-screen p-4 max-w-[100vw]">
        <Header />

        {/* Desktop Layout */}
        <div className="hidden lg:flex mt-16 flex-1 container mx-auto max-w-7xl">
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-3 space-y-4">
              <StakeSection onPlaceStake={handlePlaceStake} />
              <ChooseSideSection />
              <UserInfoSection /> {/* Added new component */}
            </div>
            <div className="col-span-6 flex items-center justify-center">
              <CoinFlipAnimation
                isFlipping={isFlipping}
                result={result}
                onAnimationComplete={handleAnimationComplete}
              />
            </div>
            <div className="col-span-3 space-y-4">
              <PoolActivity />
              <GameChat />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden mt-16 flex-1">
          <div className="space-y-4 container mx-auto max-w-2xl">
            <div className="flex justify-center py-4">
              <CoinFlipAnimation
                isFlipping={isFlipping}
                result={result}
                onAnimationComplete={handleAnimationComplete}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StakeSection onPlaceStake={handlePlaceStake} />
              <ChooseSideSection />
              <UserInfoSection /> {/* Added new component */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PoolActivity />
              <GameChat />
            </div>
          </div>
        </div>

        {/* Bottom stats - Desktop only */}
        <div className="hidden lg:grid grid-cols-3 gap-4 mt-4 container mx-auto max-w-7xl">
          <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-lg p-3 text-center">
            <div className="text-xl font-black text-yellow-400 mb-1">1,247</div>
            <div className="text-yellow-200 text-xs font-medium">
              TOTAL DEGENS
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-lg p-3 text-center">
            <div className="text-xl font-black text-yellow-400 mb-1">
              45,823
            </div>
            <div className="text-yellow-200 text-xs font-medium">
              STRK WAGERED
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-lg p-3 text-center">
            <div className="text-xl font-black text-yellow-400 mb-1">98.7%</div>
            <div className="text-yellow-200 text-xs font-medium">
              PAYOUT RATE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
