// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ERC721MockTokenModule = buildModule("ERC721MockTokenModule", (m) => {
  const token = m.contract("ERC721MockToken", ["0x9Cf35beA12F0bA72528C43Ba96aE6979D5A63e75"]);

  return { token };
});

export default ERC721MockTokenModule;