import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Wallet from './artifacts/contracts/Wallet.sol/Wallet.json';
import './App.css';
//import { transaction } from 'ethers/lib/utils';

let WalletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {

  const [balance, setBalance] = useState(0); // to know how much has a user on his account
  const [amountSend, setAmountSend] = useState();
  const [amountWithdraw, setAmountWithdraw] = useState();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getBalance();
  }, [])
  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') { // check if user is connected with metamask
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider);
      try {
        let overrides = {
          from: accounts[0]
        }
        const data = await contract.getBalance(overrides);
        setBalance(String(data));
      } catch (err) {
        setError("Shit happens : " + err.message);
      }

    }
  }

  function changeAmountSend(e) {
    setAmountSend(e.target.value);
  }

  function changeAmountWithdraw(e) {
    setAmountWithdraw(e.target.value);
  }

  async function transfer() {
    if (!amountSend) {
      return;
    }
    setError('');
    setSuccess('');
    if (typeof window.ethereum !== 'undefined') { // check if user is connected with metamask
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.utils.parseEther(amountSend)
        }
        const transtraction = await signer.sendTransaction(tx);
        await transtraction.wait();
        setAmountSend('');
        getBalance();
        setSuccess('Successfuly sent your money into the wallet !'); 
      } catch (err) {
        setError("Error while transfer");
      }
    }
  }

  async function withdraw() {
    if (!amountWithdraw) {
      return;
    }
    setError('');
    setSuccess('');
    if (typeof window.ethereum !== 'undefined') { // check if user is connected with metamask
      console.log("ok")
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer);
      try {
        const withdraw = await contract.withdrawMoney(accounts[0], ethers.utils.parseEther(amountWithdraw));
        await withdraw.wait();
        setAmountWithdraw('');
        getBalance();
        setSuccess('Successfuly withdrawn money into the wallet !'); 

      } catch (err) {
        setError("Error while withdraw");
      }
    }
  }

  return (
    <div className="App">
      <div className="container">
      <div className="logo">
          <i className="fab fa-ethereum"></i>
        </div>
        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>{success}</p>}
        <h2>{balance / 10**18} eth</h2>
        <div className='wallet__flex'>
          <div className="walletG">
            <h3>Send Ether</h3>
            <input type="text" placeholder="Amount in ETH" onChange={changeAmountSend} />
            <button onClick={transfer}>Send</button>
          </div>
          <div className="walletD">
            <h3>Withdraw Ether</h3>
            <input type="text" placeholder="Amount in ETH" onChange={changeAmountWithdraw} />
            <button onClick={withdraw}>Withdraw</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
