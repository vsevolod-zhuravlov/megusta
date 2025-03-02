import { useContext } from "react"
import { ethers } from "ethers"
import { Context } from "../App"
import ConnectWallet from "../components/connectWallet/ConnectWallet"
import ActiveAuctions from "../components/activeAuctions/ActiveAuctions"

// const HOLESKY_NETWORK_ID = "17000"
// const HARDHAT_NETWORK_ID = "31337"
const SEPOLIA_NETWORK_ID = "11155111"

export function Home() {
    const [globalState] = useContext(Context)

    const isConnected = globalState.selectedAccount === null || globalState.selectedAccount === undefined

    return (
        <> 
            {isConnected ? <ConnectWallet /> : <ActiveAuctions />}
        </>
    )
}