import { Sparkles, QrCode, Download } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Advanced AI analyzes your CV and creates a personalized, engaging video that highlights your strengths.",
  },
  {
    icon: QrCode,
    title: "Shareable QR Code",
    description: "Every video includes a scannable QR code for easy sharing. Perfect for networking events and business cards.",
  },
  {
    icon: Download,
    title: "HD Download",
    description: "Download your video in high quality and share it across LinkedIn, email, or any platform you choose.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose <span className="text-gradient">AI VidCV</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create the perfect video CV
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gradient-card rounded-2xl border border-border/50 p-8 h-full hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-elegant">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
