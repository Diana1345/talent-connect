import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Video } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Video className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              AI VidCV
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            <Button
              variant="nav"
              size="sm"
              asChild
            >
              <Link to="/company-portal">
                Company Portal
              </Link>
            </Button>
            
            <Button
              variant="navAccent"
              size="sm"
              asChild
            >
              <Link to="/immigrant" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                I'm Immigrant
              </Link>
            </Button>
            
            <Link 
              to="/auth" 
              className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
            >
              Login / Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
