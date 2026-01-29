import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments, Appointment } from '@/hooks/useAppointments';
import Header from '@/components/Header';
import { AttendanceButtons, ResolvedButtons } from '@/components/AppointmentStatusButtons';
import { 
  LogOut, Calendar, Clock, User, 
  MessageSquare, Filter, Loader2, Save, FileText
} from 'lucide-react';
import { toast } from 'sonner';

const PainelCoordenador = () => {
  const { user, logout, isAuthenticated, isGeneralCoordinator } = useAuth();
  const navigate = useNavigate();
  const { appointments, loading, updateAppointment } = useAppointments(user?.id);
  
  const [filterDate, setFilterDate] = useState<string>('');
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  // Redireciona se não autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redireciona coordenador geral para sua página específica
  if (isGeneralCoordinator) {
    return <Navigate to="/geral" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logout realizado com sucesso');
  };

  const handleAttendanceChange = async (appointment: Appointment) => {
    try {
      await updateAppointment(appointment.id, { attended: !appointment.attended });
      toast.success(appointment.attended ? 'Marcado como não compareceu' : 'Marcado como compareceu');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleResolvedChange = async (appointment: Appointment) => {
    try {
      await updateAppointment(appointment.id, { resolved: !appointment.resolved });
      toast.success(appointment.resolved ? 'Marcado como não resolvido' : 'Marcado como resolvido');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleNotesChange = (id: string, notes: string) => {
    setEditingNotes(prev => ({ ...prev, [id]: notes }));
  };

  const saveNotes = async (id: string) => {
    const notes = editingNotes[id];
    if (notes === undefined) return;
    
    try {
      await updateAppointment(id, { notes });
      setEditingNotes(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      toast.success('Anotações salvas');
    } catch (error) {
      toast.error('Erro ao salvar anotações');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (!filterDate) return true;
    return apt.date === filterDate;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const Icon = user.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title={`Painel - ${user.shortName}`} />
      
      {/* Toolbar */}
      <div className="bg-card border-b border-border py-4 px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-badge">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">Painel de Agendamentos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="input-field text-sm py-2"
              />
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-muted-foreground">
              {filterDate ? 'Não há agendamentos para a data selecionada.' : 'Ainda não há agendamentos para sua coordenação.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm mb-4">
              {filteredAppointments.length} agendamento(s) encontrado(s)
            </p>
            
            {filteredAppointments.map(appointment => (
              <div 
                key={appointment.id}
                className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm"
              >
                {/* Header com info do aluno */}
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">{appointment.studentName}</span>
                      {appointment.period && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          {appointment.period}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(appointment.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </span>
                    </div>
                  </div>

                  {/* Botões de Status */}
                  <div className="flex flex-wrap items-center gap-4">
                    <AttendanceButtons 
                      attended={appointment.attended} 
                      onToggle={() => handleAttendanceChange(appointment)} 
                    />
                    <ResolvedButtons 
                      resolved={appointment.resolved ?? false} 
                      onToggle={() => handleResolvedChange(appointment)} 
                    />
                  </div>
                </div>

                {/* Motivo do Agendamento */}
                {appointment.reason && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Motivo:</span>
                        <p className="text-sm text-foreground">{appointment.reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Anotações */}
                <div className="mt-4 pt-4 border-t border-border">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Anotações do Coordenador
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingNotes[appointment.id] ?? appointment.notes}
                      onChange={e => handleNotesChange(appointment.id, e.target.value)}
                      placeholder="Adicionar anotações..."
                      className="input-field flex-1 py-2 text-sm"
                    />
                    {editingNotes[appointment.id] !== undefined && (
                      <button
                        onClick={() => saveNotes(appointment.id)}
                        className="btn-secondary py-2 px-4"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
};

export default PainelCoordenador;
