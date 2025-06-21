import { Button } from "./ui/button";
import { useStarknetConnect } from "../hooks/useStarknetConnect";
import { Wallet, Loader2, LogOut } from "lucide-react";

export function ConnectWallet() {
  const {
    status,
    address,
    isConnecting,
    handleConnect,
    handleDisconnect,
    isConnected,
  } = useStarknetConnect();

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              disabled={isConnecting || status === "connecting"}
              className="font-semibold transition-all cursor-pointer hover:bg-white/10 hover:text-white text-slate-300 border-slate-600/30 hover:border-slate-600/50 flex items-center"
            >
              {isConnecting || status === "connecting" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <>
              <span className="text-slate-300 font-mono text-sm bg-slate-800/50 px-3 py-2 rounded-lg">
                {formatAddress(address || "")}
              </span>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="border-red-400/40 hover:border-red-400/60 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Debug info - remove in production */}
        <div className="text-xs text-slate-500">
          Status: {status} | Address: {address ? "✓" : "✗"}
        </div>
      </div>
    </div>
  );
}
