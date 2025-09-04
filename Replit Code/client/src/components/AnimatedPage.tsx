import { motion } from "framer-motion";
import { ReactNode } from "react";

type AnimationVariant = "fade" | "slideUp" | "slideLeft" | "scale";

type AnimatedPageProps = {
  children: ReactNode;
  variant?: AnimationVariant;
};

// Animation variants
const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  }
};

export default function AnimatedPage({ children, variant = "slideUp" }: AnimatedPageProps) {
  return (
    <motion.div
      variants={animations[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration: 0.3,
        ease: "easeInOut" 
      }}
    >
      {children}
    </motion.div>
  );
} 