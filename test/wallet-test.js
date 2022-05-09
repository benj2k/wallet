const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deployment", function () {
  it("Should pass if deployed correctly", async function () {
    const Wallet = await ethers.getContractFactory("Wallet");
    const wallet = await Wallet.deploy();
    await wallet.deployed();
  });

  it("Should have 0 ETH in owner wallet", async function () {
    const [owner] = await ethers.getSigners();
    const Wallet = await ethers.getContractFactory("Wallet");

    const hardhatWallet = await Wallet.deploy();

    const overrides = {
      from: owner.address
    }
    const ownerBalance = await hardhatWallet.getBalance(overrides);
    expect(0).to.equal(ownerBalance);
  });
});

describe("Transactions", function () {

  it("Should add and remove ETH in owner wallet", async function () {
    const [owner] = await ethers.getSigners();
    const Wallet = await ethers.getContractFactory("Wallet");

    const hardhatWallet = await Wallet.deploy();

    const tx = {
      from: owner.address,
      to: hardhatWallet.address,
      value: 10
    }
    const transtraction = await owner.sendTransaction(tx);
    await transtraction.wait();

    const overrides = {
      from: owner.address
    }
    let ownerBalance = await hardhatWallet.getBalance(overrides);
    expect(10).to.equal(ownerBalance);

    const withdrawtx = await hardhatWallet.withdrawMoney(owner.address, 2);
    await withdrawtx.wait();

    ownerBalance = await hardhatWallet.getBalance(overrides);
    expect(8).to.equal(ownerBalance);
  });
});
