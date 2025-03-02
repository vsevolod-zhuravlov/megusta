// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EnglishAuctionManagerModule = buildModule("EnglishAuctionManagerModule", (m) => {
  const auction = m.contract("EnglishAuctionManager");

  return { auction };
});

export default EnglishAuctionManagerModule;