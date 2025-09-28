import React, { useState } from "react";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Web3Button, useContract, useCreateDirectListing } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../const/addresses";
import styles from "../styles/SaleInfo.module.css";

type Props = {
    nft: NFTType;
};

type DirectFormData = {
    price: string;
    listingDurationInDays: string;
};

export default function SaleInfo({ nft }: Props) {
    const router = useRouter();
    const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
    const [isApproving, setIsApproving] = useState(false);
    const [isListing, setIsListing] = useState(false);

    const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace);

    const { 
        register: registerDirect, 
        handleSubmit: handleSubmitDirect,
        watch
    } = useForm<DirectFormData>({
        defaultValues: {
            price: "0.001",
            listingDurationInDays: "7",
        },
    });

    // Get values from form
    const price = watch("price");
    const listingDurationInDays = watch("listingDurationInDays");

    async function checkAndProvideApproval() {
        setIsApproving(true);

        try {
            // Check if approval is needed
            const hasApproval = await nftCollection?.call(
                "isApprovedForAll",
                [nft.owner, MARKETPLACE_ADDRESS]
            );

            // If the marketplace isn't approved yet, approve it
            if (!hasApproval) {
                const txResult = await nftCollection?.call(
                    "setApprovalForAll",
                    [MARKETPLACE_ADDRESS, true]
                );
                
                // Wait for approval transaction
                if (txResult) {
                    return true;
                }
            } else {
                // Already approved
                return true;
            }
        } catch (error) {
            console.error("Error checking or providing approval", error);
            alert("Error checking or providing marketplace approval. See console for details.");
            return false;
        } finally {
            setIsApproving(false);
        }
    }

    async function handleSubmitDirectListing(data: DirectFormData) {
        setIsListing(true);
        
        try {
            // Ensure we have approval first
            const hasApproval = await checkAndProvideApproval();
            if (!hasApproval) {
                setIsListing(false);
                return;
            }
            
            // Create the listing with native ETH as currency
            await createDirectListing({
                assetContractAddress: NFT_COLLECTION_ADDRESS,
                tokenId: nft.metadata.id,
                currencyContractAddress: "0x0000000000000000000000000000000000000000", // Native ETH
                pricePerToken: data.price,
                startTimestamp: new Date(),
                endTimestamp: new Date(
                    new Date().getTime() + 
                    parseInt(data.listingDurationInDays) * 24 * 60 * 60 * 1000
                ),
                quantity: 1,
            });

            alert("NFT listed successfully!");
            router.push("/");
        } catch (error) {
            console.error("Error creating listing:", error);
            alert("Error creating listing. See console for details.");
        } finally {
            setIsListing(false);
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Sell Your NFT</h2>
            <form className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Price (ETH)</label>
                    <input 
                        className={styles.input}
                        type="text" 
                        step="0.001"
                        min="0.001"
                        {...registerDirect("price", { required: true })}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Listing Duration (days)</label>
                    <input 
                        className={styles.input}
                        type="number" 
                        min="1"
                        max="30"
                        {...registerDirect("listingDurationInDays", { required: true })}
                    />
                </div>
                <Web3Button
                    contractAddress={MARKETPLACE_ADDRESS}
                    isDisabled={isListing || isApproving}
                    action={async () => {
                        await handleSubmitDirect(handleSubmitDirectListing)();
                    }}
                    className={styles.submitButton}
                >
                    {isApproving ? "Approving..." : isListing ? "Listing..." : "List NFT for Sale"}
                </Web3Button>
            </form>
            <p className={styles.note}>
                Note: You will need to approve the marketplace to transfer your NFT when listing for the first time.
            </p>
        </div>
    );
}