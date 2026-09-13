import React from 'react';
import { getStatusColor } from '../../lib/utils';
import type { CircularStatus } from '../../types';

interface StatusBadgeProps {
  status: CircularStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
}) => {
  const color = getStatusColor(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${color.bg} ${color.text} ${color.border} ${sizeClasses}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${color.dot} animate-pulse`} />
      )}
      {status}
    </span>
  );
};
