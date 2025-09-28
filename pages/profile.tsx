import { useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import ProfileNFTCard from "../components/ProfileNFTCard";
import styles from "../styles/Page.module.css";

export default function Profile() {
  const address = useAddress();
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data: ownedNFTs, isLoading } = useOwnedNFTs(contract, address);

  if (!address) {
    return (
      <div className={styles.container}>
        <p>Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h1 className={styles.title}>Your Profile</h1>
        <p className={styles.walletAddress}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your NFTs</h2>
        <div className={styles.grid}>
          {isLoading ? (
            <p>Loading your NFTs...</p>
          ) : ownedNFTs?.length === 0 ? (
            <p>You don't own any NFTs from this collection.</p>
          ) : (
            ownedNFTs?.map((nft) => (
              <ProfileNFTCard key={nft.metadata.id} nft={nft} />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 