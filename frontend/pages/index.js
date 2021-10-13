import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Illini Blockchain NFT Mint</title>
        <meta name="description" content="Dapp interface for people to mint an Illini Blockchain NFT." />
      </Head>

      <div className={styles.header}>
        <h1>Illini Blockchain NFT Mint</h1>
        <p></p>
        <p>
          See what goes on under the hood by reading <Link href="/guide">our guide</Link> on minting
          an NFT by interacting with the contract itself.
        </p>
      </div>

    </Layout>
      
  )
}
