import type {NFT as NFTType } from "@thirdweb-dev/sdk";
import React from "react";
import NFT from "./NFT";
import Link from "next/link";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import styles from "../styles/NFTGrid.module.css";

type Props = {
    isLoading: boolean;
    data: NFTType[] | undefined;
    overrideOnclickBehavior?: (nft: NFTType) => void;
    emptyText?: string;
};

export default function NFTGrid({
    isLoading,
    data,
    overrideOnclickBehavior,
    emptyText = "No NFTs found",
}: Props) {
    return (
        <div className={styles.grid}>
            {isLoading ? (
                [...Array(20)].map((_, index) => (
                    <div key={index} className={styles.skeleton}></div>
                ))
            ) : data && data.length > 0 ? (
                data.map((nft) => 
                    !overrideOnclickBehavior ? (
                        <Link
                            href={`/nft/${nft.metadata.id}`}
                            key={nft.metadata.id}
                            className={styles.link}
                        >
                            <NFT nft={nft} />
                        </Link>
                    ) : (
                        <div
                            key={nft.metadata.id}
                            onClick={() => overrideOnclickBehavior(nft)}
                            className={styles.clickable}
                        >
                            <NFT nft={nft} />
                        </div>
                    ))
            ) : (
                <p className={styles.emptyText}>{emptyText}</p>
            )}
        </div>
        
    )
}