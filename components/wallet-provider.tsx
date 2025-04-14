"use client"

import type React from "react"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { BrowserProvider } from "ethers"

interface WalletContextType {
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
  isConnected: boolean
  isConnecting: boolean
  provider: BrowserProvider | null
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
  isConnecting: false,
  provider: null,
})

export const useWallet = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)

  const connect = async () => {
    if (typeof window === "undefined") {
      console.error("Window is undefined")
      return
    }

    if (!window.ethereum) {
      alert("Please install MetaMask or another Ethereum wallet to use this application")
      return
    }

    try {
      setIsConnecting(true)

      const newProvider = new BrowserProvider(window.ethereum)
      await window.ethereum.request({ method: "eth_requestAccounts" })

      const signer = await newProvider.getSigner()
      const address = await signer.getAddress()

      setProvider(newProvider)
      setAddress(address)

      localStorage.setItem("walletConnected", "true")
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setProvider(null)
    localStorage.removeItem("walletConnected")
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === "undefined") return

      const wasConnected = localStorage.getItem("walletConnected") === "true"

      if (wasConnected && window.ethereum) {
        try {
          const newProvider = new BrowserProvider(window.ethereum)
          const accounts = await window.ethereum.request({ method: "eth_accounts" })

          if (accounts && accounts.length > 0) {
            const signer = await newProvider.getSigner()
            const address = await signer.getAddress()

            setProvider(newProvider)
            setAddress(address)
          }
        } catch (error) {
          console.error("Error reconnecting wallet:", error)
        }
      }
    }

    checkConnection()

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAddress(accounts[0])
        }
      })

      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        address,
        connect,
        disconnect,
        isConnected: !!address,
        isConnecting,
        provider,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
