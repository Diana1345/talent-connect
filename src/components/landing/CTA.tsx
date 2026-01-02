import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to <span className="text-gradient">Stand Out</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Join thousands of professionals who have transformed their job search with AI VidCV
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/auth" className="flex items-center gap-2">
              Create Your Video CV Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
