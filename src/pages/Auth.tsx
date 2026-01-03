import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Video, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/immigrant");
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    setIsLoading(false);
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Welcome back!");
      navigate("/immigrant");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const fullName = `${signupData.firstName} ${signupData.lastName}`;
    const { error } = await signUp(signupData.email, signupData.password, fullName);
    setIsLoading(false);
    
    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Account created successfully!");
      navigate("/immigrant");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Welcome to AI VidCV</h1>
              <p className="text-muted-foreground">
                Create your account or sign in to get started
              </p>
            </motion.div>

            {/* Auth Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-card rounded-2xl border border-border p-6 shadow-elegant"
            >
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="pl-10 bg-secondary border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="pl-10 pr-10 bg-secondary border-border"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <Link to="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative mt-2">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={signupData.firstName}
                            onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                            className="pl-10 bg-secondary border-border"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="relative mt-2">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={signupData.lastName}
                            onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                            className="pl-10 bg-secondary border-border"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="pl-10 bg-secondary border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="pl-10 pr-10 bg-secondary border-border"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          className="pl-10 bg-secondary border-border"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
