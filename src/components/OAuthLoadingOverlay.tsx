import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import wmLogo from "@/assets/wm-logo.jpg";

interface OAuthLoadingOverlayProps {
  provider: "google" | "apple";
  isTimedOut: boolean;
  onCancel: () => void;
  onRetry: () => void;
}

const OAuthLoadingOverlay = ({
  provider,
  isTimedOut,
  onCancel,
  onRetry,
}: OAuthLoadingOverlayProps) => {
  const providerName = provider === "google" ? "Google" : "Apple";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <motion.img
        src={wmLogo}
        alt="App Logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="h-16 w-16 rounded-full object-cover mb-6"
      />

      {isTimedOut ? (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10"
          >
            <AlertCircle className="h-8 w-8 text-destructive" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg font-medium text-foreground"
          >
            Connection timed out
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm text-muted-foreground text-center max-w-xs"
          >
            The redirect is taking longer than expected. Please try again.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex gap-3"
          >
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onRetry}>
              Try Again
            </Button>
          </motion.div>
        </>
      ) : (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20" />
            </div>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg font-medium text-foreground"
          >
            Connecting to {providerName}...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            You'll be redirected shortly
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onCancel}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Cancel
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default OAuthLoadingOverlay;
