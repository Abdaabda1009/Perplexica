'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, BrainCircuit } from 'lucide-react';

interface ThinkBoxProps {
  content: string;
}

const ThinkBox = ({ content }: ThinkBoxProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-4 bg-light-secondary/50 dark:bg-dark-secondary/50 rounded-xl border border-light-200 dark:border-dark-200 overflow-hidden shadow-sm dark:shadow-dark-100/20 transition-all duration-300 hover:shadow-md dark:hover:shadow-dark-100/30">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-black/90 dark:text-white/90 hover:bg-light-200/40 dark:hover:bg-dark-200/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] dark:focus:ring-[#CE93D8] focus:ring-offset-2 focus:ring-offset-light-100 dark:focus:ring-offset-dark-100"
      >
        <div className="flex items-center space-x-3">
          <BrainCircuit
            size={20}
            className="text-[#9C27B0] dark:text-[#CE93D8] shrink-0"
          />
          <p className="font-semibold text-sm">Thinking Process</p>
        </div>
        <ChevronDown 
          size={18}
          className={cn(
            "text-black/70 dark:text-white/70 transition-transform duration-300",
            isExpanded ? "rotate-180" : ""
          )}
        />
      </button>

      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 py-4 text-black/80 dark:text-white/80 text-base leading-relaxed border-t border-light-200/50 dark:border-dark-200/50 bg-light-100/30 dark:bg-dark-100/30 whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
};

export default ThinkBox;