import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Upload, 
  Link as LinkIcon, 
  Mic, 
  MicOff,
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Loader2,
  Play,
  Download,
  QrCode as QrCodeIcon
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh",
  "Belgium", "Brazil", "Canada", "China", "Colombia", "Croatia", "Czech Republic",
  "Denmark", "Egypt", "Ethiopia", "Finland", "France", "Germany", "Ghana", "Greece",
  "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Japan", "Jordan", "Kenya", "Lebanon", "Libya", "Malaysia", "Mexico", "Morocco",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru", "Philippines",
  "Poland", "Portugal", "Romania", "Russia", "Saudi Arabia", "Serbia", "Singapore",
  "South Africa", "South Korea", "Spain", "Sudan", "Sweden", "Switzerland", "Syria",
  "Thailand", "Tunisia", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Venezuela", "Vietnam", "Yemen"
];

const steps = [
  { id: 1, title: "Origin", icon: Globe },
  { id: 2, title: "Upload CV", icon: FileText },
  { id: 3, title: "Questions", icon: FileText },
  { id: 4, title: "Voice", icon: Mic },
  { id: 5, title: "Payment", icon: CreditCard },
  { id: 6, title: "Result", icon: CheckCircle2 },
];

const ImmigrantFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    originCountry: "",
    currentCountry: "",
    uploadMethod: "cv",
    cvFile: null as File | null,
    linkedinUrl: "",
    targetRole: "",
    yearsExperience: "",
    keyStrengths: "",
    whyMove: "",
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [generatedVideoUrl] = useState("https://aividcv.com/video/12345");

  const progress = (currentStep / steps.length) * 100;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, cvFile: file });
      toast.success("CV uploaded successfully!");
    }
  };

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      toast.info("Recording started. Read the sentence aloud.");
      
      // Simulate recording for 5 seconds
      setTimeout(() => {
        setIsRecording(false);
        setRecordingComplete(true);
        toast.success("Voice recording saved!");
      }, 5000);
    } catch {
      toast.error("Microphone access denied. Please allow access.");
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment and video generation
    setTimeout(() => {
      setIsProcessing(false);
      setVideoReady(true);
      setCurrentStep(6);
      toast.success("Payment successful! Video is ready.");
    }, 3000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.originCountry && formData.currentCountry;
      case 2:
        return formData.uploadMethod === "cv" ? formData.cvFile : formData.linkedinUrl;
      case 3:
        return formData.targetRole && formData.yearsExperience;
      case 4:
        return recordingComplete;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Where are you from?</h2>
              <p className="text-muted-foreground">Tell us about your journey</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="origin">Country of Origin</Label>
                <Select 
                  value={formData.originCountry} 
                  onValueChange={(value) => setFormData({ ...formData, originCountry: value })}
                >
                  <SelectTrigger className="bg-secondary border-border mt-2">
                    <SelectValue placeholder="Select your home country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="current">Current Country of Residence</Label>
                <Select 
                  value={formData.currentCountry} 
                  onValueChange={(value) => setFormData({ ...formData, currentCountry: value })}
                >
                  <SelectTrigger className="bg-secondary border-border mt-2">
                    <SelectValue placeholder="Where do you live now?" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Share Your Experience</h2>
              <p className="text-muted-foreground">Upload your CV or share your LinkedIn profile</p>
            </div>

            <RadioGroup 
              value={formData.uploadMethod} 
              onValueChange={(value) => setFormData({ ...formData, uploadMethod: value })}
              className="grid grid-cols-2 gap-4"
            >
              <Label 
                htmlFor="cv" 
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.uploadMethod === "cv" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="cv" id="cv" className="sr-only" />
                <Upload className="w-8 h-8 text-primary" />
                <span className="font-medium">Upload CV</span>
              </Label>
              
              <Label 
                htmlFor="linkedin" 
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.uploadMethod === "linkedin" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="linkedin" id="linkedin" className="sr-only" />
                <LinkIcon className="w-8 h-8 text-primary" />
                <span className="font-medium">LinkedIn URL</span>
              </Label>
            </RadioGroup>

            <AnimatePresence mode="wait">
              {formData.uploadMethod === "cv" ? (
                <motion.div
                  key="cv-upload"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label htmlFor="cv-file">Upload your CV (PDF, DOC, DOCX)</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="cv-file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="cv-file" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      {formData.cvFile ? (
                        <p className="text-primary font-medium">{formData.cvFile.name}</p>
                      ) : (
                        <>
                          <p className="text-foreground font-medium mb-1">Click to upload</p>
                          <p className="text-sm text-muted-foreground">or drag and drop</p>
                        </>
                      )}
                    </label>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="linkedin-url"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedin-url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="bg-secondary border-border mt-2"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Tell Us More</h2>
              <p className="text-muted-foreground">Help us create the perfect video for you</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Target Job Role</Label>
                <Input
                  id="role"
                  placeholder="e.g., Software Engineer, Data Analyst"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="bg-secondary border-border mt-2"
                />
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select 
                  value={formData.yearsExperience} 
                  onValueChange={(value) => setFormData({ ...formData, yearsExperience: value })}
                >
                  <SelectTrigger className="bg-secondary border-border mt-2">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="2-3">2-3 years</SelectItem>
                    <SelectItem value="4-5">4-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="strengths">Your Key Strengths (Optional)</Label>
                <Textarea
                  id="strengths"
                  placeholder="What makes you stand out as a candidate?"
                  value={formData.keyStrengths}
                  onChange={(e) => setFormData({ ...formData, keyStrengths: e.target.value })}
                  className="bg-secondary border-border mt-2 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="why">Why did you relocate? (Optional)</Label>
                <Textarea
                  id="why"
                  placeholder="Share your story briefly..."
                  value={formData.whyMove}
                  onChange={(e) => setFormData({ ...formData, whyMove: e.target.value })}
                  className="bg-secondary border-border mt-2 min-h-[100px]"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Mic className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Record Your Voice</h2>
              <p className="text-muted-foreground">Read the sentence below so we can capture your voice</p>
            </div>

            <div className="bg-secondary/50 rounded-xl p-6 border border-border">
              <p className="text-lg text-center text-foreground leading-relaxed">
                "Hello, my name is [Your Name] and I am excited to share my professional journey with you."
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              {!recordingComplete ? (
                <Button
                  size="xl"
                  variant={isRecording ? "destructive" : "hero"}
                  onClick={isRecording ? () => setIsRecording(false) : startRecording}
                  className="min-w-48"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex items-center gap-3 text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-medium">Voice recorded successfully!</span>
                </div>
              )}

              {isRecording && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <span className="text-muted-foreground">Recording...</span>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Complete Your Order</h2>
              <p className="text-muted-foreground">One-time payment for your AI video CV</p>
            </div>

            <div className="bg-gradient-card rounded-xl border border-border p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">AI Video CV Generation</span>
                <span className="font-semibold text-foreground">$19.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">HD Download</span>
                <span className="text-primary">Included</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">QR Code</span>
                <span className="text-primary">Included</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">$19.00</span>
              </div>
            </div>

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay with PayPal
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by PayPal. You'll be redirected to complete payment.
            </p>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your Video is Ready!</h2>
              <p className="text-muted-foreground">
                Congratulations! Your AI-generated video CV is complete.
              </p>
            </div>

            {/* Video Preview */}
            <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
              <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Click to play your video</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center py-6">
              <div className="bg-white p-4 rounded-xl mb-4">
                <QRCodeSVG value={generatedVideoUrl} size={150} />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Scan to share your video CV
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </Button>
              <Button variant="hero" size="lg">
                <QrCodeIcon className="w-4 h-4 mr-2" />
                Share QR Code
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center ${
                    step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    step.id < currentStep 
                      ? "bg-primary text-primary-foreground" 
                      : step.id === currentStep 
                        ? "bg-primary/20 border-2 border-primary text-primary"
                        : "bg-secondary border border-border"
                  }`}>
                    {step.id < currentStep ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="bg-gradient-card rounded-2xl border border-border p-8 shadow-elegant">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation */}
            {currentStep < 6 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                {currentStep < 5 && (
                  <Button
                    variant="hero"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImmigrantFlow;
