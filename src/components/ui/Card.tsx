import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, title, description, footer, children, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden",
        className
      )} 
      {...props}
    >
      {(title || description) && (
        <div className="p-6 border-b border-neutral-100">
          {title && <h3 className="text-lg font-bold text-neutral-900">{title}</h3>}
          {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100">
          {footer}
        </div>
      )}
    </div>
  );
};
