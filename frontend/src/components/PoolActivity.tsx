import React from "react";
import { Activity, Users, Clock, TrendingUp } from "lucide-react";

const PoolActivity: React.FC = () => {
  const pools = [
    {
      id: 189,
      amount: 300,
      participants: 12,
      timeLeft: "0:59",
      status: "active",
    },
    {
      id: 188,
      amount: 450,
      participants: 18,
      timeLeft: "Ended",
      status: "ended",
    },
    {
      id: 187,
      amount: 275,
      participants: 9,
      timeLeft: "Ended",
      status: "ended",
    },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1 bg-yellow-500/20 rounded-lg">
          <Activity className="w-4 h-4 text-yellow-400" />
        </div>
        <h3 className="text-lg font-black text-yellow-400">POOLS</h3>
      </div>

      <div className="space-y-2">
        {pools.map((pool) => (
          <div
            key={pool.id}
            className="bg-black/30 border border-yellow-500/20 rounded-lg p-3 hover:bg-black/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-300 font-black text-sm">
                  #{pool.id}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    pool.status === "active"
                      ? "bg-green-400 animate-pulse"
                      : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="flex items-center gap-1 text-gray-300">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-bold">{pool.timeLeft}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-yellow-300">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="font-black text-sm">{pool.amount}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Users className="w-3 h-3" />
                  <span className="text-xs font-bold">{pool.participants}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoolActivity;
