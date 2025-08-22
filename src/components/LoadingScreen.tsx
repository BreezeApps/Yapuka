import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type LoadingScreenProps = {
  message?: string;
};

/* This code defines a React functional component called `LoadingScreen` that displays a loading
animation with a spinning circle and a text message with animated dots. */
export function LoadingScreen({ message = "Chargement de Yapuka..." }: LoadingScreenProps) {
  const [dots, setDots] = useState("");

  // Animation des "..."
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  });
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 z-50">

      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>

      {/* Texte animé */}
      <motion.p
        className="mt-6 text-xl font-semibold text-gray-700"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}{dots}
      </motion.p>
    </div>
  );
}