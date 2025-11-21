import React from 'react';
import { motion } from 'framer-motion';
interface BadgeProps {
  status: 'pending' | 'approved' | 'rejected';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export const Badge: React.FC<BadgeProps> = ({
  status,
  animated = false,
  size = 'md',
  className = ''
}) => {
  const statusClasses = {
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger'
  };
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5'
  };
  const statusText = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected'
  };
  const badge = <span className={`badge ${statusClasses[status]} ${sizeClasses[size]} ${className}`}>
      {statusText[status]}
    </span>;
  if (animated) {
    return <motion.div initial={{
      scale: 0.8,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      duration: 0.2
    }}>
        {badge}
      </motion.div>;
  }
  return badge;
};