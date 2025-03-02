import { useContext, useEffect, useState } from 'react'
import { Context } from '../../../App'
import styles from './DutchAuctions.module.scss'
import DutchAuctionCard from '../../cards/dutchAuctionCard/DutchAuctionCard'

function DutchAuctions() {
    const [globalState, setGlobalState] = useContext(Context)
    const auctionManager = globalState.dutchAuction
    const [activeAuctions, setActiveAuctions] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const startEvents = await auctionManager.queryFilter(auctionManager.filters.AuctionStarted)
            const startedAuctions = startEvents.map((event) => ({
                contractAddress: event.args.contractAddress,
                tokenId: event.args.tokenId
            }))

            setActiveAuctions(startedAuctions)
        }
        
        fetchData()
    }, [])

    return (
        <>{activeAuctions.map((value, index) => <DutchAuctionCard key={index} tokenId={value.tokenId} contractAddress={value.contractAddress} />)}</>
    )
}

export default DutchAuctions