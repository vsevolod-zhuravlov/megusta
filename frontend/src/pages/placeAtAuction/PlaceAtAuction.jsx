import styles from "./PlaceAtAuction.module.scss"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ethers, ZeroAddress } from "ethers"
import { Context } from "../../App"
import erc721 from "../../contracts/erc721.json"
import erc20 from "../../contracts/erc20.json"
import dutchAuction from "../../contracts/dutchAuction.json"

export function PlaceAtAuction() {
    const [globalState, setGlobalState] = useContext(Context)
    const provider = globalState.provider
    const [nftData, setData] = useState({})
    const [nftContract, setNftContract] = useState()

    const {contractAddress, tokenId} = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const token = new ethers.Contract(
                contractAddress,
                erc721.abi,
                await provider.getSigner()
            )

            setNftContract(token)
            
            const uri = await token.tokenURI(tokenId)

            fetch(uri)
                .then((response) => response.json())
                .then((data) => setData(data))
                .catch(error => console.error("Error:", error))
        }
    
        fetchData()
    }, [])

    const [auctionType, setAuctionType] = useState("dutch")
    const [startingPrice, setStartingPrice] = useState()
    const [duration, setDuration] = useState()
    const [discountRate, setDiscountRate] = useState()
    const [payMethod, setPayMethod] = useState("ether")
    const [isTokenApproved, setIsTokenApproved] = useState(false)

    async function approveToken() {
        try {
            await nftContract.approve(dutchAuction.address, tokenId)
            setIsTokenApproved(true)
        } catch (err) {
            console.error("Error", err)
        }
    }

    async function placeAuction() {
        switch (auctionType) {
            case "dutch":
                const auctionsManager = globalState.dutchAuction
                console.log(auctionsManager)

                if(payMethod == "ether") {
                    await auctionsManager.start(
                        contractAddress,
                        BigInt(tokenId),
                        BigInt(duration),
                        BigInt(discountRate),
                        BigInt(startingPrice),
                        ZeroAddress
                    )
                } else {
                    await auctionsManager.start(
                        contractAddress,
                        BigInt(tokenId),
                        BigInt(duration),
                        BigInt(discountRate),
                        BigInt(startingPrice),
                        erc20.address
                    )
                }

                break
            case "english":
                console.log("Something")
                break
            case "sealed":
                console.log("Nothing")
                break
        }
    }

    return (
        <div className={styles["place-at-auction"]}>
            <div className={styles["place-at-auction__container"]}>
                <div className={styles["place-at-auction__image"]}>
                    <img src={nftData.image} alt="Image" />
                    <div className={styles["nft-info"]}>
                        <div className={styles["nft-info__id"]}>{"#" + tokenId}</div>
                        <div className={styles["nft-info__name"]}>{nftData.name}</div>
                        <div className={styles["nft-info__description"]}>{nftData.description}</div>
                    </div>
                </div>
                <div className={styles["place-at-auction__content"]}>
                    <h2 className={styles["place-at-auction__title"]}>Place NFT at Auction</h2>
                    
                    <div className={styles["place-at-auction__input-group"]}>
                        <label>Auction Type:</label>
                        <select value={auctionType} onChange={(e) => setAuctionType(e.target.value)}>
                            <option value="dutch">Dutch Auction</option>
                            <option value="english">English Auction</option>
                            <option value="sealed">Sealed Bid Auction</option>
                        </select>
                    </div>
                    <div className={styles["place-at-auction__input-group"]}>
                        <label>Starting Price:</label>
                        <input 
                            type="number" 
                            value={startingPrice} 
                            onChange={(e) => setStartingPrice(e.target.value)}
                            disabled={!isTokenApproved}
                        />
                    </div>
                    <div className={styles["place-at-auction__input-group"]}>
                        <label>Duration (seconds):</label>
                        <input 
                            type="number" 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)}
                            disabled={!isTokenApproved}
                        />
                    </div>

                    {auctionType === "dutch" && (
                        <div className={styles["place-at-auction__input-group"]}>
                            <label>Discount rate every second:</label>
                            <input 
                                type="number" 
                                value={discountRate} 
                                onChange={(e) => setDiscountRate(e.target.value)}
                                disabled={!isTokenApproved}
                            />
                        </div>
                    )}

                    <div className={styles["place-at-auction__input-group"]}>
                        <label>Payment Method:</label>
                        <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} disabled={!isTokenApproved}>
                            <option value="ether">Ether (ETH)</option>
                            <option value="token">MockToken (MTK)</option>
                        </select>
                    </div>

                    {/* {auctionType === "english" && (
                        <>
                            <label>Bid Increment:</label>
                            <input 
                                type="number"
                            />
                        </>
                    )} */}

                    {
                        !isTokenApproved ? 
                        <button onClick={approveToken} className={styles["place-at-auction__approve-button"]}>Approve Token</button> :
                        <button onClick={placeAuction} className={styles["place-at-auction__place-button"]}>Place At Auction</button>
                    }
                </div>
            </div>
        </div>
    )
}