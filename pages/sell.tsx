import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import React, { useState, useEffect } from "react";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import NFTGrid from "../components/NFTGrid";
import SaleInfo from "../components/SaleInfo";
import styles from "../styles/Page.module.css";
import { useRouter } from "next/router";

export default function Sell() {
    const router = useRouter();
    const { tokenId } = router.query;
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const address = useAddress();
    const { data: ownedNFTs, isLoading } = useOwnedNFTs(contract, address);

    const [selectedNFT, setSelectedNFT] = useState<NFTType>();

    // Pre-select the NFT if tokenId is provided in URL
    useEffect(() => {
        if (tokenId && ownedNFTs) {
            const nft = ownedNFTs.find(nft => nft.metadata.id === tokenId);
            if (nft) {
                setSelectedNFT(nft);
            }
        }
    }, [tokenId, ownedNFTs]);

    if (!address) {
        return (
            <div className={styles.container}>
                <p>Please connect your wallet to sell your NFTs.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sell NFTs</h1>
            <p className={styles.description}>Select which NFT to sell below.</p>

            {!selectedNFT ? (
                <NFTGrid
                    data={ownedNFTs}
                    isLoading={isLoading}
                    overrideOnclickBehavior={(nft) => {
                        setSelectedNFT(nft);
                    }}
                    emptyText={"You don't own any NFTs yet from this collection."}
                />
            ) : (
                <div className={styles.saleContainer}>
                    <div className={styles.saleDetails}>
                        <div className={styles.saleImage}>
                            <ThirdwebNftMedia
                                metadata={selectedNFT.metadata}
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <div className={styles.saleInfo}>
                            <div className={styles.saleHeader}>
                                <h2 className={styles.nftName}>{selectedNFT.metadata.name}</h2>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => {
                                        setSelectedNFT(undefined);
                                    }}
                                >
                                    X
                                </button>
                            </div>
                            <SaleInfo nft={selectedNFT} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}