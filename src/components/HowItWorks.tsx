import { Rocket, Hexagon, Wallet, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Rocket,
    title: "Submit Your Project",
    description: "Fill in your hackathon project details, team info, and GitHub repo.",
  },
  {
    icon: Hexagon,
    title: "Mint Your NFT",
    description: "Transform your project into a unique, verifiable NFT on Polygon.",
  },
  {
    icon: Wallet,
    title: "Get On-Chain Identity",
    description: "Your NFT becomes your project's permanent blockchain identity.",
  },
  {
    icon: TrendingUp,
    title: "Launch Crowdfunding",
    description: "Use your NFT to raise funds and build your community.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to turn your hackathon project into a fundable digital asset
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="glass-card p-8 rounded-2xl h-full transition-all duration-500 hover:scale-105 hover:glow-primary">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-6 relative">
                  <step.icon className="w-16 h-16 text-primary group-hover:text-secondary transition-colors duration-500" />
                  <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connector line (except last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
