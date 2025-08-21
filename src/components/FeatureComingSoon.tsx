import React from "react";
import { motion } from "framer-motion";

type FeatureComingSoonProps = {
  children: React.ReactNode;
  message?: string;
  className?: string;
};

function FeatureComingSoon({
  children,
  message = "Bientôt disponible",
  className = "",
} : FeatureComingSoonProps) {
  return (
    <div className={`relative pointer-events-none ${className}`}>
      {children}

      <motion.div
        className="absolute inset-0 bg-gray-300 bg-opacity-60 backdrop-blur-sm flex items-center justify-center rounded-xl pointer-events-none"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.8, scale: 1.05 }}
        transition={{ duration: 0.05 }}
      >
        <motion.span
          className="text-gray-700 font-medium text-sm"
          animate={{ scale: [0.99, 1, 0.99] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          {message}
        </motion.span>
      </motion.div>
    </div>
  );
};

export default FeatureComingSoon;
