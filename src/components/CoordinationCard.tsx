import React from 'react';
import { Coordination } from '@/lib/coordinations';
import { dayNamesShort } from '@/lib/coordinations';

interface CoordinationCardProps {
  coordination: Coordination;
  onClick: () => void;
}

const CoordinationCard: React.FC<CoordinationCardProps> = ({ coordination, onClick }) => {
  const Icon = coordination.icon;
  
  const availableDays = coordination.days
    .map(d => dayNamesShort[d])
    .join(', ');

  return (
    <button
      onClick={onClick}
      className="card-coordination w-full text-left group focus:outline-none focus:ring-2 focus:ring-primary/50 p-3 sm:p-4"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-secondary to-accent text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base truncate">
            {coordination.shortName}
          </h3>
          <span className="text-[10px] sm:text-xs font-medium text-secondary">
            {availableDays}
          </span>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
        <span className="btn-gold text-[10px] sm:text-xs py-1.5 px-3 inline-block w-full text-center">
          Agendar
        </span>
      </div>
    </button>
  );
};

export default CoordinationCard;
