'use client';

import { ReactNode, useState } from 'react';
import clsx from 'clsx';

interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}

export function Popover({ children, content, className }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 p-2 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
            'min-w-[200px] max-w-[300px]',
            'transform -translate-y-2 translate-x-2',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
} 