import React, { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ExternalLink, Github, Users, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTRACTS, HACKNFT_ABI } from "@/config/contract";

interface Project {
  tokenId: string;
  name: string;
  team: string;
  githubUrl: string;
  creator: string;
  mintedAt: string;
  tags: string[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Get all token IDs
  const { data: tokenIds } = useReadContract({
    address: CONTRACTS.AMOY.HACKNFT_ADDRESS as `0x${string}`,
    abi: HACKNFT_ABI,
    functionName: "getAllTokenIds",
    chainId: polygonAmoy.id,
  });

  // Fetch project data
  useEffect(() => {
    const fetchProjects = async () => {
      if (!tokenIds || tokenIds.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const projectPromises = (tokenIds as bigint[]).map(async (tokenId) => {
          try {
            // In production, you would fetch this from your contract
            // For now, we'll use mock data structure
            return {
              tokenId: tokenId.toString(),
              name: `Project #${tokenId}`,
              team: "Team Name",
              githubUrl: "https://github.com",
              creator: "0x...",
              mintedAt: new Date().toISOString(),
              tags: ["Web3", "DeFi"],
            };
          } catch (error) {
            console.error(`Error fetching project ${tokenId}:`, error);
            return null;
          }
        });

        const fetchedProjects = (await Promise.all(projectPromises)).filter(
          (p): p is Project => p !== null
        );
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [tokenIds]);

  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{projects.length}</p>
              <p className="text-muted-foreground">Total Projects</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{projects.length}</p>
              <p className="text-muted-foreground">Minted NFTs</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading projects from blockchain...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold mb-4">No Projects Yet</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Be the first to submit a project!
              </p>
              <Button size="lg" onClick={() => (window.location.href = "/submit")}>
                Submit Project
              </Button>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && filteredProjects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
              <Link key={project.tokenId} to={`/project/${project.tokenId}`}>
                <Card className="glass-card hover:glow-primary transition-all duration-500 hover:scale-105 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <CardTitle className="text-2xl">{project.name}</CardTitle>
                      <Badge className="bg-primary/20 text-primary border-primary/50">
                        #{project.tokenId}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      Team: {project.team}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="truncate">{project.creator.slice(0, 6)}...{project.creator.slice(-4)}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="border-primary/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(project.githubUrl, "_blank");
                          }}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              `https://amoy.polygonscan.com/token/${CONTRACTS.AMOY.HACKNFT_ADDRESS}?a=${project.tokenId}`,
                              "_blank"
                            );
                          }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
