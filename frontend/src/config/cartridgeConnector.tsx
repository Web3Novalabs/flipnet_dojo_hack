import { Connector } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { ControllerOptions } from "@cartridge/controller";
import { constants } from "starknet";

// Get environment variable with fallback for Next.js
const DEPLOY_TYPE = process.env.NEXT_PUBLIC_DEPLOY_TYPE || "sepolia";

console.log("NEXT_PUBLIC_DEPLOY_TYPE", DEPLOY_TYPE);

// Your deployed game contract address
const CONTRACT_ADDRESS_GAME =
  "0x06a1234b040572272e23e61c24796b37de71c6b5c508fbe228d259c0c9359e71";

const getRpcUrl = () => {
  switch (DEPLOY_TYPE) {
    case "localhost":
      return "http://localhost:5050"; // Katana localhost default port
    case "mainnet":
      return "https://api.cartridge.gg/x/starknet/mainnet";
    case "sepolia":
    default:
      return "https://api.cartridge.gg/x/starknet/sepolia";
  }
};

const getDefaultChainId = () => {
  switch (DEPLOY_TYPE) {
    case "localhost":
      return "0x4b4154414e41"; // KATANA in ASCII
    case "mainnet":
      return constants.StarknetChainId.SN_MAIN;
    case "sepolia":
    default:
      return constants.StarknetChainId.SN_SEPOLIA;
  }
};

console.log("Using game contract address:", CONTRACT_ADDRESS_GAME);
console.log("Using RPC URL:", getRpcUrl());
console.log("Using Chain ID:", getDefaultChainId());

const policies = {
  contracts: {
    [CONTRACT_ADDRESS_GAME]: {
      methods: [
        { name: "create_game", entrypoint: "create_game" },
        { name: "place_stake", entrypoint: "place_stake" },
        { name: "reveal", entrypoint: "reveal" },
        { name: "get_game_info", entrypoint: "get_game_info" },
      ],
    },
  },
};

// Use the SAME configuration structure as your working example
const options: ControllerOptions = {
  chains: [{ rpcUrl: getRpcUrl() }], // Keep this structure - it works!
  defaultChainId: getDefaultChainId(), // Keep this property name
  policies,
  namespace: "full_starter_react",
  slot: "full-starter-react",
};

const cartridgeConnector = new ControllerConnector(
  options
) as never as Connector;

export default cartridgeConnector;
