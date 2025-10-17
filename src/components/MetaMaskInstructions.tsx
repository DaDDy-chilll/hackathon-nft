import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Wallet, Download, CheckCircle } from "lucide-react";

interface MetaMaskInstructionsProps {
  open: boolean;
  onClose: () => void;
}

const MetaMaskInstructions = ({ open, onClose }: MetaMaskInstructionsProps) => {
  const handleDownload = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl glass-card">
        <DialogHeader>
          <DialogTitle className="text-3xl gradient-text flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            MetaMask Not Detected
          </DialogTitle>
          <DialogDescription className="text-base">
            You need MetaMask wallet to connect and mint NFTs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* What is MetaMask */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">What is MetaMask?</h3>
            <p className="text-muted-foreground">
              MetaMask is a crypto wallet & gateway to blockchain apps. It's a browser extension
              that allows you to interact with Web3 applications like HackNFT.
            </p>
          </div>

          {/* Installation Steps */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">How to Install MetaMask</h3>
            
            <div className="space-y-3">
              <div className="flex gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium mb-1">Download MetaMask</p>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to visit MetaMask's official website
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium mb-1">Install Extension</p>
                  <p className="text-sm text-muted-foreground">
                    Add MetaMask extension to your browser (Chrome, Firefox, or Brave)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium mb-1">Create Wallet</p>
                  <p className="text-sm text-muted-foreground">
                    Follow MetaMask's setup wizard to create a new wallet or import an existing one
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium mb-1">Return Here</p>
                  <p className="text-sm text-muted-foreground">
                    Once installed, refresh this page and click "Connect Wallet" again
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex gap-2 items-start">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Important</p>
                <p className="text-sm text-muted-foreground">
                  Always keep your seed phrase safe and never share it with anyone. 
                  MetaMask will never ask for your seed phrase.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="hero"
              size="lg"
              className="flex-1"
              onClick={handleDownload}
            >
              <Download className="w-5 h-5 mr-2" />
              Download MetaMask
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetaMaskInstructions;
