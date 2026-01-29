import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, CheckCircle, Loader2, FileText, GraduationCap } from 'lucide-react';
import { Coordination, dayNames, timeSlots } from '@/lib/coordinations';
import { useAppointments } from '@/hooks/useAppointments';
import { toast } from 'sonner';

interface AppointmentModalProps {
  coordination: Coordination;
  onClose: () => void;
}

// Opções de período
const PERIODS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'];

const AppointmentModal: React.FC<AppointmentModalProps> = ({ coordination, onClose }) => {
  const [studentName, setStudentName] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [reason, setReason] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { createAppointment, getBookedSlots } = useAppointments(coordination.id);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Configuração: dias no futuro para mostrar
  const DAYS_AHEAD = 30;
  
  const getAvailableDates = () => {
    const dates: { date: Date; formatted: string; dayOfWeek: number }[] = [];
    const today = new Date();
    
    for (let i = 0; i < DAYS_AHEAD; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      
      if (coordination.days.includes(dayOfWeek)) {
        dates.push({
          date,
          formatted: date.toISOString().split('T')[0],
          dayOfWeek
        });
      }
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();

  useEffect(() => {
    if (selectedDate) {
      const slots = getBookedSlots(coordination.id, selectedDate);
      setBookedSlots(slots);
    }
  }, [selectedDate, coordination.id, getBookedSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim()) {
      toast.error('Por favor, informe seu nome completo');
      return;
    }

    if (!selectedPeriod) {
      toast.error('Por favor, selecione seu período');
      return;
    }

    if (!reason.trim()) {
      toast.error('Por favor, informe o motivo do agendamento');
      return;
    }
    
    if (!selectedDate) {
      toast.error('Por favor, selecione uma data');
      return;
    }
    
    if (!selectedTime) {
      toast.error('Por favor, selecione um horário');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createAppointment({
        coordinationId: coordination.id,
        studentName: studentName.trim(),
        period: selectedPeriod,
        reason: reason.trim(),
        date: selectedDate,
        time: selectedTime
      });
      
      setSuccess(true);
      toast.success('Agendamento realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao realizar agendamento. Tente novamente.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateDisplay = (dateStr: string, dayOfWeek: number) => {
    const date = new Date(dateStr + 'T12:00:00');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${dayNames[dayOfWeek].substring(0, 3)} ${day}/${month}`;
  };

  const Icon = coordination.icon;

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content p-4 sm:p-6 text-center max-w-md" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Agendamento Confirmado!</h2>
          <p className="text-sm text-muted-foreground mb-4">Seu atendimento foi agendado com sucesso.</p>
          
          <div className="bg-muted rounded-xl p-3 mb-4 text-left text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-secondary" />
              <span className="font-medium">{coordination.name}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{studentName} - {selectedPeriod}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{reason}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{selectedTime}</span>
            </div>
          </div>
          
          <button onClick={onClose} className="btn-primary w-full py-2">
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header Compacto */}
        <div className="header-gradient p-3 sm:p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{coordination.shortName}</h2>
                <p className="text-xs text-white/80">Agendar atendimento</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Form Compacto */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3">
          {/* Nome e Período na mesma linha */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-foreground mb-1">
                <User className="w-3 h-3 inline mr-1" />
                Nome Completo
              </label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Seu nome"
                className="input-field py-2 text-sm"
                required
              />
            </div>
            <div className="w-24 sm:w-28">
              <label className="block text-xs font-medium text-foreground mb-1">
                <GraduationCap className="w-3 h-3 inline mr-1" />
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value)}
                className="input-field py-2 text-sm"
                required
              >
                <option value="">Selecione</option>
                {PERIODS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Motivo do Agendamento */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              <FileText className="w-3 h-3 inline mr-1" />
              Motivo do Agendamento
            </label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Informe o motivo do seu atendimento"
              className="input-field py-2 text-sm"
              maxLength={100}
              required
            />
          </div>

          {/* Seleção de Data */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-2">
              <Calendar className="w-3 h-3 inline mr-1" />
              Selecione o Dia
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {availableDates.length === 0 ? (
                <p className="text-muted-foreground text-xs">Nenhuma data disponível.</p>
              ) : (
                availableDates.slice(0, 12).map(({ formatted, dayOfWeek }) => (
                  <button
                    key={formatted}
                    type="button"
                    onClick={() => {
                      setSelectedDate(formatted);
                      setSelectedTime('');
                    }}
                    className={`px-2 py-1 text-xs rounded-full font-medium transition-all ${
                      selectedDate === formatted 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'bg-secondary/10 text-secondary border border-secondary hover:bg-secondary hover:text-secondary-foreground'
                    }`}
                  >
                    {formatDateDisplay(formatted, dayOfWeek)}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Seleção de Horário */}
          {selectedDate && (
            <div className="animate-fade-in">
              <label className="block text-xs font-medium text-foreground mb-2">
                <Clock className="w-3 h-3 inline mr-1" />
                Selecione o Horário
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-1">
                {timeSlots.map(time => {
                  const isBooked = bookedSlots.includes(time);
                  const isSelected = selectedTime === time;
                  
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedTime(time)}
                      className={`px-1 py-1.5 text-xs rounded-lg border transition-all ${
                        isBooked 
                          ? 'bg-muted border-muted-foreground/20 text-muted-foreground cursor-not-allowed opacity-60' 
                          : isSelected 
                            ? 'bg-gold border-gold text-gold-foreground' 
                            : 'bg-secondary/10 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                * Horários em cinza já estão ocupados
              </p>
            </div>
          )}

          {/* Botão Confirmar */}
          <button
            type="submit"
            disabled={isSubmitting || !studentName || !selectedPeriod || !reason || !selectedDate || !selectedTime}
            className="btn-secondary w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Agendando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirmar Agendamento
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
