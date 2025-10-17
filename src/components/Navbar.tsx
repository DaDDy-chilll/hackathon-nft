import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hexagon } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Hexagon className="w-8 h-8 text-primary group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-2xl font-bold gradient-text">HackNFT</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/projects" className="text-foreground/80 hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link to="/submit" className="text-foreground/80 hover:text-foreground transition-colors">
              Submit Project
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          <Button variant="hero" size="lg">
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
