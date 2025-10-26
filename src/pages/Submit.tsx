// Submit.tsx
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MetaMaskInstructions from "@/components/MetaMaskInstructions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { CONTRACTS, HACKNFT_ABI } from "@/config/contract";
import { decodeEventLog } from "viem";
import {
  Loader2,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  Upload,
} from "lucide-react";

const Submit = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient({ chainId: polygonAmoy.id });

  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { data: receipt, isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

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
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedTokenURI, setUploadedTokenURI] = useState("");
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [showMetaMaskInstructions, setShowMetaMaskInstructions] =
    useState(false);

  // ---- handle input ----
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProjectImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ---- Pinata upload helpers ----
  const uploadImageToPinata = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
      },
      body,
    });
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  };

  const uploadMetadataToPinata = async (metadata: object): Promise<string> => {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
      },
      body: JSON.stringify(metadata),
    });
    if (!res.ok) throw new Error("Metadata upload failed");
    const data = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  };

  // ---- handle submission ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.team || !formData.github) {
      toast({
        title: "Missing required fields",
        description: "Please fill in project name, team, and GitHub URL.",
        variant: "destructive",
      });
      return;
    }
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your MetaMask wallet first.",
        variant: "destructive",
      });
      return;
    }
    if (chainId !== polygonAmoy.id) {
      try {
        await switchChain({ chainId: polygonAmoy.id });
      } catch {
        toast({
          title: "Wrong network",
          description: "Please switch to Polygon Amoy testnet in MetaMask.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsUploading(true);
    try {
      let imageUrl = "";
      if (projectImage) imageUrl = await uploadImageToPinata(projectImage);

      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl || "ipfs://bafkreicplaceholder", // fallback IPFS image
        attributes: [
          { trait_type: "Team", value: formData.team },
          { trait_type: "GitHub", value: formData.github },
          { trait_type: "Demo", value: formData.demo || "N/A" },
          { trait_type: "Tags", value: formData.tags || "N/A" },
          { trait_type: "Members", value: formData.members || "N/A" },
        ],
      };

const tokenURI = await uploadMetadataToPinata(metadata);
setUploadedTokenURI(tokenURI); // store for UI only

const sanitize = (s: string) => s.trim().replace(/\s+/g, " ");

const name = sanitize(formData.name);
const team = sanitize(formData.team);
const github = sanitize(formData.github);
const uri = tokenURI.trim(); // ✅ use freshly returned tokenURI, not state

writeContract({
  address: CONTRACTS.AMOY.HACKNFT_ADDRESS,
  abi: HACKNFT_ABI,
  functionName: "mintProject",
  args: [name, team, github, uri],
  gas: BigInt(600000),
  chain: polygonAmoy,
  account: address!,
});


    } catch (err: any) {
      console.error("Minting error:", err);
      toast({
        title: "Transaction failed",
        description:
          err?.shortMessage ||
          err?.message ||
          "Something went wrong while minting.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ---- extract minted tokenId ----
  useEffect(() => {
    if (isSuccess && receipt) {
      try {
        for (const log of receipt.logs) {
          const decoded = decodeEventLog({
            abi: HACKNFT_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "ProjectMinted") {
            setMintedTokenId(decoded.args.tokenId.toString());
          }
        }
      } catch (e) {
        console.warn("Error decoding logs:", e);
      }
    }
  }, [isSuccess, receipt]);

  // ---- show error toasts ----
  useEffect(() => {
    if (error) {
      console.error("Contract write error:", error);
      toast({
        title: "Transaction Error",
        description:
          error.message.includes("internal json-rpc")
            ? "Internal RPC error. Try again or switch RPC endpoint."
            : error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // ---- UI ----
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              Submit Your <span className="gradient-text">Project</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Mint your hackathon project as an NFT identity
            </p>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Fill out your project information below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {["name", "team", "github"].map((id) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{id.toUpperCase()} *</Label>
                    <Input
                      id={id}
                      value={(formData as any)[id]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Project Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-3 rounded-md border"
                    />
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isUploading || isPending || isConfirming}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Uploading to
                      IPFS...
                    </>
                  ) : isPending ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Confirm in
                      MetaMask...
                    </>
                  ) : (
                    "Submit & Mint NFT"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isSuccess && hash && (
            <Card className="glass-card mt-8 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-primary w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-semibold">
                      NFT Minted Successfully 🎉
                    </h3>
                    {mintedTokenId && (
                      <p className="mt-1 text-primary font-semibold">
                        Token ID: #{mintedTokenId}
                      </p>
                    )}
                    {uploadedTokenURI && (
                      <p className="mt-1 text-xs break-all text-muted-foreground">
                        Metadata: {uploadedTokenURI}
                      </p>
                    )}
                    <div className="flex gap-3 mt-3 flex-wrap">
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={`https://amoy.polygonscan.com/tx/${hash}`}
                          target="_blank"
                        >
                          View Txn <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </Button>
                      {mintedTokenId && (
                        <Button asChild variant="outline" size="sm">
                          <a
                            href={`https://testnets.opensea.io/assets/amoy/${CONTRACTS.AMOY.HACKNFT_ADDRESS}/${mintedTokenId}`}
                            target="_blank"
                          >
                            View on OpenSea{" "}
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
      <MetaMaskInstructions
        open={showMetaMaskInstructions}
        onClose={() => setShowMetaMaskInstructions(false)}
      />
    </div>
  );
};

export default Submit;
