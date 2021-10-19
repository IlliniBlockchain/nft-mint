import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import MetaMaskOnboarding from '@metamask/onboarding'
import { ethers } from "ethers"

export default function Home() {

  const [ metaMaskInstalled, setMetaMaskInstalled ] = useState(false);
  const [ pendingConnect, setPendingConnect ] = useState(false);
  const [ pendingMint, setPendingMint ] = useState(false);
  const [ minted, setMinted ] = useState(false);
  const [ provider, setProvider ] = useState(null);
  const [ signer, setSigner ] = useState(null);

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };


  const onClickInstall = () => {
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    // onboardButton.innerText = 'Onboarding in progress';
    // onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      setPendingConnect(true);
      const providerTemp = new ethers.providers.Web3Provider(window.ethereum);

      // test requests
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log(accounts);
      const balance = await providerTemp.getBalance("ethers.eth");
      console.log(balance);

      setProvider(providerTemp);

      setPendingConnect(false);

      // The Metamask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      const signerTemp = providerTemp.getSigner();
      setSigner(signerTemp);
      const account = await signerTemp.getAddress();
      console.log(account);

    } catch (error) {
      console.error(error);
    }
  };

  const onClickMint = async () => {
    const mintAddress = "0xfeD2cdE438AB93f6CbcceCfD5BE88Fe48a7f664D";

    // The ERC-20 Contract ABI, which is a common contract interface
    // for tokens (this is the Human-Readable ABI format)
    const mintAbi = [
      "function mintNFT(address recipient) public returns(uint256)"
    ];

    // The Contract object
    const mintContract = new ethers.Contract(mintAddress, mintAbi, provider);

    const mintWithSigner = mintContract.connect(signer);

    // Send 1 DAI to "ricmoo.firefly.eth"

    const account = await signer.getAddress();
    const tx = await mintWithSigner.mintNFT(account);
    setPendingMint(true);
    await tx.wait();
    setPendingMint(false);
    setMinted(true);


  };

  useEffect(() => {
    setMetaMaskInstalled(isMetaMaskInstalled());

  }, []);

  return (
    <Layout>
      <Head>
        <title>Illini Blockchain NFT Mint</title>
        <meta name="description" content="Dapp interface for people to mint an Illini Blockchain NFT." />
      </Head>

      <div className={styles.header}>
        <h1>Illini Blockchain NFT Mint</h1>
        <p>Welcome to the Illini Blockchain NFT Mint!</p>
        <p>
          See what goes on under the hood by reading <Link href="/guide">our guide</Link> on minting
          an NFT by interacting with the contract itself.
        </p>
        <p>
          To mint your NFT, 1) connect your wallet 2) mint the NFT
          and then 3) view your NFT on an NFT marketplace. The following
          directions will walk you through the process.
        </p>
      </div>
      {/*
      1. connect wallet
      1.5 get
      2. mint dapp
      3. see your nft on opensea
      */}
      <div className={styles.createwalletBox}>
        <h2>
          Create a wallet
        </h2>
        <p>
          You can create a MetaMask Ethereum wallet <a href="https://metamask.io/" target="_blank">here</a>.
        </p>
      </div>

      <div className={styles.connectwalletBox}>
        <h2>
          Get some ETH
        </h2>
        <p>
          To mint an NFT, you have to send a transaction. All transactions
          on Ethereum require a gas fee. If you just opened your wallet,
          you won't have any/enough ETH to pay the gas fee for the transaction.
          Because we're on the test network, you can get some ETH for free
          through a faucet although recently many of them have been down. The other option
          is to find someone with some ETH and ask for some. Feel free to find your own faucet, but
          for convenience here are some options:
        </p>

        <ul>
          <li>
            <a href="https://testnet.help/en/ethfaucet/rinkeby">
              Ethereum Rinkeby Testnet Faucet
            </a>
          </li>
          <li>
            <a href="http://rinkeby-faucet.com/">
              Rinkeby Ether Faucet
            </a>
            - only 0.001 ETH
          </li>
          <li>
            <a href="https://rinkeby.faucet.epirus.io/#">
              Web3 Labs Rinkeby Faucet
            </a>
          </li>
          <li>
            <a href="https://faucet.rinkeby.io/">
              Rinkeby Authenticated Faucet
            </a>
            - requires social account
          </li>
        </ul>
        is the easiest, although won't give you enough. <a href="https://testnet.help/en/ethfaucet/rinkeby">
        </a>
      </div>

      <div className={styles.connectwalletBox}>
        <h2>
          Connect your wallet
        </h2>
        <button onClick={metaMaskInstalled ? onClickConnect : onClickInstall}>
          {
            metaMaskInstalled
            ?
            (pendingConnect ? "Pending" : "Connect wallet")
            :
            "Install MetaMask"
          }
        </button>
        {
          provider !== null
          &&
          <p>Connected</p>
        }
      </div>

      <div className={styles.mintBox}>
        <h2>
          Mint an NFT
        </h2>
        <button onClick={onClickMint}>
          Mint NFT
        </button>
        {
          pendingMint
          &&
          <p>Sent transaction. Waiting for transaction...</p>
        }
        {
          minted
          &&
          <p>Minted</p>
        }
      </div>

      <div className={styles.openseaBox}>
        <h2>
          See your NFT
        </h2>
        <p>
          OpenSea is a popular NFT marketplace for the Ethereum network.
          As of now this app mints NFTs on the Rinkeby test network.
          You can view your NFT by going to <a href="https://testnets.opensea.io" target="_blank">testnets.opensea.io</a> and
          searching up your wallet's public key.
        </p>
      </div>

    </Layout>
      
  )
}
