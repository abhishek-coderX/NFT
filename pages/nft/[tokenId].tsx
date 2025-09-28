import { ThirdwebNftMedia, Web3Button, useContract, useNFT, useValidDirectListings, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { NFT_COLLECTION_ADDRESS, MARKETPLACE_ADDRESS } from "../../const/addresses";
import styles from "../../styles/NFTDetail.module.css";
import { useEffect, useState } from "react";

export default function NFTDetails() {
  const router = useRouter();
  const { tokenId } = router.query;
  const address = useAddress();

  const { contract: nftContract } = useContract(NFT_COLLECTION_ADDRESS);
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
  const { data: nft, isLoading } = useNFT(nftContract, tokenId as string);
  
  const { data: directListing, isLoading: loadingDirectListing } = 
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS, 
      tokenId: tokenId as string,
    });

  // Generate fixed price between 0.001 and 0.003 ETH based on tokenId
  const [displayPrice, setDisplayPrice] = useState<string>("0.001");
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    if (tokenId) {
      // Generate a consistent price based on tokenId
      const tokenIdNum = parseInt(tokenId as string);
      const priceRange = 0.002; // Difference between max and min (0.003 - 0.001)
      const offset = (tokenIdNum % 100) / 100; // Use tokenId to generate a value between 0-1
      const price = 0.001 + (offset * priceRange);
      setDisplayPrice(price.toFixed(3));
    }
  }, [tokenId]);

  useEffect(() => {
    if (nft && address) {
      setIsOwner(nft.owner === address);
    }
  }, [nft, address]);

  async function buyNFT() {
    if (!directListing || directListing.length === 0) {
      alert("This NFT is not for sale yet. Please check back later or list it yourself!");
      return;
    }
    
    try {
      // Execute the actual purchase using the marketplace contract
      await marketplace?.directListings.buyFromListing(
        directListing[0].id,
        1
      );
      alert("Successfully purchased NFT!");
      router.push("/profile");
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert("Error buying NFT. See console for details.");
    }
  }

  if (isLoading) {
    return <div className={styles.container}><div className={styles.loading}>Loading NFT details...</div></div>;
  }

  if (!nft) {
    return <div className={styles.container}><div className={styles.error}>NFT not found</div></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <ThirdwebNftMedia 
            metadata={nft.metadata} 
            className={styles.image}
          />
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{nft.metadata.name}</h1>
          
          <div className={styles.tokenId}>Token ID: #{nft.metadata.id}</div>
          
          <p className={styles.description}>{nft.metadata.description}</p>

          <div className={styles.priceSection}>
            <div className={styles.price}>
              <span className={styles.priceLabel}>Price:</span>
              <span className={styles.priceValue}>
                {displayPrice} ETH
              </span>
            </div>

            <Web3Button
              contractAddress={MARKETPLACE_ADDRESS}
              action={buyNFT}
              isDisabled={isOwner || !directListing || directListing.length === 0}
              className={styles.buyButton}
            >
              {isOwner ? "You Own This NFT" : directListing && directListing.length > 0 ? "Buy Now" : "Not For Sale"}
            </Web3Button>
          </div>
        </div>
      </div>
    </div>
  );
} 