import { motion } from "framer-motion";

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large floating circle - top left */}
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Medium floating circle - top right */}
      <motion.div
        className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-accent/5 blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Small floating circle - bottom left */}
      <motion.div
        className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-primary/8 blur-2xl"
        animate={{
          x: [0, 20, 0],
          y: [0, -25, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Medium floating circle - bottom right */}
      <motion.div
        className="absolute -bottom-10 -right-20 w-64 h-64 rounded-full bg-accent/6 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Small accent dot - floating */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-primary/20"
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Small accent dot - floating */}
      <motion.div
        className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-accent/25"
        animate={{
          y: [0, 25, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      {/* Tiny floating dot */}
      <motion.div
        className="absolute top-1/2 left-1/3 w-1.5 h-1.5 rounded-full bg-primary/15"
        animate={{
          x: [0, 15, 0],
          y: [0, -20, 0],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </div>
  );
};

export default FloatingElements;
