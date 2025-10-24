import React, { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CONTRACTS, HACKNFT_ABI } from "@/config/contract";
import {
  Loader2,
  Send,
  ExternalLink,
  Wallet,
  Package,
  Info,
  Copy,
} from "lucide-react";

interface NFTData {
  tokenId: bigint;
  metadata: {
    projectName: string;
    teamName: string;
    githubUrl: string;
    creator: string;
    mintedAt: bigint;
  };
  tokenURI: string;
  ipfsMetadata?: {
    name?: string;
    description?: string;
    image?: string;
  };
}

const MyNFTs = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const {
    writeContract,
    data: transferHash,
    isPending,
    error: transferError,
  } = useWriteContract();
  const { isLoading: isTransferring, isSuccess: transferSuccess } =
    useWaitForTransactionReceipt({ hash: transferHash });

  // Get user's token IDs
  const { data: tokenIds, refetch: refetchTokens } = useReadContract({
    address: CONTRACTS.AMOY.HACKNFT_ADDRESS as `0x${string}`,
    abi: HACKNFT_ABI,
    functionName: "getTokensByOwner",
    args: address ? [address] : undefined,
    chainId: polygonAmoy.id,
  });

  // Fetch NFT data for each token - AUTO-DETECT from blockchain
  useEffect(() => {
    const fetchNFTData = async () => {
      if (!tokenIds || tokenIds.length === 0) {
        setLoading(false);
        setNfts([]);
        return;
      }

      setLoading(true);
      try {
        // Use wagmi's readContract to fetch data directly from blockchain
        const { readContract } = await import("wagmi/actions");
        const { config } = await import("@/config/wagmi");

        const nftPromises = (tokenIds as bigint[]).map(async (tokenId) => {
          try {
            // Fetch metadata from smart contract
            const metadata = (await readContract(config, {
              address: CONTRACTS.AMOY.HACKNFT_ADDRESS as `0x${string}`,
              abi: HACKNFT_ABI,
              functionName: "getProjectMetadata",
              args: [tokenId],
              chainId: polygonAmoy.id,
            })) as any;

            // Fetch tokenURI from smart contract
            const tokenURI = (await readContract(config, {
              address: CONTRACTS.AMOY.HACKNFT_ADDRESS as `0x${string}`,
              abi: HACKNFT_ABI,
              functionName: "tokenURI",
              args: [tokenId],
              chainId: polygonAmoy.id,
            })) as string;

            // Fetch IPFS metadata for images and descriptions
            let ipfsMetadata = undefined;
            if (tokenURI) {
              try {
                const ipfsUrl = tokenURI.replace(
                  "ipfs://",
                  "https://gateway.pinata.cloud/ipfs/"
                );
                const response = await fetch(ipfsUrl);
                if (response.ok) {
                  ipfsMetadata = await response.json();
                  // Convert image IPFS URL to gateway URL
                  if (ipfsMetadata.image) {
                    ipfsMetadata.image = ipfsMetadata.image.replace(
                      "ipfs://",
                      "https://gateway.pinata.cloud/ipfs/"
                    );
                  }
                }
              } catch (error) {
                console.error("Error fetching IPFS metadata:", error);
              }
            }

            return {
              tokenId,
              metadata: {
                projectName: metadata.projectName || "Unknown Project",
                teamName: metadata.teamName || "Unknown Team",
                githubUrl: metadata.githubUrl || "",
                creator: metadata.creator || "",
                mintedAt: metadata.mintedAt || BigInt(0),
              },
              tokenURI: tokenURI || "",
              ipfsMetadata,
            };
          } catch (error) {
            console.error(`Error fetching NFT ${tokenId}:`, error);
            return {
              tokenId,
              metadata: {
                projectName: "Error Loading",
                teamName: "Error Loading",
                githubUrl: "",
                creator: "",
                mintedAt: BigInt(0),
              },
              tokenURI: "",
            };
          }
        });

        const fetchedNFTs = await Promise.all(nftPromises);
        setNfts(fetchedNFTs);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
        toast({
          title: "Error",
          description: "Failed to auto-detect NFTs from blockchain",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNFTData();
  }, [tokenIds, toast]);

  // Handle transfer success
  useEffect(() => {
    if (transferSuccess && transferHash) {
      toast({
        title: "Transfer Successful!",
        description: "NFT has been transferred to the recipient.",
      });
      setTransferDialogOpen(false);
      setRecipientAddress("");
      setSelectedNFT(null);
      // Refetch tokens after successful transfer
      refetchTokens();
    }
  }, [transferSuccess, transferHash, toast, refetchTokens]);

  const handleTransfer = () => {
    if (!selectedNFT || !recipientAddress) return;

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive",
      });
      return;
    }

    try {
      writeContract({
        address: CONTRACTS.AMOY.HACKNFT_ADDRESS as `0x${string}`,
        abi: HACKNFT_ABI,
        functionName: "safeTransferFrom",
        args: [
          address!,
          recipientAddress as `0x${string}`,
          selectedNFT.tokenId,
        ],
        chain: polygonAmoy,
      });

      toast({
        title: "Transfer Initiated",
        description: "Please confirm the transaction in MetaMask.",
      });
    } catch (error) {
      console.error("Transfer error:", error);
      toast({
        title: "Transfer Failed",
        description: transferError?.message || "Failed to transfer NFT",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 text-center">
            <Wallet className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Connect Your <span className="gradient-text">Wallet</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please connect your MetaMask wallet to view your NFTs
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              My <span className="gradient-text">NFTs</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              View and manage your project NFTs
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading your NFTs...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && nfts.length === 0 && (
            <div className="text-center py-20">
              <Package className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-3xl font-bold mb-4">No NFTs Yet</h2>
              <p className="text-xl text-muted-foreground mb-8">
                You haven't minted any project NFTs yet
              </p>
              <Button
                size="lg"
                onClick={() => (window.location.href = "/submit")}
              >
                Submit a Project
              </Button>
            </div>
          )}

          {/* MetaMask Import Instructions */}
          {!loading && nfts.length > 0 && (
            <div className="mb-8">
              <Card className="border-blue-500/50 bg-blue-500/5">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        NFT Not Showing in MetaMask?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        MetaMask can take 5-30 minutes to automatically detect
                        NFTs. To see your NFT immediately:
                      </p>
                      <ol className="text-sm text-muted-foreground space-y-2 mb-4 list-decimal list-inside">
                        <li>Open MetaMask → Click "NFTs" tab</li>
                        <li>Scroll down → Click "Import NFT"</li>
                        <li>Enter the contract address and your token ID</li>
                        <li>Click "Add"</li>
                      </ol>
                      <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                        <code className="text-xs flex-1 break-all">
                          {CONTRACTS.AMOY.HACKNFT_ADDRESS}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              CONTRACTS.AMOY.HACKNFT_ADDRESS
                            );
                            toast({
                              title: "Copied!",
                              description:
                                "Contract address copied to clipboard",
                            });
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* NFT Grid */}
          {!loading && nfts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nfts.map((nft) => (
                <Card
                  key={nft.tokenId.toString()}
                  className="glass-card hover:glow-primary transition-all duration-500"
                >
                  <CardHeader>
                    {/* Auto-loaded NFT Image from IPFS */}
                    {nft.ipfsMetadata?.image && (
                      <div className="mb-4 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={nft.ipfsMetadata.image}
                          alt={nft.metadata.projectName}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl">
                        {nft.metadata.projectName}
                      </CardTitle>
                      <Badge variant="outline" className="border-primary/50">
                        #{nft.tokenId.toString()}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Token ID: {nft.tokenId.toString()}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={() => {
                          navigator.clipboard.writeText(nft.tokenId.toString());
                          toast({
                            title: "Token ID Copied!",
                            description: `Token ID ${nft.tokenId} copied to clipboard`,
                          });
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </CardDescription>
                    {nft.ipfsMetadata?.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {nft.ipfsMetadata.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {nft.metadata.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          window.open(nft.metadata.githubUrl, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View GitHub
                      </Button>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          window.open(
                            `https://amoy.polygonscan.com/token/${CONTRACTS.AMOY.HACKNFT_ADDRESS}?a=${nft.tokenId}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        PolygonScan
                      </Button>
                      <Dialog
                        open={
                          transferDialogOpen &&
                          selectedNFT?.tokenId === nft.tokenId
                        }
                        onOpenChange={(open) => {
                          setTransferDialogOpen(open);
                          if (open) {
                            setSelectedNFT(nft);
                          } else {
                            setSelectedNFT(null);
                            setRecipientAddress("");
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1">
                            <Send className="w-4 h-4 mr-2" />
                            Transfer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Transfer NFT</DialogTitle>
                            <DialogDescription>
                              Send this NFT to another Ethereum address
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>NFT Details</Label>
                              <Card className="glass-card">
                                <CardContent className="pt-4">
                                  <p className="font-semibold">
                                    {nft.metadata.projectName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Token ID: #{nft.tokenId.toString()}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipient">
                                Recipient Address
                              </Label>
                              <Input
                                id="recipient"
                                placeholder="0x..."
                                value={recipientAddress}
                                onChange={(e) =>
                                  setRecipientAddress(e.target.value)
                                }
                                disabled={isPending || isTransferring}
                              />
                            </div>
                            {transferError && (
                              <p className="text-sm text-red-500">
                                {transferError.message}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setTransferDialogOpen(false);
                                setRecipientAddress("");
                                setSelectedNFT(null);
                              }}
                              disabled={isPending || isTransferring}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleTransfer}
                              disabled={
                                !recipientAddress || isPending || isTransferring
                              }
                              className="flex-1"
                            >
                              {isPending || isTransferring ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  {isPending
                                    ? "Confirming..."
                                    : "Transferring..."}
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Transfer
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                      <p>
                        Minted:{" "}
                        {nft.metadata.mintedAt
                          ? new Date(
                              Number(nft.metadata.mintedAt) * 1000
                            ).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyNFTs;
