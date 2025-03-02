import styles from './ConnectWallet.module.scss'
import NetworkErrorMessage from "../networkError/NetworkErrorMessage"
import ConnectButton from '../ConnectButton'
import { useContext } from "react"
import { Context } from '../../App'

function ConnectWallet() {
    const [globalState, setGlobalState] = useContext(Context)

    const networkError = globalState.networkError

    function dismissNetworkError() {
        setGlobalState({
            ...globalState,
            networkError: null
        })
    }

    return (
        <div className={styles["connect-wallet__container"]}>
            {networkError && (
                <NetworkErrorMessage
                    message={networkError}
                    dismiss={dismissNetworkError}
                />
            )}
            <div className={styles["connect-wallet__content"]}>
                <h1 className={styles["connect-wallet__title"]}>Me gusta Ethereum, <br></br>me gustas NFT</h1>
                <p className={styles["connect-wallet__text"]}>Please, connect your wallet in Sepolia Network</p>
                <ConnectButton />
            </div>
        </div>
    )
}

export default ConnectWallet