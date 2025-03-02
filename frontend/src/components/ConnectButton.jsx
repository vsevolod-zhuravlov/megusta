import { useContext } from "react"
import { ethers } from "ethers"
import { Context } from "../App"
import dutchAuction from "../contracts/dutchAuction.json"
import englishAuction from "../contracts/englishAuction.json"
import sealedBidAuction from "../contracts/sealedBidAuction.json"

// const HOLESKY_NETWORK_ID = "17000"
// const HARDHAT_NETWORK_ID = "31337"
const SEPOLIA_NETWORK_ID = "11155111"

function ConnectButton() {
    const [globalState, setGlobalState] = useContext(Context)
    
    function _checkNetwork() {
        if (window.ethereum.networkVersion === SEPOLIA_NETWORK_ID) { return true }

        console.error("Wrong network. Connect to Sepolia")

        setGlobalState({
            ...globalState, 
            networkError: "Wrong network. Connect to Sepolia"
        })

        return false
    }

    async function updateBalance(provider, account) {
        try {
            const newBalance = await provider.getBalance(account);
            setGlobalState({
                ...globalState, 
                balance: newBalance
            })
        } catch (error) {
            console.error("Error getting balance: ", error);
        }
    }

    async function _initialize(selectedAccount) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        
        const _dutchAuction = new ethers.Contract(
            dutchAuction.address,
            dutchAuction.abi,
            await provider.getSigner()
        )

        const _englishAuction = new ethers.Contract(
            englishAuction.address,
            englishAuction.abi,
            await provider.getSigner()
        )

        setGlobalState({
            ...globalState,
            provider,
            dutchAuction,
            englishAuction,
            selectedAccount,
        }, await updateBalance(provider, selectedAccount))

        localStorage.setItem("selectedAccount", selectedAccount)
    }

    function _resetState() {
        localStorage.setItem("selectedAccount", null)

        setGlobalState({
            publicProvider: new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com"),
            provider: null,
            dutchAuction: null,
            englishAuction: null,
            sealedBidAuction: null,
            selectedAccount: null,
            networkError: null,
            balance: BigInt(0)
        })
    }

    const connectWallet = async () => {
        if(window.ethereum === undefined) {
            setGlobalState({
                ...globalState, 
                networkError: "Please, install MetaMask!"
            })
            return
        }

        const [selectedAddress] = await window.ethereum.request({
            method: "eth_requestAccounts"
        })

        if(!_checkNetwork()) {
            return
        }

        _initialize(selectedAddress)

        window.ethereum.on("accountsChanged", ([newAddress]) => {
            if(newAddress === undefined) {
                return _resetState()
            }

            _initialize(newAddress)
        })

        window.ethereum.on("chainChanged", () => {
            _resetState()
        })
    }

    return (
        <button className="connect-wallet-button" type="button" onClick={connectWallet}>
            Connect Wallet
        </button>
    )
}

export default ConnectButton;