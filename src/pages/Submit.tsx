import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MetaMaskInstructions from "@/components/MetaMaskInstructions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { CONTRACTS, HACKNFT_ABI } from "@/config/contract";
import { Loader2, ExternalLink, CheckCircle } from "lucide-react";

const Submit = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

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
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    // Prepare metadata for IPFS (in production, upload to IPFS first)
    const metadata = {
      name: formData.name,
      description: formData.description,
      image: "ipfs://placeholder", // Replace with actual IPFS image
      attributes: [
        { trait_type: "Team", value: formData.team },
        { trait_type: "GitHub", value: formData.github },
        { trait_type: "Demo", value: formData.demo },
        { trait_type: "Tags", value: formData.tags },
      ],
    };

    // In production, upload metadata to IPFS and get URI
    const tokenURI = `ipfs://placeholder/${formData.name}`; // Replace with actual IPFS URI

    try {
      // Call the mint function
      writeContract({
        address: CONTRACTS.AMOY.HACKNFT_ADDRESS as `0x${string}`,
        abi: HACKNFT_ABI,
        functionName: "mintProject",
        args: [formData.name, formData.team, formData.github, tokenURI],
        chain: polygonAmoy,
        account: address!,
      });

      toast({
        title: "Minting in Progress...",
        description: "Please confirm the transaction in MetaMask.",
      });
    } catch (err) {
      toast({
        title: "Minting Failed",
        description: error?.message || "Failed to mint NFT. Please try again.",
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
                    disabled={isPending || isConfirming}
                    className="text-base glass-card"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    disabled={isPending || isConfirming || !isConnected}
                  >
                    {isPending || isConfirming ? (
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
          {isSuccess && hash && (
            <Card className="glass-card mt-8 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">NFT Minted Successfully! 🎉</h3>
                      <p className="text-muted-foreground mb-4">
                        Your project NFT has been minted on Polygon. It will be visible on OpenSea and in your MetaMask wallet shortly.
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
                          View on PolygonScan
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
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
