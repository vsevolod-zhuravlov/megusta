import { useState, useContext } from "react"
import styles from "./ActiveAuctions.module.scss"
import { Context } from "../../App"

import DutchAuctions from "../auctions/dutchAuctions/DutchAuctions"
import EnglishAuctions from "../auctions/englishAuctions/EnglishAuctions"
import SealedBidAuctions from "../auctions/sealedBidAuctions/SealedBidAuctions"

function ActiveAuctions() {
    const [auctionType, setAuctionsType] = useState("dutch")

    const selectAuctions = (type) => setAuctionsType(type)

    return (
        <div className={styles["active-auctions"]}>
            <div className={styles["active-auctions__container"]}>
                <div className={styles["active-auctions__tabs"]}>
                    <button 
                        className={`${styles["select-dutch-button"]} ${auctionType === "dutch" ? styles["active"] : ""}`}
                        onClick={() => selectAuctions("dutch")}
                    >
                        Dutch
                    </button>
                    <button 
                        className={`${styles["select-english-button"]} ${auctionType === "english" ? styles["active"] : ""}`}
                        onClick={() => selectAuctions("english")}
                    >
                        English
                    </button>
                    <button 
                        className={`${styles["select-sealed-button"]} ${auctionType === "sealed" ? styles["active"] : ""}`}
                        onClick={() => selectAuctions("sealed")}
                    >
                        Sealed
                    </button>
                </div>
                <div className={styles["active-auctions__content"]}>
                    {auctionType === "dutch" && <DutchAuctions />}
                    {auctionType === "english" && <EnglishAuctions />}
                    {auctionType === "sealed" && <SealedBidAuctions />}
                </div>
            </div>
        </div>
    )
}

export default ActiveAuctions