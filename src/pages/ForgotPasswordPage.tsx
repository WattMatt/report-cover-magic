import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Loader2, ArrowLeft, Mail } from "lucide-react";

const emailSchema = z.string().email("Please enter a valid email address");

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return;
    }
    setEmailError(null);
    
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setEmailSent(true);
      toast.success("Password reset email sent!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                {emailSent ? (
                  <Mail className="h-8 w-8 text-primary" />
                ) : (
                  <FileText className="h-8 w-8 text-primary" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl">
              {emailSent ? "Check Your Email" : "Reset Password"}
            </CardTitle>
            <CardDescription>
              {emailSent
                ? "We've sent a password reset link to your email address."
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEmailSent(false)}
                    className="w-full"
                  >
                    Try another email
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/auth">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <p className="text-sm text-destructive">{emailError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/auth">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
