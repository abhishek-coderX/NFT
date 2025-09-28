import React from "react";
import { NFT } from "@thirdweb-dev/sdk";
import { 
    MARKETPLACE_ADDRESS, 
    NFT_COLLECTION_ADDRESS 
} from "../const/addresses";
import { ThirdwebNftMedia, useContract, useValidDirectListings, useValidEnglishAuctions } from "@thirdweb-dev/react";
import styles from "../styles/NFT.module.css";

type Props = {
    nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
    const {contract: marketplace, isLoading: loadingMarketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

    const { data: directListing, isLoading: loadingDirectListing } = 
        useValidDirectListings(marketplace, {
            tokenContract: NFT_COLLECTION_ADDRESS,
            tokenId: nft.metadata.id,
        });

    //Add for auction section
    const { data: auctionListing, isLoading: loadingAuction} = 
        useValidEnglishAuctions(marketplace, {
            tokenContract: NFT_COLLECTION_ADDRESS,
            tokenId: nft.metadata.id,
        });

    return (
        <div className={styles.nftCard}>
            <div className={styles.mediaContainer}>
                <ThirdwebNftMedia metadata={nft.metadata} height="100%" width="100%" />
            </div>
            <div className={styles.tokenId}>Token ID #{nft.metadata.id}</div>
            <div className={styles.name}>{nft.metadata.name}</div>

            <div className={styles.priceContainer}>
                {loadingMarketplace || loadingDirectListing || loadingAuction ? (
                    <div className={styles.loading}></div>
                ) : directListing && directListing[0] ? (
                    <div>
                        <div className={styles.priceLabel}>Price</div>
                        <div className={styles.price}>{`${directListing[0]?.currencyValuePerToken.displayValue} ${directListing[0]?.currencyValuePerToken.symbol}`}</div>
                    </div>
                ) : auctionListing && auctionListing[0] ? (
                    <div>
                        <div className={styles.priceLabel}>Minimum Bid</div>
                        <div className={styles.price}>{`${auctionListing[0]?.minimumBidCurrencyValue.displayValue} ${auctionListing[0]?.minimumBidCurrencyValue.symbol}`}</div>
                    </div>
                ) : (
                    <div>
                        <div className={styles.priceLabel}>Price</div>
                        <div className={styles.price}>Not Listed</div>
                    </div>
                )}
            </div>
        </div>
    )
}