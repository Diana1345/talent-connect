import { Upload, Settings, CreditCard, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Upload CV",
    description: "Upload your resume or CV in PDF, DOC, or DOCX format",
  },
  {
    number: 2,
    icon: Settings,
    title: "Customize",
    description: "Choose your video style, duration, and target job role",
  },
  {
    number: 3,
    icon: CreditCard,
    title: "Pay $19",
    description: "One-time secure payment via PayPal",
  },
  {
    number: 4,
    icon: Share2,
    title: "Download & Share",
    description: "Get your video with QR code and share everywhere",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create your video CV in 4 simple steps
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="text-center">
                {/* Number Badge */}
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{step.number}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
