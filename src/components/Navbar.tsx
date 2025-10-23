import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hexagon, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";
import MetaMaskInstructions from "./MetaMaskInstructions";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = () => {
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
          onSuccess: () => {
            toast({
              title: "Wallet Connected! 🎉",
              description: "Your MetaMask wallet is now connected.",
            });
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
