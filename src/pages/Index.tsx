import React, { useState } from 'react';
import Header from '@/components/Header';
import CoordinationCard from '@/components/CoordinationCard';
import AppointmentModal from '@/components/AppointmentModal';
import { coordinations, Coordination } from '@/lib/coordinations';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Index = () => {
  const [selectedCoordination, setSelectedCoordination] = useState<Coordination | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Agendamento de Atendimentos" />
      
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex flex-col">
        <div className="text-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">
            Escolha uma Coordenação
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Selecione a coordenação desejada para agendar seu atendimento
          </p>
        </div>

        {/* Grid de Coordenações - 2 colunas mobile, 3 tablet, 3-4 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-6xl mx-auto flex-1">
          {coordinations.map(coordination => (
            <CoordinationCard
              key={coordination.id}
              coordination={coordination}
              onClick={() => setSelectedCoordination(coordination)}
            />
          ))}
        </div>

        {/* Link removido - coordenadores acessam diretamente via /login */}
      </main>

      {/* Footer Compacto */}
      <footer className="py-2 px-4 bg-muted text-center">
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          © {new Date().getFullYear()} Faculdade Vale do Pajeú
        </p>

        <p className="text-[10px] sm:text-xs      text-muted-foreground">
              Desenvolvido por 
          <a href="https://caiodiom.github.io/portfolio-caio/"      target="_blank" rel="noopener"> Caio Braga 🔗
          </a>
        </p>


      </footer>

      {/* Modal de Agendamento */}
      {selectedCoordination && (
        <AppointmentModal
          coordination={selectedCoordination}
          onClose={() => setSelectedCoordination(null)}
        />
      )}
    </div>
  );
};

export default Index;
