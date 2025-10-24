import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MetaMaskInstructions from "@/components/MetaMaskInstructions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { CONTRACTS, HACKNFT_ABI } from "@/config/contract";
import { Loader2, ExternalLink, CheckCircle, Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { decodeEventLog } from "viem";

const Submit = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });
  const publicClient = usePublicClient();

  const [showMetaMaskInstructions, setShowMetaMaskInstructions] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    description: "",
    github: "",
    demo: "",
    tags: "",
    members: "",
  });
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [uploadedTokenURI, setUploadedTokenURI] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Pinata
  const uploadImageToPinata = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY || '',
        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY || '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Pinata');
    }

    const data = await response.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  };

  // Upload metadata to Pinata
  const uploadMetadataToPinata = async (metadata: any): Promise<string> => {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY || '',
        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY || '',
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error('Failed to upload metadata to Pinata');
    }

    const data = await response.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  };

  // Extract token ID from transaction receipt
  useEffect(() => {
    if (isSuccess && receipt) {
      try {
        // Find the ProjectMinted event in the logs
        const projectMintedLog = receipt.logs.find((log) => {
          try {
            const decoded = decodeEventLog({
              abi: HACKNFT_ABI,
              data: log.data,
              topics: log.topics,
            });
            return decoded.eventName === 'ProjectMinted';
          } catch {
            return false;
          }
        });

        if (projectMintedLog) {
          const decoded = decodeEventLog({
            abi: HACKNFT_ABI,
            data: projectMintedLog.data,
            topics: projectMintedLog.topics,
          });
          
          if (decoded.eventName === 'ProjectMinted' && decoded.args) {
            const tokenId = decoded.args.tokenId?.toString();
            setMintedTokenId(tokenId || null);
            
            toast({
              title: "NFT Minted Successfully! 🎉",
              description: `Token ID: ${tokenId}. Your NFT will appear shortly.`,
            });
          }
        }
      } catch (error) {
        console.error('Error extracting token ID:', error);
      }
    }
  }, [isSuccess, receipt, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.team || !formData.github) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in Project Name, Team Name, and GitHub URL.",
        variant: "destructive",
      });
      return;
    }

    // Check if contract is deployed
    if (CONTRACTS.AMOY.HACKNFT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      toast({
        title: "Contract Not Deployed",
        description: "Please deploy the smart contract first. See README.md for instructions.",
        variant: "destructive",
      });
      return;
    }

    // Check if MetaMask is available
    if (typeof window.ethereum === "undefined") {
      setShowMetaMaskInstructions(true);
      return;
    }

    // Check if wallet is connected
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your MetaMask wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Check if project already minted
      if (publicClient) {
        try {
          const isAlreadyMinted = await publicClient.readContract({
            address: CONTRACTS.AMOY.HACKNFT_ADDRESS as `0x${string}`,
            abi: HACKNFT_ABI,
            functionName: "isProjectMinted",
            args: [formData.name, formData.team, formData.github],
          });

          if (isAlreadyMinted) {
            setIsUploading(false);
            toast({
              title: "Project Already Minted",
              description: "This project (same name, team, and GitHub URL) has already been minted as an NFT.",
              variant: "destructive",
            });
            return;
          }
        } catch (checkError) {
          console.warn("Could not check if project is minted:", checkError);
        }
      }

      // Upload image to IPFS if provided
      let imageUrl = "";
      if (projectImage) {
        toast({
          title: "Uploading Image...",
          description: "Uploading your project image to IPFS.",
        });
        imageUrl = await uploadImageToPinata(projectImage);
      }

      // Prepare metadata
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl || "https://via.placeholder.com/400",
        attributes: [
          { trait_type: "Team", value: formData.team },
          { trait_type: "GitHub", value: formData.github },
          { trait_type: "Demo", value: formData.demo || "N/A" },
          { trait_type: "Tags", value: formData.tags || "N/A" },
          { trait_type: "Members", value: formData.members || "N/A" },
        ],
      };

      // Upload metadata to IPFS
      toast({
        title: "Uploading Metadata...",
        description: "Uploading project metadata to IPFS.",
      });
      const tokenURI = await uploadMetadataToPinata(metadata);
      setUploadedTokenURI(tokenURI);

      setIsUploading(false);

      // Call the mint function
      toast({
        title: "Minting NFT...",
        description: "Please confirm the transaction in MetaMask.",
      });

      writeContract({
        address: CONTRACTS.AMOY.HACKNFT_ADDRESS as `0x${string}`,
        abi: HACKNFT_ABI,
        functionName: "mintProject",
        args: [formData.name, formData.team, formData.github, tokenURI],
        chain: polygonAmoy,
        account: address!,
      });
    } catch (err: any) {
      setIsUploading(false);
      console.error("Minting error:", err);
      
      let errorMessage = "Failed to mint NFT. Please try again.";
      
      // Extract error message from contract revert
      if (err?.message) {
        if (err.message.includes("Project already minted")) {
          errorMessage = "This project has already been minted. Please use a different project name, team, or GitHub URL.";
        } else if (err.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected in MetaMask.";
        } else if (err.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas fees. Please add some POL to your wallet.";
        } else {
          errorMessage = err.message;
        }
      }
      
      toast({
        title: "Minting Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Submit Your <span className="gradient-text">Project</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your hackathon project with the community and prepare to mint your NFT
            </p>
          </div>

          {/* Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-3xl">Project Details</CardTitle>
              <CardDescription className="text-base">
                Fill in the information about your hackathon project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="DeFi Dashboard"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isPending || isConfirming}
                    className="h-12 text-base glass-card"
                  />
                </div>

                {/* Team Name */}
                <div className="space-y-2">
                  <Label htmlFor="team" className="text-base">Team Name *</Label>
                  <Input
                    id="team"
                    placeholder="Team Blockchain"
                    required
                    value={formData.team}
                    onChange={handleInputChange}
                    disabled={isPending || isConfirming}
                    className="h-12 text-base glass-card"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project, its features, and what makes it unique..."
                    required
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isPending || isConfirming}
                    className="text-base glass-card"
                  />
                </div>

                {/* GitHub URL */}
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-base">GitHub Repository *</Label>
                  <Input
                    id="github"
                    type="url"
                    placeholder="https://github.com/username/project"
                    required
                    value={formData.github}
                    onChange={handleInputChange}
                    disabled={isPending || isConfirming}
                    className="h-12 text-base glass-card"
                  />
                </div>

                {/* Demo URL */}
                <div className="space-y-2">
                  <Label htmlFor="demo" className="text-base">Demo URL</Label>
                  <Input
                    id="demo"
                    type="url"
                    placeholder="https://your-project-demo.com"
                    value={formData.demo}
                    onChange={handleInputChange}
                    disabled={isPending || isConfirming}
                    className="h-12 text-base glass-card"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-base">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="DeFi, Analytics, AI (comma-separated)"
                    value={formData.tags}
                    onChange={handleInputChange}
                    disabled={isPending || isConfirming}
                    className="h-12 text-base glass-card"
                  />
                  <p className="text-sm text-muted-foreground">
                    Add relevant tags to help others discover your project
                  </p>
                </div>

                {/* Team Members */}
                <div className="space-y-2">
                  <Label htmlFor="members" className="text-base">Team Members</Label>
                  <Textarea
                    id="members"
                    placeholder="List your team members and their roles..."
                    rows={4}
                    value={formData.members}
                    onChange={handleInputChange}
                    disabled={isPending || isConfirming || isUploading}
                    className="text-base glass-card"
                  />
                </div>

                {/* Project Image */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-base">Project Image</Label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isPending || isConfirming || isUploading}
                        className="h-12 text-base glass-card"
                      />
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    {imagePreview && (
                      <div className="relative w-full max-w-md mx-auto">
                        <img
                          src={imagePreview}
                          alt="Project preview"
                          className="w-full h-auto rounded-lg border-2 border-primary/20"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload an image that represents your project (optional)
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    disabled={isPending || isConfirming || isUploading || !isConnected}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Uploading to IPFS...
                      </>
                    ) : isPending || isConfirming ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {isPending ? "Confirm in MetaMask..." : "Minting NFT..."}
                      </>
                    ) : !isConnected ? (
                      "Connect Wallet to Submit & Mint"
                    ) : (
                      "Submit Project & Mint NFT"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Success Card */}
          {/* Contract Not Deployed Warning */}
          {CONTRACTS.AMOY.HACKNFT_ADDRESS === "0x0000000000000000000000000000000000000000" && (
            <Card className="glass-card mt-8 border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0" />
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Contract Not Deployed</h3>
                      <p className="text-muted-foreground mb-4">
                        The HackNFT smart contract needs to be deployed before you can mint NFTs.
                      </p>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-mono text-sm mb-2">Deploy the contract:</p>
                        <code className="text-xs block bg-background p-2 rounded">
                          cd contracts<br />
                          npm install<br />
                          npx hardhat run scripts/deploy.ts --network amoy
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Card */}
          {isSuccess && hash && (
            <Card className="glass-card mt-8 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">NFT Minted Successfully! 🎉</h3>
                      <p className="text-muted-foreground mb-2">
                        Your project NFT has been minted on Polygon Amoy testnet.
                      </p>
                      {mintedTokenId && (
                        <p className="text-sm font-semibold text-primary mb-4">
                          Token ID: #{mintedTokenId}
                        </p>
                      )}
                      {uploadedTokenURI && (
                        <p className="text-xs text-muted-foreground mb-4 break-all">
                          Metadata: {uploadedTokenURI}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        ⏳ It may take a few minutes to appear on OpenSea and MetaMask.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={`https://amoy.polygonscan.com/tx/${hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          View Transaction
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={`https://amoy.polygonscan.com/address/${CONTRACTS.AMOY.HACKNFT_ADDRESS}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          View Contract
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      {mintedTokenId && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`https://testnets.opensea.io/assets/amoy/${CONTRACTS.AMOY.HACKNFT_ADDRESS}/${mintedTokenId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            View on OpenSea
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="glass-card mt-8 border-primary/50">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                After submitting, your NFT will be minted on Polygon and serve as your project's on-chain identity for crowdfunding.
                {!isConnected && " Connect your wallet to get started."}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      
      {/* MetaMask Instructions Dialog */}
      <MetaMaskInstructions
        open={showMetaMaskInstructions}
        onClose={() => setShowMetaMaskInstructions(false)}
      />
    </div>
  );
};

export default Submit;
