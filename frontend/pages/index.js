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
          We built this simple web app to make it easy for anyone interested in blockchain
          to get involved and start playing with the technology. This page will walk you through
          the process of opening an Ethereum wallet and minting your very own Illini Blockchain NFT.
          We've done our best to design this so that you don't need to know much about blockchain
          to jump right in.
        </p>
        <p>
          See what goes on under the hood by reading <Link href="/guide">our guide</Link> on minting
          an NFT by interacting with the contract itself. And to learn more about blockchain in general,
          see our website (coming soon).
        </p>
      </div>

      <div className={styles.createwalletBox}>
        <h2>
          1. Create a wallet
        </h2>
        <p>
          To interact with a blockchain, you need some sort of address/client to send transactions from.
          This is the basic function of a wallet. When you open a wallet, you'll get a public and private
          key pair. The public key is your public address, and your private key is something you can
          use to prove that you're the owner of your public key. The actual "wallet" itself is just a
          piece of software to 1) generate your public and private key 2) display information associated
          with your keys and 3) send transactions and interact with the blockchain using your keys.
        </p>
        <p>
          For this guide, we're going to be using the MetaMask wallet. It's a popular Ethereum wallet that
          works as a browser extension and a mobile app that makes it easy to interact with web
          apps like this one.
        </p>
        <p>
          You can create a MetaMask Ethereum wallet <a href="https://metamask.io/" target="_blank">here</a>.
        </p>
      </div>

      <div className={styles.connectwalletBox}>
        <h2>
          2. Get some ETH
        </h2>
        <p>
          Any interaction on the blockchain is referred to as a "transaction." To make a transaction
          you have to pay a "gas fee" in the network's native token, with Ethereum's being ETH, aka ether.
          When we mint an NFT later in this tutorial, we'll need some ether to pay for the gas fee.
          If you've just opened your wallet for the first time, you won't have any ether to pay for the fee.
        </p>
        <p>
          Because this is just a tutorial, we'll be working on a test network called Rinkeby. On a testnet,
          everything will function exactly the same, except that we won't have to use real money.
          You can get ether for free on testnets by using a faucet.
        </p>
        <p>
          To use a faucet, all you need to do is go to your MetaMask wallet and retrieve your public key
          and provide it to the faucet so it can send you some ether. We've listed a few faucets right below:
        </p>
        <ul>
          <li>
            <a href="https://testnet.help/en/ethfaucet/rinkeby" target="_blank">
              Ethereum Rinkeby Testnet Faucet
            </a>
          </li>
          <li>
            <a href="http://rinkeby-faucet.com/" target="_blank">
              Rinkeby Ether Faucet
            </a>
            - only 0.001 ETH
          </li>
          <li>
            <a href="https://faucet.rinkeby.io/" target="_blank">
              Rinkeby Authenticated Faucet
            </a>
            - requires social account
          </li>
        </ul>
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
