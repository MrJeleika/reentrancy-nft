import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { parseEther } from 'ethers';
import { ethers } from 'hardhat';

import { deployAuction } from './helpers/Auction.deployment.test';

// eslint-disable-next-line camelcase
import { ERC20Default__factory } from '../typechain-types';

describe('Attack', async () => {
  describe('Initialize', () => {
    it('should initialize', async () => {
      const { attacker } = await loadFixture(deployAuction);
      await expect(await attacker.getAddress()).to.be.properAddress;
    });
  });

  describe('Attack', async () => {
    it('Should attack', async () => {
      const { attacker, deployer, user, user2, auction, erc721 } =
        await loadFixture(deployAuction);

      await auction.connect(user).bid({ value: parseEther('1') });
      await auction.connect(user2).bid({ value: parseEther('5') });
      await auction.connect(user).bid({ value: parseEther('6') });
      await auction.connect(user).bid({ value: parseEther('6.01') });
      await auction.connect(user).bid({ value: parseEther('6.02') });
      await attacker.connect(deployer).bidAuction({ value: parseEther('6.1') });

      console.log(
        'Before',
        await ethers.provider.getBalance(await attacker.getAddress()),
      );

      await ethers.provider.send('evm_increaseTime', [24 * 60 * 60]);

      await attacker.attack();

      console.log(
        'After',
        await ethers.provider.getBalance(await attacker.getAddress()),
      );

      // expect(await unETH.balanceOf(deployer.address)).to.eq(0);
    });
    // it('Should return proper balance', async () => {
    //   const { unETH, deployer, erc20, user } = await loadFixture(deployRestake);
    //   expect(await erc20.balanceOf(user.address)).to.eq(parseEther('10'));
    //   expect(await erc20.balanceOf(deployer.address)).to.eq(0);
    // });
  });
});
