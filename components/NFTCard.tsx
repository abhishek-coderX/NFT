import { NFT } from "@thirdweb-dev/sdk";
import Link from "next/link";
import styles from "../styles/NFTCard.module.css";

type Props = {
  nft: NFT;
  isListed?: boolean;
  isOwner?: boolean;
};

export default function NFTCard({ nft, isListed, isOwner }: Props) {
  // Check if the NFT has price information in its listing property
  const price = nft.listing?.currencyValuePerToken?.displayValue;
  const symbol = nft.listing?.currencyValuePerToken?.symbol;
  
  return (
    <Link href={`/nft/${nft.metadata.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={nft.metadata.image || "https://via.placeholder.com/300"}
          alt={nft.metadata.name || "NFT"}
          className={styles.image}
        />
        <span className={styles.badge}>NFT</span>
        
        {isOwner && (
          <span className={`${styles.statusBadge} ${styles.ownedBadge}`}>
            Owned
          </span>
        )}
        
        {!isListed && !isOwner && (
          <span className={`${styles.statusBadge} ${styles.notListedBadge}`}>
            Not for sale
          </span>
        )}
      </div>

      <div className={styles.content}>
        <h4 className={styles.title}>
          {nft.metadata.name}
        </h4>

        <p className={styles.description}>
          {nft.metadata.description}
        </p>

        <div className={styles.footer}>
          <span className={styles.tokenId}>
            Token ID: #{nft.metadata.id}
          </span>
          
          {isListed && price ? (
            <span className={styles.price}>
              {price} {symbol}
            </span>
          ) : (
            <span className={styles.viewBadge}>
              View Details
            </span>
          )}
        </div>
      </div>
    </Link>
  );
} 