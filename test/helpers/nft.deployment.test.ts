import { ethers } from 'hardhat';

// eslint-disable-next-line camelcase
import { ERC721__factory, MyNFT__factory } from '../../typechain-types';

export const deployNFT = async () => {
  const [deployer, user, user2] = await ethers.getSigners();
  const erc721 = await new MyNFT__factory(deployer).deploy();
  return { erc721, deployer, user, user2 };
};
