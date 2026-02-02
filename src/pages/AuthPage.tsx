import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import OAuthLoadingOverlay from "@/components/OAuthLoadingOverlay";
import AuthLoadingSkeleton from "@/components/auth/AuthLoadingSkeleton";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthDivider from "@/components/auth/AuthDivider";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const OAUTH_TIMEOUT_MS = 15000;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [oauthTimedOut, setOauthTimedOut] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const oauthTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (oauthTimeoutRef.current) {
        clearTimeout(oauthTimeoutRef.current);
      }
    };
  }, []);

  const startOAuthTimeout = () => {
    oauthTimeoutRef.current = setTimeout(() => {
      setOauthTimedOut(true);
    }, OAUTH_TIMEOUT_MS);
  };

  const cancelOAuth = () => {
    if (oauthTimeoutRef.current) {
      clearTimeout(oauthTimeoutRef.current);
    }
    setIsGoogleLoading(false);
    setIsAppleLoading(false);
    setOauthTimedOut(false);
  };

  const validateForm = (isSignUp = false) => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (isSignUp) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message);
      }
    } else {
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
        sessionStorage.setItem("tempSession", "true");
      }
      toast.success("Signed in successfully!");
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Check your email to confirm your account!");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setOauthTimedOut(false);
    startOAuthTimeout();

    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (error) {
      toast.error(error.message || "Failed to sign in with Google");
      cancelOAuth();
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    setOauthTimedOut(false);
    startOAuthTimeout();

    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });

    if (error) {
      toast.error(error.message || "Failed to sign in with Apple");
      cancelOAuth();
    }
  };

  if (isGoogleLoading || isAppleLoading) {
    const currentProvider = isGoogleLoading ? "google" : "apple";
    return (
      <OAuthLoadingOverlay
        provider={currentProvider}
        isTimedOut={oauthTimedOut}
        onCancel={cancelOAuth}
        onRetry={isGoogleLoading ? handleGoogleSignIn : handleAppleSignIn}
      />
    );
  }

  if (authLoading) {
    return <AuthLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94],
          scale: { duration: 0.3 }
        }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Report Page Generator</CardTitle>
            <CardDescription>
              Sign in to sync your templates across devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-0"
                >
                  <motion.div variants={itemVariants}>
                    <SocialAuthButtons
                      onGoogleClick={handleGoogleSignIn}
                      onAppleClick={handleAppleSignIn}
                      isGoogleLoading={isGoogleLoading}
                      isAppleLoading={isAppleLoading}
                      isLoading={isLoading}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <AuthDivider />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <SignInForm
                      email={email}
                      password={password}
                      rememberMe={rememberMe}
                      errors={errors}
                      isLoading={isLoading}
                      onEmailChange={setEmail}
                      onPasswordChange={setPassword}
                      onRememberMeChange={setRememberMe}
                      onSubmit={handleSignIn}
                    />
                  </motion.div>
                </motion.div>
              </TabsContent>

              <TabsContent value="signup">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-0"
                >
                  <motion.div variants={itemVariants}>
                    <SocialAuthButtons
                      onGoogleClick={handleGoogleSignIn}
                      onAppleClick={handleAppleSignIn}
                      isGoogleLoading={isGoogleLoading}
                      isAppleLoading={isAppleLoading}
                      isLoading={isLoading}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <AuthDivider />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <SignUpForm
                      email={email}
                      password={password}
                      confirmPassword={confirmPassword}
                      errors={errors}
                      isLoading={isLoading}
                      onEmailChange={setEmail}
                      onPasswordChange={setPassword}
                      onConfirmPasswordChange={setConfirmPassword}
                      onSubmit={handleSignUp}
                    />
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
