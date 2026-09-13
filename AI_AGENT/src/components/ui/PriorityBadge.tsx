import React from 'react';
import { getPriorityColor } from '../../lib/utils';
import type { PriorityLevel } from '../../types';
import { AlertCircle, AlertTriangle, Info, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel | string;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showIcon = true,
}) => {
  const color = getPriorityColor(priority);

  const getIcon = () => {
    switch (priority) {
      case 'Critical':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'High':
        return <AlertTriangle className="w-3 h-3 text-orange-500" />;
      case 'Medium':
        return <Info className="w-3 h-3 text-blue-500" />;
      case 'Low':
      default:
        return <ArrowDown className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${color.badgeBg}`}
    >
      {showIcon && getIcon()}
      {priority}
    </span>
  );
};
