import React from "react";
import NFTGrid from "../components/NFTGrid";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import { useContract, useNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Page.module.css";

export default function Buy() {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const { data, isLoading } = useNFTs(contract);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Buy NFTs</h1>
            <p className={styles.description}>Browse and buy NFTs from this collection.</p>
            <NFTGrid 
                isLoading={isLoading} 
                data={data} 
                emptyText={"No NFTs found"}
            />
        </div>
    )
}