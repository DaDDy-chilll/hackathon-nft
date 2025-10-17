import { Link } from "react-router-dom";
import { Hexagon, Twitter, Github, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-16 mt-32">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hexagon className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">HackNFT</span>
            </div>
            <p className="text-muted-foreground">
              Turn hackathon projects into fundable NFTs on Polygon.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/projects" className="hover:text-primary transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link to="/submit" className="hover:text-primary transition-colors">
                  Submit Project
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Smart Contracts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">Community</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 HackNFT. Built with ❤️ for builders.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
