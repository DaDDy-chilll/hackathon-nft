import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Users } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
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
];

const FeaturedProjects = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover innovative hackathon projects from builders worldwide
            </p>
          </div>
          <Link to="/projects">
            <Button variant="hero" size="lg">
              View All Projects
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
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
    </section>
  );
};

export default FeaturedProjects;
