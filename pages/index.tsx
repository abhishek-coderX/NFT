import { useContract, useNFTs, useAddress, useValidDirectListings } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS, MARKETPLACE_ADDRESS } from "../const/addresses";
import NFTCard from "../components/NFTCard";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
  const { data: nfts, isLoading } = useNFTs(contract);
  const address = useAddress();
  const [processedNFTs, setProcessedNFTs] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!nfts || !marketplace) return;

    const processNFTs = async () => {
      setIsProcessing(true);
      try {
        const listings = await marketplace.directListings.getAll({
          tokenContract: NFT_COLLECTION_ADDRESS,
        });

        // Process all NFTs to include listing status and ownership information
        const enhancedNFTs = nfts.map(nft => {
          // Find matching listing for this NFT
          const listing = listings.find(listing => 
            listing.tokenId === nft.metadata.id
          );
          
          // Check if the NFT is owned by current user
          const isOwner = nft.owner === address;
          
          // Return enhanced NFT object with additional properties
          return {
            ...nft,
            isListed: !!listing,
            isOwner,
            listing
          };
        });

        setProcessedNFTs(enhancedNFTs);
      } catch (error) {
        console.error("Error processing NFTs:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    processNFTs();
  }, [nfts, marketplace, address]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>NFT Gallery</h1>
            <p className={styles.subtitle}>
              Discover and collect unique digital assets
            </p>
          </div>
          <Link href="/sell" className={styles.sellButton}>
            Sell Your NFT
          </Link>
        </div>

        <div className={styles.grid}>
          {isLoading || isProcessing ? (
            <p>Loading NFTs...</p>
          ) : processedNFTs.length === 0 ? (
            <p>No NFTs found</p>
          ) : (
            processedNFTs.map((nft) => (
              <NFTCard 
                key={nft.metadata.id} 
                nft={nft} 
                isListed={nft.isListed}
                isOwner={nft.isOwner}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
