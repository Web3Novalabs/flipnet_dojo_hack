import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Clock, TrendingUp, Flame } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-black/20 backdrop-blur-md py-4 shadow-lg"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {/* <Link href={"/"}> */}
            <Button
              variant="ghost"
              size="sm"
              className="text-yellow-400 cursor-pointer hover:text-yellow-300 hover:bg-yellow-500/10 font-bold flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
          {/* </Link> */}

          {/* <Link href={"/"}> */}
            <div className="flex cursor-pointer items-center gap-2 truncate">
              <Flame className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text whitespace-nowrap">
                FLIPNET
              </span>
            </div>
          {/* </Link> */}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-yellow-500/30 rounded-lg px-3 py-1.5">
            <TrendingUp className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-yellow-300 font-bold text-sm whitespace-nowrap">
              Pool #189
            </span>
            <span className="text-orange-300 font-bold text-sm whitespace-nowrap">
              300 STRK
            </span>
          </div>
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/50 rounded-lg px-3 py-1.5">
            <Clock className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-red-200 font-black font-mono text-sm whitespace-nowrap">
              0:59
            </span>
          </div>

          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
