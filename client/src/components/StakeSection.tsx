import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DollarSign } from "lucide-react";

interface StakeSectionProps {
  onPlaceStake?: () => void;
}

const StakeSection: React.FC<StakeSectionProps> = ({ onPlaceStake }) => {
  const [stakeAmount, setStakeAmount] = useState("");
  const quickAmounts = [1, 5, 10, 50, 100];

  const handlePlaceStake = () => {
    if (stakeAmount && onPlaceStake) {
      onPlaceStake();
      // Reset stake amount after placing
      setTimeout(() => setStakeAmount(""), 2000);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1 bg-yellow-500/20 rounded-lg">
          <DollarSign className="w-4 h-4 text-yellow-400" />
        </div>
        <h3 className="text-lg font-black text-yellow-400">STAKE</h3>
      </div>

      <div className="space-y-3">
        {/* Amount input */}
        <div className="relative">
          <Input
            type="number"
            placeholder="0.00"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="bg-black/30 border-yellow-500/30 text-yellow-300 placeholder:text-gray-500 text-lg font-bold h-12 pr-16"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 font-bold text-sm">
            STRK
          </div>
        </div>

        {/* Quick amount buttons */}
        <div className="grid grid-cols-5 gap-1">
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => setStakeAmount(amount.toString())}
              className="bg-black/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-400/50 text-xs font-bold h-8"
            >
              {amount}
            </Button>
          ))}
        </div>

        {/* Place stake button */}
        <Button
          className="w-full cursor-pointer h-12 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-black text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          disabled={!stakeAmount}
          onClick={handlePlaceStake}
        >
          PLACE STAKE
        </Button>

        {/* Estimated payout */}
        {stakeAmount && (
          <div className="p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
            <div className="text-xs text-green-400 font-bold mb-1">
              EST. PAYOUT
            </div>
            <div className="text-lg font-black text-green-300">
              {(parseFloat(stakeAmount) * 1.8).toFixed(2)} STRK
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StakeSection;
