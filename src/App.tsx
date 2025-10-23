import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Submit from "./pages/Submit";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import MyNFTs from "./pages/MyNFT";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/my-nfts" element={<MyNFTs />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/about" element={<About />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
