import { MediaRenderer, ThirdwebNftMedia, Web3Button, useContract, useValidDirectListings } from "@thirdweb-dev/react";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import React from "react";
import { 
    MARKETPLACE_ADDRESS,
    NFT_COLLECTION_ADDRESS 
} from "../../../const/addresses";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import styles from "../../../styles/Token.module.css";

type Props = {
    nft: NFT;
    contractMetadata: any;
};

export default function TokenPage({ nft, contractMetadata }: Props) {
    const { contract: marketplace } = 
        useContract(
            MARKETPLACE_ADDRESS, 
            "marketplace-v3"
        );

    const { data: directListing, isLoading: loadingDirectListing } = 
        useValidDirectListings(marketplace, {
            tokenContract: NFT_COLLECTION_ADDRESS, 
            tokenId: nft.metadata.id,
        });

    async function buyListing() {
        if (!directListing || !directListing[0]) {
            alert("This NFT is not for sale");
            return;
        }

        try {
            const txResult = await marketplace?.directListings.buyFromListing(
                directListing[0].id,
                1
            );
            return txResult;
        } catch (error) {
            console.error("Error buying listing:", error);
            alert("Error buying NFT. See console for details.");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.tokenDetails}>
                <div className={styles.imageContainer}>
                    <ThirdwebNftMedia
                        metadata={nft.metadata}
                        className={styles.image}
                    />
                </div>
                
                <div className={styles.infoContainer}>
                    {contractMetadata && (
                        <div className={styles.collectionInfo}>
                            {contractMetadata.image && (
                                <MediaRenderer
                                    src={contractMetadata.image}
                                    className={styles.collectionImage}
                                />
                            )}
                            <span className={styles.collectionName}>{contractMetadata.name}</span>
                        </div>
                    )}
                    
                    <h1 className={styles.title}>{nft.metadata.name}</h1>
                    
                    <Link href={`/profile/${nft.owner}`} className={styles.ownerLink}>
                        <span className={styles.owner}>
                            Owned by: {nft.owner.slice(0,6)}...{nft.owner.slice(-4)}
                        </span>
                    </Link>
                    
                    <div className={styles.priceContainer}>
                        <p className={styles.priceLabel}>Price:</p>
                        {loadingDirectListing ? (
                            <div className={styles.loading}>Loading price...</div>
                        ) : directListing && directListing[0] ? (
                            <p className={styles.price}>
                                {directListing[0]?.currencyValuePerToken.displayValue}
                                {" " + directListing[0]?.currencyValuePerToken.symbol}
                            </p>
                        ) : (
                            <p className={styles.notForSale}>Not for sale</p>
                        )}
                    </div>

                    <div className={styles.buyButton}>
                        <Web3Button
                            contractAddress={MARKETPLACE_ADDRESS}
                            action={buyListing}
                            isDisabled={!directListing || !directListing[0]}
                        >
                            Buy Now
                        </Web3Button>
                    </div>
                    
                    <div className={styles.description}>
                        <h2 className={styles.sectionTitle}>Description</h2>
                        <p>{nft.metadata.description}</p>
                    </div>
                    
                    {nft?.metadata?.attributes && Object.keys(nft.metadata.attributes).length > 0 && (
                        <div className={styles.traitsContainer}>
                            <h2 className={styles.sectionTitle}>Properties</h2>
                            <div className={styles.traits}>
                                {Object.entries(nft.metadata.attributes).map(
                                    ([key, value]) => (
                                        <div key={key} className={styles.trait}>
                                            <p className={styles.traitType}>{value.trait_type}</p>
                                            <p className={styles.traitValue}>{value.value}</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    const tokenId = context.params?.tokenId as string;
  
    const sdk = new ThirdwebSDK("sepolia");
  
    const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
  
    const nft = await contract.erc721.get(tokenId);
  
    let contractMetadata;
  
    try {
      contractMetadata = await contract.metadata.get();
    } catch (e) {}
  
    return {
      props: {
        nft,
        contractMetadata: contractMetadata || null,
      },
      revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const sdk = new ThirdwebSDK("sepolia");
  
    const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
  
    const nfts = await contract.erc721.getAll();
  
    const paths = nfts.map((nft) => {
      return {
        params: {
          contractAddress: NFT_COLLECTION_ADDRESS,
          tokenId: nft.metadata.id,
        },
      };
    });
  
    return {
      paths,
      fallback: "blocking", // can also be true or 'blocking'
    };
};