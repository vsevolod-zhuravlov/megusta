import { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ethers } from "ethers"
import './App.scss'
import Header from './components/header/Header'
import { Home, Profile, PlaceAtAuction } from "./pages"
import Preloader from "./components/preloader/Preloader"
import _dutchAuction from "./contracts/dutchAuction.json"
import _englishAuction from "./contracts/englishAuction.json"
import sealedBidAuction from "./contracts/sealedBidAuction.json"

const _selectedAccount = localStorage.getItem("selectedAccount")

const initialState = {
  publicProvider: new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com"),
  provider: null,
  dutchAuction: null,
  englishAuction: null,
  sealedBidAuction: null,
  selectedAccount: _selectedAccount,
  networkError: null,
  balance: BigInt(0)
};

export const Context = createContext()

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [globalState, setGlobalState] = useState(initialState)

  useEffect(() => {
    const startLoading = async () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000);

      const selectedAccount = localStorage.getItem("selectedAccount")
      if(selectedAccount) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        
        const dutchAuction = new ethers.Contract(
          _dutchAuction.address,
          _dutchAuction.abi,
          await provider.getSigner()
        )

        const englishAuction = new ethers.Contract(
          _englishAuction.address,
          _englishAuction.abi,
          await provider.getSigner()
        )

        setGlobalState({
          ...globalState,
          provider,
          dutchAuction,
          englishAuction,
          selectedAccount
        })
      }
    }

    startLoading()
  }, [])

  function _resetState() {
    setGlobalState(initialState)
  }

  return (
    <Router>
      {isLoading ? <Preloader /> : 
        <Context.Provider value={[globalState, setGlobalState]}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/placeAtAuction/:contractAddress/:tokenId" element={<PlaceAtAuction />}/>
            {/* <Route path="/projects/:projectAddress" element={<FullProject />}/>
            <Route path="/projects/:projectAddress/create-task" element={<CreateTask />}/> */}
          </Routes>
        </Context.Provider>
      }
    </Router>
  )
}

export default App