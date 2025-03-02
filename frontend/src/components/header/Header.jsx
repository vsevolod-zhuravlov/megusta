import styles from './Header.module.scss'
import logo from "../../assets/logo.svg"
import { useEffect, useContext } from 'react'
import { Link } from "react-router-dom"
import { Context } from "../../App"
import ConnectButton from '../ConnectButton'

function Header() {
    const [globalState] = useContext(Context)

    return (
        <div className={styles["header"]}>
            <div className={styles["header__container"]}>
                <Link to="/" className={styles["header__logo"]}>
                    <img src={logo} alt="Logo" />
                </Link>
                {globalState.selectedAccount ? 
                    <div className={styles["header-profile"]}>
                        <Link to="/profile" className={styles["header-profile__icon"]}></Link>
                    </div> :
                    <ConnectButton />
                }
            </div>
        </div>
    )
}

export default Header