import { Scale, Brain, Calculator, Briefcase, GraduationCap, Stethoscope, Dog, SmilePlus, Building2 } from 'lucide-react';

export interface Coordination {
  id: string;
  name: string;
  shortName: string;
  icon: any;
  days: number[]; // 0 = Domingo, 1 = Segunda, etc.
  credentials: {
    user: string;
    password: string;
  };
}

// ========================================
// CONFIGURAÇÃO DOS DIAS DE ATENDIMENTO
// EDITE AQUI PARA ALTERAR OS DIAS
// 0 = Domingo, 1 = Segunda, 2 = Terça, 
// 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
// ========================================

export const coordinations: Coordination[] = [
  {
    id: 'geral',
    name: 'Coordenação Geral',
    shortName: 'Direção Academica',
    icon: Building2,
    days: [1, 3, 5], // Segunda, Quarta e Sexta
    credentials: { user: 'geral', password: 'geral123' }
  },
  {
    id: 'direito',
    name: 'Coordenação de Direito',
    shortName: 'Direito',
    icon: Scale,
    days: [1, 3], // Segunda, Quarta
    credentials: { user: 'direito', password: 'direito123' }
  },
  {
    id: 'psicologia',
    name: 'Coordenação de Psicologia',
    shortName: 'Psicologia',
    icon: Brain,
    days: [2, 4], // Terça, Quinta
    credentials: { user: 'psicologia', password: 'psicologia123' }
  },
  {
    id: 'contabeis',
    name: 'Coordenação de Ciências Contábeis',
    shortName: 'Contábeis',
    icon: Calculator,
    days: [1, 2], // Segunda, Terça
    credentials: { user: 'contabeis', password: 'contabeis123' }
  },
  {
    id: 'administracao',
    name: 'Coordenação de Administração',
    shortName: 'Administração',
    icon: Briefcase,
    days: [3, 4], // Quarta, Quinta
    credentials: { user: 'administracao', password: 'administracao123' }
  },
  {
    id: 'pedagogia',
    name: 'Coordenação de Pedagogia',
    shortName: 'Pedagogia',
    icon: GraduationCap,
    days: [2, 5], // Terça, Sexta
    credentials: { user: 'pedagogia', password: 'pedagogia123' }
  },
  {
    id: 'enfermagem',
    name: 'Coordenação de Enfermagem',
    shortName: 'Enfermagem',
    icon: Stethoscope,
    days: [1, 4], // Segunda e Quinta
    credentials: { user: 'enfermagem', password: 'enfermagem123' }
  },
  {
    id: 'veterinaria',
    name: 'Coordenação de Medicina Veterinária',
    shortName: 'Veterinária',
    icon: Dog,
    days: [4, 5], // Quinta, Sexta
    credentials: { user: 'veterinaria', password: 'veterinaria123' }
  },
  {
    id: 'odontologia',
    name: 'Coordenação de Odontologia',
    shortName: 'Odontologia',
    icon: SmilePlus,
    days: [3, 5], // Quarta, Sexta
    credentials: { user: 'odontologia', password: 'odontologia123' }
  }
];

export const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const dayNamesShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Gera os 8 slots de 15 minutos entre 18:30 e 21:30
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
let hour = 18;
let minute = 30;

for (let i = 0; i < 5; i++) {
  const timeString = `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;

  slots.push(timeString);

  minute += 45;
  if (minute >= 60) {
    minute -= 60; // mantém os minutos corretos
    hour++;
    }
  }

  return slots;
};

export const timeSlots = generateTimeSlots();

export const getCoordinationById = (id: string): Coordination | undefined => {
  return coordinations.find(c => c.id === id);
};

export const validateCredentials = (user: string, password: string): Coordination | null => {
  const coordination = coordinations.find(
    c => c.credentials.user === user && c.credentials.password === password
  );
  return coordination || null;
};
