import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import { Card, CardContent } from "@/components/ui/card";
import { Hexagon, Target, Zap, Shield } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Builder-First",
    description: "We believe in empowering builders to turn their ideas into fundable ventures.",
  },
  {
    icon: Zap,
    title: "Fast & Easy",
    description: "Mint NFTs in seconds with zero gas fees on Polygon.",
  },
  {
    icon: Shield,
    title: "Transparent",
    description: "All project data and funding is verifiable on-chain.",
  },
  {
    icon: Hexagon,
    title: "Community-Driven",
    description: "Built by the community, for the community.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              About <span className="gradient-text">HackNFT</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              We're building the infrastructure for the next generation of builder-driven crowdfunding. 
              Every hackathon project deserves a chance to grow into something bigger.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every year, thousands of brilliant ideas are born at hackathons. But most of them never 
                make it past the demo stage. We're changing that.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                HackNFT transforms hackathon projects into verifiable digital assets that can unlock 
                funding, build reputation, and create lasting value for builders.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our vision: A world where every great idea has a clear path from hackathon to sustainable 
                venture, powered by blockchain technology.
              </p>
            </div>

            <div className="relative">
              <div className="glass-card p-12 rounded-3xl glow-primary">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold gradient-text mb-2">1000+</div>
                    <div className="text-muted-foreground">Projects Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold gradient-text mb-2">$5M+</div>
                    <div className="text-muted-foreground">Total Funding</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold gradient-text mb-2">50+</div>
                    <div className="text-muted-foreground">Hackathons</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Values Section */}
        <section className="container mx-auto px-6 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="glass-card hover:glow-primary transition-all duration-500">
                <CardContent className="pt-8 text-center">
                  <div className="flex justify-center mb-6">
                    <value.icon className="w-16 h-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="container mx-auto px-6 mt-32">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card border-primary/50">
              <CardContent className="pt-8">
                <h2 className="text-4xl font-bold mb-8 text-center">
                  Built on <span className="gradient-text">Polygon</span>
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p>
                    We chose Polygon for its speed, low costs, and eco-friendly approach to blockchain technology.
                  </p>
                  <p>
                    All project NFTs are ERC-721 tokens with metadata stored on IPFS for permanence and decentralization.
                  </p>
                  <p>
                    Future upgrades will include ERC-6551 (Token-Bound Accounts) to enable NFTs to hold and receive 
                    tokens directly, creating a seamless crowdfunding experience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
