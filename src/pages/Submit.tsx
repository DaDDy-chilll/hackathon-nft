import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Submit = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Project Submitted! 🎉",
      description: "Your project has been added to the showcase. You can now mint your NFT!",
    });
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
                    className="h-12 text-base glass-card"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-base">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="DeFi, Analytics, AI (comma-separated)"
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
                    className="text-base glass-card"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Submit Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="glass-card mt-8 border-primary/50">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                After submitting, you'll be able to mint an NFT representing your project on Polygon. 
                The NFT will serve as your project's on-chain identity for crowdfunding.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Submit;
