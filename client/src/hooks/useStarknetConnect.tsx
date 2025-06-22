// hooks/useStarknetConnect.ts
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { useState, useCallback, useEffect } from "react";

export function useStarknetConnect() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { status, address, account } = useAccount();
  const [hasTriedConnect, setHasTriedConnect] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("🎮 Starknet Connect Status:", {
      status,
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
      fullAddress: address,
      isConnecting,
      hasTriedConnect,
      availableConnectors: connectors.length,
      account: !!account,
    });
  }, [
    status,
    address,
    isConnecting,
    hasTriedConnect,
    connectors.length,
    account,
  ]);

  const handleConnect = useCallback(async () => {
    const connector = connectors[0]; // Cartridge connector
    if (!connector) {
      console.error("No connector found");
      return;
    }

    try {
      setIsConnecting(true);
      setHasTriedConnect(true);
      console.log("🔗 Attempting to connect controller...");

      const result = await connect({ connector });
      console.log("✅ Connection result:", result);
      console.log("✅ controller connected successfully");
    } catch (error) {
      console.error("❌ Connection failed:", error);
      // Reset states on error
      setHasTriedConnect(false);
    } finally {
      setIsConnecting(false);
    }
  }, [connect, connectors]);

  const handleDisconnect = useCallback(async () => {
    try {
      console.log("🔌 Disconnecting controller...");
      await disconnect();
      setHasTriedConnect(false);
      console.log("✅ controller disconnected successfully");
    } catch (error) {
      console.error("❌ Disconnection failed:", error);
    }
  }, [disconnect]);

  return {
    status,
    address,
    account,
    isConnecting,
    hasTriedConnect,
    handleConnect,
    handleDisconnect,
    setHasTriedConnect,
    isConnected: status === "connected" && !!address, // Better connection check
  };
}
