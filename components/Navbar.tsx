import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Navbar.module.css";

export function Navbar() {
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    const disconnect = useDisconnect();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const NavLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
        <Link href={href} className={styles.navLink}>
            {children}
        </Link>
    );

    return (
        <header className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.navContent}>
                    <Link href="/" className={styles.logo}>
                        NFT Marketplace
                    </Link>

                    <nav className={styles.desktopNav}>
                        <NavLink href="/sell">Sell NFT</NavLink>
                        {address ? (
                            <>
                                <NavLink href="/profile">Profile</NavLink>
                                <button 
                                    className={`${styles.button} ${styles.disconnectButton}`}
                                    onClick={() => disconnect()}
                                >
                                    Disconnect
                                </button>
                            </>
                        ) : (
                            <button 
                                className={`${styles.button} ${styles.connectButton}`}
                                onClick={() => connectWithMetamask()}
                            >
                                Connect Wallet
                            </button>
                        )}
                    </nav>

                    <button className={styles.mobileMenuButton} onClick={toggleMenu}>
                        {isOpen ? "✕" : "☰"}
                    </button>
                </div>

                {isOpen && (
                    <div className={styles.mobileNav}>
                        <NavLink href="/sell">Sell NFT</NavLink>
                        {address ? (
                            <>
                                <NavLink href="/profile">Profile</NavLink>
                                <button 
                                    className={`${styles.button} ${styles.disconnectButton}`}
                                    onClick={() => disconnect()}
                                >
                                    Disconnect
                                </button>
                            </>
                        ) : (
                            <button 
                                className={`${styles.button} ${styles.connectButton}`}
                                onClick={() => connectWithMetamask()}
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}