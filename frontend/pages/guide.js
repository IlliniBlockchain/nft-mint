import { utils } from 'ethers'
import Head from 'next/head'
import Link from 'next/link'
import { useImperativeHandle } from 'react'
import Layout from '../components/layout'
import Section from '../components/section'
import styles from '../styles/Guide.module.css'
import utilStyles from '../styles/utils.module.css'

export default function Guide() {
  return (
    <Layout>
      <Head>
        <title>Illini Blockchain NFT Guide</title>
        <meta name="description" content="Guide to manually mint an Illini Blockchain NFT." />
      </Head>

      <Section className={utilStyles.bgOrange + " " + utilStyles.topSection}>
        <h1 className={utilStyles.centerHeader}>Illini Blockchain NFT Guide</h1>
        <p>
          Welcome to our guide on how to mint an NFT through
          interacting with our smart contract. This is meant to give you a
          better understanding of the underlying mechanisms that allow an
          NFT to end up in your wallet.
        </p>
        <p>
          If you want to mint an NFT the easiest way possible,
          you can do so through our dapp <Link href="/">here</Link>.
        </p>
        <div style={{display: "flex"}}>
          <Link href="/" ><button style={{margin: "0 auto"}}> EASY Mode</button></Link>
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
          If you lose your key, you lose the all the funds in the wallet... forever. Don't worry though, with 
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
        <p className={utilStyles.bold}>
          If you're at the event in person, drop you're public address <a href="https://docs.google.com/forms/d/e/1FAIpQLSf5FDQLbP-0saEyaRqE7uq5taF_CQQn_KITPQWt_BdYT1N7Ug/viewform" target="_blank">here</a> and we'll air drop you
          some ether.
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

      </Section>


      <Section className={utilStyles.bgOrange}>
        <h2>Step 3: Visit our smart contract on Etherscan</h2>
        <p>
          Etherscan is your best friend when it comes to seeing transactions, contracts, and accounts on Ethereum. Etherscan
          is a block explorer for Ethereum. Anytime you submit a transaction or deploy a smart contract,
          you can view all the details on this website. Essentially, it's a pretty interface for anyone 
          to view any and all activity on the network. We'll be unpacking the Illini Blockchain NFT
          smart contract using this powerful tool.
        </p>
        <p>
          Let's take a visit to our contract <a href="https://rinkeby.etherscan.io/address/0xfeD2cdE438AB93f6CbcceCfD5BE88Fe48a7f664D#code" target="_blank">here</a>.
        </p>
      </Section>

      <Section className={utilStyles.bgBlue}>
        <h2>Step 4: Read the Contract</h2>
        <p>
          Let's unpack the contract a little...
        </p>
        <p>
          If you're not interested in reading or understanding how the code works, don't worry!
          You can skip to step 5 if you still want to learn how to interact with the contract directly.
        </p>
        <p>
          Where the actual "art" of the NFT is created is in the file "myNFT.sol", 
          here you can see a few import statements, some constants, and the contract's constructor.
          The contract maintains a count of how many NFTs have been created, a limit of how many can be
          created, and some basic structure for the NFT art, created as an SVG.
        </p>
        <p>
          This contract extends the ERC721 standard, which is a standard for how NFTs are created.
          ERC721 is like a template for NFTs across the Ethereum network, meaning they all have a few basic
          functions and characteristics that are common across all NFTs.
        </p>
        <p>
          NFTs have a function called something along the lines of "mint" or "claim" which allows you to create a new NFT.
          The function in our contract is called "mintNFT", and it takes a single parameter, which is an address of the recipient of the NFT.
          Within the function, a few basic things are happening. The contract increments the count of how many NFTs have been minted (tokenID), assembles
          the NFT art with the tokenID, encodes the data of the SVG plus some metadata into JSON format to form the token's unique identifier,
          and sends the NFT to the recipient.
        </p>
      </Section>


      <Section className={utilStyles.bgPurple}>
        <h2>Step 5: Mint an NFT</h2>
        <p>
          Now that we've read the code and verified that it does what we promised it would do,
          it's time to actually create an NFT.
        </p>
        <p>
          Go ahead over to "Write Contract", here we can see all the functions the contract has in a nicely packaged format.
          Connect your wallet using "Connect with web3". This allows us to use the contract's functions with our wallet.
          We'll be using the "mintNFT" function, which takes a single parameter, the address of the recipient of the NFT.
          You can find your address by opening up the Metamask chrome extension and clicking the "Account" button.
          This address is known as the public address anyone can use to send you tokens on the network. 
        </p>
        <p>
          Paste this address into the mintNFT function, and click write. You'll see a request for a transaction being sent 
          to the network in a little window. Go ahead and approve the transaction. There's some basic information about how much 
          the transaction will cost, aka "gas fees." This is essentially how much it costs to run this piece of code. A complex contract
          or large transaction may require a lot of "gas". This is computed similarly to the gas you pay for your car.
        </p>
        <p>
        (amount of gas) * (price of gas) = total cost of transaction
        </p>
        <p>
          The price of gas is determined by the network, similar to how prices of gas depend on how much people want gas and how much gas is available.
          In the case of Ethereum, you can think of gas as computing and storage needed.
        </p>
        <p>
          Once you approve the transaction, you'll see a button to view the transaction in Etherscan. This allows you to check the status and details of the transaction.
        </p>
      </Section>
      <Section className={utilStyles.bgOrange}>
        <h2>Step 6: View NFT on Opensea</h2>
        <p> Congrats, you've now minted your first "fake" NFT! But wait, how do you see it?</p>
        <p> 
          There's no way to view NFTs on Etherscan (for now...), so we'll take a visit to <a href="https://testnets.opensea.io/" target="_blank"> OpenSea </a> to view it.
          Enter the same address you entered before in the search bar (don't click search yet!), you'll see a little dropdown with your address under "Accounts" -- click on that! This will take 
          you to a page with all of your NFTs. Hopefully you'll be able to see your new NFT!
        </p>
        <p>
          If you see your NFT, but don't see the artwork yet, don't fret! It takes a few minutes for the artwork to appear. Once you've waited a few minutes,
          refresh the page. You should see your NFT!
        </p>
      </Section>

      <Section className={utilStyles.bgBlue + " " + utilStyles.bottomSection}>
        <h2>Conclusion</h2>
        <p>
          Congrats! You've taken the first step towards breaking into blockchain! If you're looking for next steps
          or just want to learn more, check out our website (coming soon).
        </p>
      </Section>

    </Layout>
      
  )
}
