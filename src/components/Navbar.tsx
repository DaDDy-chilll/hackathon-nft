import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hexagon, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";
import MetaMaskInstructions from "./MetaMaskInstructions";
import { useToast } from "@/hooks/use-toast";
import { NETWORKS, DEFAULT_NETWORK } from "@/config/contract";

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();

  const switchToAmoyTestnet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) return;

      const network = DEFAULT_NETWORK;

      // Try to switch to Amoy testnet
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });

      toast({
        title: "Network Switched! 🎉",
        description: `Switched to ${network.chainName}.`,
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          const network = DEFAULT_NETWORK;
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: network.chainId,
                chainName: network.chainName,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: network.rpcUrls,
                blockExplorerUrls: network.blockExplorerUrls,
              },
            ],
          });

          toast({
            title: "Network Added! 🎉",
            description: `${network.chainName} has been added to MetaMask.`,
          });
        } catch (addError: any) {
          toast({
            title: "Failed to Add Network",
            description: addError.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Failed to Switch Network",
          description: switchError.message,
          variant: "destructive",
        });
      }
    }
  };

  const checkAndSwitchNetwork = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) return;

      const chainId = await ethereum.request({ method: "eth_chainId" });
      const chainIdNum = parseInt(chainId, 16);

      // Check if not on Amoy testnet (80002)
      if (chainIdNum !== 80002) {
        await switchToAmoyTestnet();
      }
    } catch (error) {
      console.error("Network check failed:", error);
    }
  };

  const handleConnectWallet = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      setShowInstructions(true);
      return;
    }

    // Connect to MetaMask
    const injectedConnector = connectors.find((c) => c.id === "injected");
    if (injectedConnector) {
      connect(
        { connector: injectedConnector },
        {
          onSuccess: async () => {
            toast({
              title: "Wallet Connected! 🎉",
              description: "Your MetaMask wallet is now connected.",
            });
            
            // Check and switch to Amoy testnet after connection
            await checkAndSwitchNetwork();
          },
          onError: (error) => {
            toast({
              title: "Connection Failed",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };



   // Listen for network changes
 useEffect(() => {
 const { ethereum } = window as any;
 if (!ethereum) return;
 const handleChainChanged = (chainId: string) => {
 const chainIdNum = parseInt(chainId, 16);
 console.log("Network changed to:", chainIdNum);
 // If not on Amoy testnet, prompt to switch
 if (chainIdNum !== 80002 && isConnected) {
 toast({
 title: "Wrong Network",
 description: `Please switch to ${DEFAULT_NETWORK.chainName}.`,
 variant: "destructive",
 });
 // Auto-switch after a short delay
 setTimeout(() => {
 switchToAmoyTestnet();
 }, 1000);
 }
 };
 ethereum.on("chainChanged", handleChainChanged);
 // Cleanup
 return () => {
 if (ethereum.removeListener) {
 ethereum.removeListener("chainChanged", handleChainChanged);
 }
 };
 }, [isConnected]);
 // Check network on mount if already connected
 useEffect(() => {
 if (isConnected) {
 checkAndSwitchNetwork();
 }
 }, [isConnected]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Hexagon className="w-8 h-8 text-primary group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-2xl font-bold gradient-text">HackNFT</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/projects" className="text-foreground/80 hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link to="/submit" className="text-foreground/80 hover:text-foreground transition-colors">
              Submit Project
            </Link>
            {isConnected && (
              <Link to="/my-nfts" className="text-foreground/80 hover:text-foreground transition-colors">
                My NFTs
              </Link>
            )}
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          {isConnected && address ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{formatAddress(address)}</span>
              </div>
              <Button variant="outline" size="lg" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button variant="hero" size="lg" onClick={handleConnectWallet}>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      <MetaMaskInstructions 
        open={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />
    </nav>
  );
};

export default Navbar;
