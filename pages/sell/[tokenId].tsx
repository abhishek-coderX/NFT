import { useRouter } from "next/router";
import { useContract, useNFT, ThirdwebNftMedia } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "../../const/addresses";
import SaleInfo from "../../components/SaleInfo";
import styles from "../../styles/SellPage.module.css";

export default function SellNFTPage() {
  const router = useRouter();
  const { tokenId } = router.query;

  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data: nft, isLoading } = useNFT(contract, tokenId as string);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading NFT details...</div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>NFT not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Sell Your NFT</h1>
          <p className={styles.subtitle}>
            Set your price and listing duration
          </p>
        </div>

        <div className={styles.nftContainer}>
          <div className={styles.nftCard}>
            <div className={styles.imageContainer}>
              <ThirdwebNftMedia 
                metadata={nft.metadata} 
                className={styles.image}
              />
            </div>
            <div className={styles.nftInfo}>
              <h2 className={styles.nftName}>{nft.metadata.name}</h2>
              <p className={styles.tokenId}>Token ID: #{nft.metadata.id}</p>
            </div>
          </div>

          <div className={styles.saleFormContainer}>
            <SaleInfo nft={nft} />
          </div>
        </div>
      </div>
    </div>
  );
} 