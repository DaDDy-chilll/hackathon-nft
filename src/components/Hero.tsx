import { Button } from "@/components/ui/button";
import { ArrowRight, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Floating icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Hexagon className="w-24 h-24 text-primary animate-float glow-primary" />
              <div className="absolute inset-0 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            Turn Hackathon Projects into{" "}
            <span className="gradient-text">Fundable NFTs</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Mint your project as an NFT. Create a verifiable on-chain identity. 
            Unlock crowdfunding opportunities. Build the future, one block at a time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/submit">
              <Button variant="hero" size="lg" className="group">
                Submit Your Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
                Explore Projects
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold gradient-text">100+</div>
              <div className="text-sm text-muted-foreground">Projects Minted</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold gradient-text">$2.5M</div>
              <div className="text-sm text-muted-foreground">Funds Raised</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold gradient-text">500+</div>
              <div className="text-sm text-muted-foreground">Builders</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
