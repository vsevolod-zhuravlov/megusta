import styles from "./MyNftCard.module.scss"
import { useContext, useEffect } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

function MyNftCard({tokenId, contractAddress, tokenUri}) {
    const [nftData, setData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            
            fetch(tokenUri)
                .then((response) => response.json())
                .then((data) => setData(data))
                .catch(error => console.error("Error:", error))
        }
    
        
        fetchData()
    }, [tokenUri])

    return (
        <div className={styles["my-nft-card"]}>
            <div className={styles["my-nft-card__image"]}>
                <img src={nftData.image} alt="Image" />
            </div>
            <div className={styles["my-nft-card__info"]}>
                <div className={styles["my-nft-card__id"]}>
                    {"#" + tokenId}
                </div>
                <div className={styles["my-nft-card__name"]}>
                    {nftData.name}
                </div>
                <div className={styles["my-nft-card__description"]}>
                    {nftData.description}
                </div>
                <Link to={`/placeAtAuction/${contractAddress}/${tokenId}`} className={styles["my-nft-card__button"]}>
                    Place at auction
                </Link>
            </div>
        </div>
    )
}

export default MyNftCard;