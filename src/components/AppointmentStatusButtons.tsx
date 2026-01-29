import React from 'react';
import { Check, X } from 'lucide-react';

interface AttendanceButtonsProps {
  attended: boolean;
  onToggle: () => void;
}

export const AttendanceButtons = ({ attended, onToggle }: AttendanceButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Compareceu:</span>
      <button
        onClick={onToggle}
        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
          attended 
            ? 'bg-green-500 text-white shadow-md' 
            : 'bg-muted text-muted-foreground hover:bg-green-100'
        }`}
        title="Compareceu"
      >
        <Check className="w-5 h-5" />
      </button>
      <button
        onClick={onToggle}
        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
          !attended 
            ? 'bg-red-500 text-white shadow-md' 
            : 'bg-muted text-muted-foreground hover:bg-red-100'
        }`}
        title="Não Compareceu"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

interface ResolvedButtonsProps {
  resolved: boolean;
  onToggle: () => void;
}

export const ResolvedButtons = ({ resolved, onToggle }: ResolvedButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Resolvido:</span>
      <button
        onClick={() => !resolved && onToggle()}
        className={`flex items-center justify-center px-3 h-8 rounded-lg text-xs font-medium transition-all ${
          resolved 
            ? 'bg-green-500 text-white shadow-md' 
            : 'bg-muted text-muted-foreground hover:bg-green-100'
        }`}
      >
        Sim
      </button>
      <button
        onClick={() => resolved && onToggle()}
        className={`flex items-center justify-center px-3 h-8 rounded-lg text-xs font-medium transition-all ${
          !resolved 
            ? 'bg-red-500 text-white shadow-md' 
            : 'bg-muted text-muted-foreground hover:bg-red-100'
        }`}
      >
        Não
      </button>
    </div>
  );
};
