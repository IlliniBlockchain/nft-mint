import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import Section from '../components/section'
import styles from '../styles/Home.module.css'
import utilStyles from '../styles/utils.module.css'
import { useState, useEffect } from 'react'
import MetaMaskOnboarding from '@metamask/onboarding'
import { ethers, utils } from "ethers"

export default function Home() {

  const [ metaMaskInstalled, setMetaMaskInstalled ] = useState(false);
  const [ pendingConnect, setPendingConnect ] = useState(false);
  const [ pendingMint, setPendingMint ] = useState(false);
  const [ minted, setMinted ] = useState(false);
  const [ provider, setProvider ] = useState(null);
  const [ signer, setSigner ] = useState(null);
  const [ txAddr, setTxAddr ] = useState(null);
  const mintAddress = "0xfeD2cdE438AB93f6CbcceCfD5BE88Fe48a7f664D";
  const contractLink = "https://rinkeby.etherscan.io/address/" + mintAddress;

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
    setTxAddr(tx.hash);
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

      <Section className={utilStyles.bgOrange + " " + utilStyles.topSection}>
        <h1 className={utilStyles.centerHeader}>Illini Blockchain NFT Mint</h1>
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
          an NFT by interacting with the <a href={contractLink} target="_blank">contract</a> itself.
          Hard mode is for anyone who wants to get a deeper look into what's going on behind the scenes!
          We encourage you to try it if you're technically savvy or you should definitely try it if you 
          know how to code.
          And to learn more about blockchain in general, see our website (coming soon).
        </p>
        <div style={{display: "flex"}}>
          <Link href="/guide" ><button style={{margin: "0 auto"}}> HARD Mode</button></Link>
        </div>
      </Section>

      <Section className={utilStyles.bgBlue}>
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
        <p>
          You'll be prompted with a 12 word "Secret Recovery Phrase". This is essentially the key to your wallet. 
          Metamask will keep the key for you nicely, and will be protected by the password. Similar to keys in the
          real world, if you lose your key, you no longer have 'access' to what the key opens. So, keep it safe.
          The difference between the real world and a digital wallet, is there is no other way to recover it.
          If you lose your key, you lose all the funds in the wallet... forever. Don't worry though, with 
          Metamask, you likely won't have to worry about it.
        </p>
        <p>
          If you plan on depositing any real ETH into this wallet, we suggest you <b> write this down in an accessible,
          safe, private place you will always have access to.</b> You can also use this phrase to 'import' your wallet into another 
          service other than Metamask in the future if you wish. 
        </p>
      </Section>

      <Section className={utilStyles.bgPurple}>
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
        <p>
          Depending on how much traffic is on
          the network, gas prices will vary. In the past for this tutorial it's required less than 0.01 ether
          to mint an NFT. 
        </p>
        <p>
          Additionally, you'll want to switch your network in Metamask from the Ethereum Mainnet to
          the Rinkeby Test Network. You can do so by going to Metamask and clicking the dropdown at the
          top.
        </p>
        <p className={utilStyles.bold}>
          If you're at the event in person, drop you're public address <a href="https://docs.google.com/forms/d/e/1FAIpQLSf5FDQLbP-0saEyaRqE7uq5taF_CQQn_KITPQWt_BdYT1N7Ug/viewform" target="_blank">here</a> and we'll air drop you
          some ether.
        </p>
      </Section>

      <Section className={utilStyles.bgOrange}>
        <h2>
          3. Connect your wallet
        </h2>
        <p>
          To make the whole process easier, this web app provides buttons that abstract away some of
          the complexity of interacting with the blockchain yourself. For this web app to mint an NFT
          using your wallet, you'll have to grant it permission by connecting your wallet. The button
          below will trigger a pop up that will let you do exactly that.
        </p>
        <button onClick={signer !== null ? (() => {}) : (metaMaskInstalled ? onClickConnect : onClickInstall)}>
          {
            signer !== null
            ?
            "Connected"
            :
            (
            metaMaskInstalled
            ?
            (pendingConnect ? "Pending" : "Connect wallet")
            :
            "Go to step 1 and install MetaMask"
            )
          }
        </button>
      </Section>

      <Section className={utilStyles.bgBlue}>
        <h2>
          4. Mint an NFT
        </h2>
        <p>
          Now it's time to actually mint your NFT! All you have to do is click the button below,
          and this app will send a transaction to our <a>smart contract</a> telling it to create
          a new NFT and place it in your account. It will trigger another popup to make sure
          you want to make the transaction and have enough ether to pay for it.
        </p>
        <button onClick={(!minted && signer !== null) ? onClickMint : (() => {})}>
          {
            minted
            ?
            "Minted"
            :
            (
            pendingMint
            ?
            "Pending transaction..."
            :
            "Mint NFT"
            )
          }
        </button>
        {
          minted
          &&
          (
          <>
          <p>Transaction hash: <a href={"https://rinkeby.etherscan.io/tx/" + txAddr} target="_blank">{txAddr}</a></p>
          </>
          )
        }
      </Section>

      <Section className={utilStyles.bgPurple}>
        <h2>
          5. See your NFT
        </h2>
        <p>
          There are two ways to "see" your NFT.
        </p>
        <p>
          You can verify that your transaction went through by looking
          at our <a href={contractLink} target="_blank">contract</a> on etherscan and seeing your transaction.
          Etherscan is another web app that displays pretty much all data about transactions on the Ethereum network.
          It should show a transaction sent from your public key with same the transaction hash shown in
          the last section after you pressed the mint button.
        </p>
        <p>
          You can actually see your NFT on an NFT marketplace. OpenSea is a popular NFT marketplace for the Ethereum network.
          You can view your NFT by going to <a href="https://testnets.opensea.io" target="_blank">testnets.opensea.io</a> and
          searching up your wallet's public key. Paste your public key into the search bar, and an option
          with your address should come up that you can click. As of writing this you'll need to click that option instead
          of just pressing enter. After this, you should be able to view your newly minted NFT! Don't worry if your NFT doesn't
          show up right away, it may take a couple minutes for it to show up on OpenSea.
        </p>
      </Section>

      <Section className={utilStyles.bgOrange + " " + utilStyles.bottomSection}>
        <h2>Conclusion</h2>
        <p>
          Congrats! You've taken the first step towards breaking into blockchain! If you're looking for next steps
          or just want to learn more, check out our website (coming soon).
        </p>
      </Section>

    </Layout>
      
  )
}
