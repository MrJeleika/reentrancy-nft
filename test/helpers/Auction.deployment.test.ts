import { Contract, parseEther } from 'ethers';

import { auctionAbi } from './auction.abi';
// eslint-disable-next-line camelcase
import { deployNFT } from './nft.deployment.test';

// eslint-disable-next-line camelcase
import { MaliciousSeller__factory } from '../../typechain-types';
import { EnglishAuction } from '../../typechain-types/contracts/EnglishAuction';

export const deployAuction = async () => {
  const { deployer, erc721, user, user2 } = await deployNFT();

  const attacker = await new MaliciousSeller__factory(deployer).deploy(
    await erc721.getAddress(),
    1,
  );

  await attacker.mintSeller();

  await attacker.deployAuction(1);
  await attacker.approveAuction();

  const auctionAddress = await attacker.auction();

  const auction = new Contract(
    auctionAddress,
    auctionAbi,
  ) as unknown as EnglishAuction;

  await attacker.startAuction();

  return { auction, deployer, user, erc721, attacker, user2 };
};
