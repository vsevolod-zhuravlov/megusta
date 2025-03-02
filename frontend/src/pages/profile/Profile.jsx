import styles from './Profile.module.scss';
import { useContext, useEffect } from "react"
import { Context } from "../../App"
import { useState } from "react"

import MyNftCard from '../../components/cards/myNftCard/MyNftCard';

export function Profile() {
    const [globalState, setGlobalState] = useContext(Context)
    const selectedAccount = globalState.selectedAccount
    const [isLoading, setIsLoading] = useState(true)
    const [nfts, setNfts] = useState()

    useEffect(() => {
        const fetchNfts = async () => {
            const params = new URLSearchParams({
                address: selectedAccount
            })
            
            fetch(`https://holy-glynnis-kharkivski-16bd7afb.koyeb.app/get-nfts?${params.toString()}`)
                .then((response) => response.json())
                .then((data) => {
                    setNfts(data)
                    setIsLoading(false)
                })
                .catch(error => console.error("Error:", error))
        }
    
        
        fetchNfts()
    }, [selectedAccount])   

    return (
        <div className={styles["profile"]}>
            <div className={styles["profile__container"]}>
                <div className={styles["profile__header"]}>
                    <div className={styles["profile__info"]}>
                        <div className={styles["profile__icon"]}></div>
                        <div className={styles["profile__block"]}>
                            <div className={styles["profile__address"]}>{selectedAccount}</div>
                            <div className={styles["profile__network"]}>Network: Sepolia</div>
                        </div>
                    </div>
                    <div className={styles["profile__text"]}>Explore your NFTs and create auctions:</div>
                </div>
                <div className={styles["profile__content"]}>
                    {
                        isLoading ? 
                        <div className={styles["profile__loading"]}>Loading...</div> :
                        <>{nfts.map((value, index) => <MyNftCard key={index} contractAddress={value.tokenAddress} tokenId={value.tokenID} tokenUri={value.tokenURI}/>)}</>
                    }
                </div>
            </div>
        </div>
    )
}