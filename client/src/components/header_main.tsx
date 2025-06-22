"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Menu, X } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";
// import { WalletConnect } from "../WalletConnect";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div>
      {/* Navigation */}
      <nav
        className={`fixed w-full text-white transition-all duration-300 z-50 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md py-3 shadow-lg"
            : "py-5 bg-[#0a0a0a] backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <TrendingUp size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold">FlipNet</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#about"
              className="hover:text-indigo-400 transition-colors"
            >
              About
            </a>
            <a
              href="#how-it-works"
              className="hover:text-indigo-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#markets"
              className="hover:text-indigo-400 transition-colors"
            >
              Markets
            </a>
            {/* <WalletConnect /> */}
            <ConnectWallet />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-sm p-4 shadow-lg absolute w-full">
            <div className="flex flex-col space-y-4">
              <a
                href="#about"
                className="hover:text-indigo-400 transition-colors py-2 border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#how-it-works"
                className="hover:text-indigo-400 transition-colors py-2 border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#markets"
                className="hover:text-indigo-400 transition-colors py-2 border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Markets
              </a>
              <div className="mt-2">
                {/* <WalletConnect /> */}
                Connect Wallet
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
