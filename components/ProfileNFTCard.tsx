import { NFT } from "@thirdweb-dev/sdk";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/ProfileNFTCard.module.css";

type Props = {
  nft: NFT;
};

export default function ProfileNFTCard({ nft }: Props) {
  const router = useRouter();

  const handleSell = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/sell?tokenId=${nft.metadata.id}`);
  };

  return (
    <div className={styles.card}>
      <Link href={`/nft/${nft.metadata.id}`} className={styles.linkContainer}>
        <div className={styles.imageContainer}>
          <img
            src={nft.metadata.image || "https://via.placeholder.com/300"}
            alt={nft.metadata.name || "NFT"}
            className={styles.image}
          />
          <span className={styles.badge}>NFT</span>
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
          </div>
        </div>
      </Link>
      
      <button className={styles.sellButton} onClick={handleSell}>
        Sell NFT
      </button>
    </div>
  );
} 