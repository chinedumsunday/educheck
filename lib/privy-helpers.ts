import { BrowserProvider } from "ethers"

export const getEthereumProviderFromPrivy = async (walletClient: any): Promise<BrowserProvider> => {
  if (!walletClient) {
    throw new Error("Wallet client not available")
  }

  try {
    const provider = await walletClient.getEthereumProvider()

    // Optionally check if it's OP Sepolia
    const chainId = await provider.request({ method: "eth_chainId" })
    if (chainId !== "0xaa37dc") {
      console.warn("⚠️ Wallet not connected to OP Sepolia (chainId 0xaa37dc)")
    }

    return new BrowserProvider(provider)
  } catch (error) {
    console.error("Error getting Ethereum provider from Privy:", error)
    throw error
  }
}
