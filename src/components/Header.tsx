import React from 'react';
import logoFVP from '@/assets/logo-fvp.jpg';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = "Sistema de Agendamento", showLogo = true }) => {
  return (
    <header className="header-gradient text-primary-foreground py-4 px-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showLogo && (
            <div className="bg-white rounded-lg p-1 shadow-md">
              <img 
                src={logoFVP} 
                alt="Faculdade Vale do Pajeú" 
                className="h-12 w-auto object-contain"
              />
            </div>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
            <p className="text-sm opacity-90 hidden sm:block">Faculdade Vale do Pajeú</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm opacity-80">Atendimento</p>
          <p className="font-semibold">18:30 - 22:00</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
