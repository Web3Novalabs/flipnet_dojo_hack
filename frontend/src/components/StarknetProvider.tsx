"use client";
import React from "react";

import type { PropsWithChildren } from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  jsonRpcProvider,
  StarknetConfig,
  starkscan,
} from "@starknet-react/core";
import cartridgeConnector from "../config/cartridgeConnector";

export default function StarknetProvider({ children }: PropsWithChildren) {
  // Get environment variable with fallback
  const DEPLOY_TYPE = process.env.NEXT_PUBLIC_DEPLOY_TYPE || "sepolia";

  console.log("NEXT_PUBLIC_DEPLOY_TYPE", DEPLOY_TYPE);

  // Get RPC URL based on environment
  const getRpcUrl = () => {
    switch (DEPLOY_TYPE) {
      case "mainnet":
        return "https://api.cartridge.gg/x/starknet/mainnet";
      case "sepolia":
      default:
        return "https://api.cartridge.gg/x/starknet/sepolia";
    }
  };

  // Create provider with the correct RPC URL
  const provider = jsonRpcProvider({
    rpc: () => ({ nodeUrl: getRpcUrl() }),
  });

  // Determine which chain to use
  const chains = DEPLOY_TYPE === "mainnet" ? [mainnet] : [sepolia];

  console.log("Provider configured with:", {
    deployType: DEPLOY_TYPE,
    rpcUrl: getRpcUrl(),
    chains: chains.map((c) => c.name),
  });

  return (
    <StarknetConfig
      autoConnect
      chains={chains}
      connectors={[cartridgeConnector]}
      explorer={starkscan}
      provider={provider}
    >
      {children}
    </StarknetConfig>
  );
}
