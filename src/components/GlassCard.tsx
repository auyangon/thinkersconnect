import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
  hover?: boolean;
  gradient?: string; // optional inline gradient override
}

export default function GlassCard({
  children, className = '', onClick, delay = 0, hover = false, gradient
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { scale: 1.018, y: -3, boxShadow: '0 8px 40px rgba(26,158,120,0.14)' } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`glass-card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={gradient ? { background: gradient } : undefined}
    >
      {children}
    </motion.div>
  );
}
