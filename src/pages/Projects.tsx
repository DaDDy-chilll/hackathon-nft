import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ExternalLink, Github, Users, Search } from "lucide-react";
import { Link } from "react-router-dom";

const allProjects = [
  {
    id: 1,
    name: "DeFi Dashboard",
    description: "Real-time analytics for decentralized finance protocols with AI predictions",
    team: "Team Blockchain",
    tags: ["DeFi", "Analytics", "AI"],
    minted: true,
  },
  {
    id: 2,
    name: "NFT Marketplace",
    description: "Zero-fee NFT marketplace powered by Layer 2 scaling solutions",
    team: "Layer Labs",
    tags: ["NFT", "Marketplace", "L2"],
    minted: true,
  },
  {
    id: 3,
    name: "DAO Governance",
    description: "Decentralized voting platform with quadratic funding mechanisms",
    team: "Governance Guild",
    tags: ["DAO", "Voting", "Governance"],
    minted: false,
  },
  {
    id: 4,
    name: "Cross-Chain Bridge",
    description: "Secure asset bridge connecting multiple blockchain networks",
    team: "Bridge Builders",
    tags: ["Infrastructure", "Cross-Chain", "Security"],
    minted: true,
  },
  {
    id: 5,
    name: "Social DApp",
    description: "Decentralized social media with token-gated communities",
    team: "Web3 Social",
    tags: ["Social", "Community", "Tokens"],
    minted: false,
  },
  {
    id: 6,
    name: "Gaming Protocol",
    description: "On-chain gaming infrastructure with fair randomness",
    team: "Game Devs",
    tags: ["Gaming", "Protocol", "Random"],
    minted: true,
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              All <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore innovative hackathon projects from builders around the world
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search projects by name, team, or tags..."
                className="pl-12 h-14 text-lg glass-card"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Badge className="bg-primary text-primary-foreground cursor-pointer hover:opacity-80 px-4 py-2">
              All Projects
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 px-4 py-2">
              Minted
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 px-4 py-2">
              Not Minted
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 px-4 py-2">
              DeFi
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 px-4 py-2">
              NFT
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 px-4 py-2">
              Gaming
            </Badge>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <Link key={project.id} to={`/project/${project.id}`}>
                <Card className="glass-card hover:glow-primary transition-all duration-500 hover:scale-105 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <CardTitle className="text-2xl">{project.name}</CardTitle>
                      {project.minted && (
                        <Badge className="bg-primary/20 text-primary border-primary/50">
                          Minted
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{project.team}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="border-primary/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
