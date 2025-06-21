import React from "react";
import { TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="py-12  bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold text-white">FlipNet</span>
              </div>
              <p className="text-gray-400 text-sm">
                The next-generation prediction market on Starknet.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Markets
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Tokenomics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Developers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Medium
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-4 md:mb-0">
              © 2025 FlipNet. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-indigo-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
