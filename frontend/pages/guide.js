import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import styles from '../styles/Guide.module.css'

export default function Guide() {
  return (
    <Layout>
      <Head>
        <title>Illini Blockchain NFT Guide</title>
        <meta name="description" content="Guide to manually mint an Illini Blockchain NFT." />
      </Head>

      <div className={styles.header}>
        <h1>Illini Blockchain NFT Guide</h1>
        <p>
          Welcome to our guide on how to implement an NFT through
          through interacting with our smart contract.
        </p>
        <p>
          If you want to mint an NFT the easiest way possible,
          you can do so through our dapp <Link href="/">here</Link>.
        </p>
      </div>


    </Layout>
      
  )
}
