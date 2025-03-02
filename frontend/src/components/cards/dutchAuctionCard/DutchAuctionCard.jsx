import styles from "./DutchAuctionCard.module.scss"
import { useContext, useEffect, useState } from "react"
import { ethers, toNumber } from "ethers"
import { Context } from "../../../App"
import erc721 from "../../../contracts/erc721.json"

function DutchAuctionCard({ tokenId, contractAddress }) {
    const [globalState] = useContext(Context)
    const auctionsManager = globalState.dutchAuction
    const provider = globalState.provider
    const [price, setPrice] = useState(0)
    const [nftData, setData] = useState({})
    const [endsDate, setEndsDate] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = new ethers.Contract(
                    contractAddress,
                    erc721.abi,
                    await provider.getSigner()
                )

                const uri = await token.tokenURI(tokenId)
                const response = await fetch(uri)
                const data = await response.json()
                setData(data)

                const _auctionData = await auctionsManager.auctions(contractAddress, tokenId)
                const date = new Date(toNumber(_auctionData[3]) * 1000)
                const formattedDate = date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                });

                setEndsDate(formattedDate)
            } catch (error) {
                console.error("Error fetching NFT data:", error)
            }
        };

        const fetchPrice = async () => {
            try {
                const currentPrice = await auctionsManager.getPrice(contractAddress, tokenId)
                setPrice(currentPrice)
            } catch (error) {
                console.error("Error fetching price:", error)
            }
        }

        fetchData()
        fetchPrice()

        const interval = setInterval(fetchPrice, 1000)

        return () => clearInterval(interval)
    }, [contractAddress, tokenId, provider, auctionsManager])

    async function buy() {
        try {
            await auctionsManager.buy(contractAddress, tokenId, {value: price})
        } catch (err) {
            console.error("Error:", err)
        }
    }

    return (
        <div className={styles["dutch-auction-card"]}>
            <div className={styles["dutch-auction-card__image"]}>
                <img src={nftData.image} alt="NFT Image" />
            </div>
            <div className={styles["dutch-auction-card__info"]}>
                <div className={styles["dutch-auction-card__id"]}>{"#" + tokenId}</div>
                <div className={styles["dutch-auction-card__name"]}>{nftData.name}</div>
                <div className={styles["dutch-auction-card__description"]}>{nftData.description}</div>
                <div className={styles["dutch-auction-card__price"]}>Price: {price.toString()} WEI</div>
                <div className={styles["dutch-auction-card__ends"]}>Ends: {endsDate}</div>
                <button onClick={buy} className={styles["dutch-auction-card__button"]}>
                    Buy now
                </button>
            </div>
        </div>
    );
}

export default DutchAuctionCard