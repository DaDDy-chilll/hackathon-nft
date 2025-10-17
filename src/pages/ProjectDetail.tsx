import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github, Users, Wallet, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProjectDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch from database
  const project = {
    name: "DeFi Dashboard",
    description: "Real-time analytics for decentralized finance protocols with AI-powered predictions and insights.",
    team: "Team Blockchain",
    members: ["Alice Chen", "Bob Smith", "Carol Wang"],
    tags: ["DeFi", "Analytics", "AI"],
    github: "https://github.com/example/defi-dashboard",
    demo: "https://defi-dashboard.example.com",
    minted: false,
    fullDescription: `
      Our DeFi Dashboard provides comprehensive real-time analytics for major DeFi protocols. 
      
      Key Features:
      • Real-time tracking of TVL, volume, and APY across protocols
      • AI-powered predictions for yield opportunities
      • Portfolio management and risk assessment
      • Gas fee optimization recommendations
      • Multi-chain support (Ethereum, Polygon, Arbitrum)
      
      Built with Next.js, TypeScript, and The Graph for data indexing.
    `,
  };

  const handleMint = () => {
    toast({
      title: "Minting NFT... 🎨",
      description: "Please confirm the transaction in MetaMask.",
    });

    // Simulate minting process
    setTimeout(() => {
      toast({
        title: "NFT Minted Successfully! 🎉",
        description: "Your project NFT has been created on Polygon.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Back button */}
          <Link to="/projects" className="inline-block mb-8 text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Projects
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                  <span className="gradient-text">{project.name}</span>
                </h1>
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xl text-muted-foreground">{project.team}</span>
                </div>
              </div>
              {project.minted && (
                <Badge className="bg-primary/20 text-primary border-primary/50 text-lg px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Minted
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-primary/30 text-base px-4 py-2">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-xl text-muted-foreground mb-8">
              {project.description}
            </p>

            <div className="flex gap-4">
              <Button variant="outline" size="lg" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  View Code
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Live Demo
                </a>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <h2 className="text-3xl font-bold mb-6">About This Project</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {project.fullDescription}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <h2 className="text-3xl font-bold mb-6">Team Members</h2>
                  <div className="space-y-3">
                    {project.members.map((member, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {member[0]}
                        </div>
                        <span className="text-lg">{member}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="glass-card border-primary/50 glow-primary">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-6">Mint Project NFT</h3>
                  
                  {!project.minted ? (
                    <>
                      <p className="text-muted-foreground mb-6">
                        Create an on-chain identity for your project. The NFT will be minted on Polygon for free.
                      </p>
                      
                      <Button 
                        variant="hero" 
                        size="lg" 
                        className="w-full mb-4"
                        onClick={handleMint}
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        Mint NFT
                      </Button>

                      <p className="text-sm text-muted-foreground text-center">
                        Make sure MetaMask is installed
                      </p>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-primary">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-semibold">NFT Minted</span>
                      </div>
                      
                      <p className="text-muted-foreground">
                        Your project NFT has been successfully minted on Polygon.
                      </p>

                      <Button variant="outline" size="lg" className="w-full">
                        View on PolygonScan
                      </Button>

                      <Button variant="outline" size="lg" className="w-full">
                        View on OpenSea
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Next Steps</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Mint your project NFT</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Share on social media</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Prepare crowdfunding campaign</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Build your community</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
