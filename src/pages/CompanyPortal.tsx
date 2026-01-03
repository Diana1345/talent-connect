import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, Download, QrCode, Briefcase, Clock, MapPin, CreditCard, Lock, Loader2, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useVideos, usePayments, Video } from "@/hooks/useVideos";

const experienceOptions = ["All Experience", "0-2 years", "3-5 years", "6-10 years", "10+ years"];
const jobOptions = ["All Jobs", "Software Engineer", "Data Analyst", "UX Designer", "Product Manager", "DevOps Engineer", "Marketing Manager"];

const CompanyPortal = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { videos, isLoading: videosLoading, fetchAllVideos } = useVideos();
  const { hasActiveSubscription } = usePayments();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("All Experience");
  const [jobFilter, setJobFilter] = useState("All Jobs");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        const hasSubscription = await hasActiveSubscription();
        setIsSubscribed(hasSubscription || isAdmin);
      }
      setCheckingSubscription(false);
    };
    
    if (!authLoading) {
      checkSubscription();
    }
  }, [user, isAdmin, authLoading, hasActiveSubscription]);

  // Fetch all videos if admin or subscribed
  useEffect(() => {
    if (isSubscribed && (isAdmin || user)) {
      fetchAllVideos();
    }
  }, [isSubscribed, isAdmin, user]);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = 
      (video.target_role?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesJob = jobFilter === "All Jobs" || video.target_role === jobFilter;

    return matchesSearch && matchesJob;
  });

  if (authLoading || checkingSubscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Auth required
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <LogIn className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">Please sign in to access the company portal</p>
            <Button variant="hero" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Subscription paywall
  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                Subscribe to Access <span className="text-gradient">Video CVs</span>
              </h1>
              <p className="text-muted-foreground mb-8">
                Get unlimited access to all candidate video CVs with a monthly subscription.
              </p>

              <div className="bg-gradient-card rounded-xl border border-border p-6 mb-6">
                <div className="text-4xl font-bold text-primary mb-2">$49<span className="text-lg text-muted-foreground">/month</span></div>
                <ul className="text-left space-y-3 mt-6 mb-6">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">✓</span> Unlimited video CV access
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">✓</span> Download & share videos
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">✓</span> QR code generation
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">✓</span> Filter by role & experience
                  </li>
                </ul>
              </div>

              <Button 
                variant="hero" 
                size="xl" 
                className="w-full mb-4"
                onClick={() => {
                  window.open("https://www.paypal.com/ncp/payment/44X7DGQ5WSU2W", "_blank");
                  toast.info("After completing payment, click 'I've Subscribed' to access the portal.");
                }}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Subscribe with PayPal
              </Button>

              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={() => setIsSubscribed(true)}
              >
                I've Subscribed - Access Portal
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Secure payment powered by PayPal. Cancel anytime.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Company <span className="text-gradient">Portal</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse and manage all generated video CVs. Filter by job role, experience, and more.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-secondary border-border">
                <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Job Role" />
              </SelectTrigger>
              <SelectContent>
                {jobOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-secondary border-border">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                {experienceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6 mb-8"
          >
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">{filteredVideos.length}</span> videos found
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="text-primary font-semibold">{filteredVideos.filter(v => v.status === "completed").length}</span> completed
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="text-yellow-500 font-semibold">{filteredVideos.filter(v => v.status === "processing" || v.status === "pending").length}</span> processing
            </div>
          </motion.div>

          {/* Loading state */}
          {videosLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Video Grid */}
          {!videosLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gradient-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all group shadow-card hover:shadow-elegant"
                >
                  {/* Video Thumbnail */}
                  <div className="aspect-video bg-secondary/50 relative">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt="Video thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                          <Play className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <Badge 
                      className={`absolute top-3 right-3 ${
                        video.status === "completed" 
                          ? "bg-primary/20 text-primary border-primary/30" 
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {video.status}
                    </Badge>

                    {/* Role Overlay */}
                    <div className="absolute bottom-3 left-3 bg-secondary/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <p className="text-sm font-semibold text-foreground">{video.target_role || "Unknown Role"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {video.target_countries && video.target_countries.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {video.target_countries[0]}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          if (video.video_url) {
                            window.open(video.video_url, '_blank');
                          }
                        }}
                        disabled={video.status !== "completed" || !video.video_url}
                      >
                        <Play className="w-3.5 h-3.5 mr-1" />
                        Play
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedVideo(video);
                          setShowQR(true);
                        }}
                        disabled={video.status !== "completed" || !video.video_url}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          if (video.video_url) {
                            window.open(video.video_url, '_blank');
                          }
                        }}
                        disabled={video.status !== "completed" || !video.video_url}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!videosLoading && filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No videos found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Share Video CV</DialogTitle>
          </DialogHeader>
          {selectedVideo && selectedVideo.video_url && (
            <div className="flex flex-col items-center py-6">
              <div className="bg-white p-4 rounded-xl mb-4">
                <QRCodeSVG 
                  value={selectedVideo.video_url} 
                  size={200}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Scan this QR code to view this video CV
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyPortal;
