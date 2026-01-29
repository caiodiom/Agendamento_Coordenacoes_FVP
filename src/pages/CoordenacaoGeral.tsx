import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAllAppointments, Appointment } from '@/hooks/useAppointments';
import Header from '@/components/Header';
import { coordinations, getCoordinationById } from '@/lib/coordinations';
import { 
  LogOut, Calendar, Clock, User, CheckCircle, XCircle, 
  Filter, Loader2, Save, Building2, BarChart3,
  Users, TrendingUp, FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';

const CoordenacaoGeral = () => {
  const { user, logout, isAuthenticated, isGeneralCoordinator } = useAuth();
  const navigate = useNavigate();
  const { appointments, loading, updateAppointment } = useAllAppointments();
  
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterCoordination, setFilterCoordination] = useState<string>('');
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isGeneralCoordinator) {
    return <Navigate to="/painel" replace />;
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
    if (filterDate && apt.date !== filterDate) return false;
    if (filterCoordination && apt.coordinationId !== filterCoordination) return false;
    return true;
  });

  const totalAppointments = appointments.length;
  const attendedCount = appointments.filter(a => a.attended).length;
  const attendanceRate = totalAppointments > 0 
    ? Math.round((attendedCount / totalAppointments) * 100) 
    : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const exportToCSV = () => {
    const headers = ['Aluno', 'Coordenação', 'Data', 'Horário', 'Compareceu', 'Anotações'];
    const rows = filteredAppointments.map(apt => {
      const coord = getCoordinationById(apt.coordinationId);
      return [
        apt.studentName,
        coord?.shortName || apt.coordinationId,
        formatDate(apt.date),
        apt.time,
        apt.attended ? 'Sim' : 'Não',
        apt.notes || ''
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `agendamentos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Relatório exportado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Coordenação Geral" />
      
      <div className="bg-card border-b border-border py-4 px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-badge">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Dashboard Geral</h2>
              <p className="text-sm text-muted-foreground">Visão completa de todos os agendamentos</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Agendamentos</p>
                <p className="text-2xl font-bold text-foreground">{totalAppointments}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comparecimentos</p>
                <p className="text-2xl font-bold text-foreground">{attendedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Presença</p>
                <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="input-field text-sm py-2"
              />
              
              <select
                value={filterCoordination}
                onChange={e => setFilterCoordination(e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="">Todas as Coordenações</option>
                {coordinations.map(coord => (
                  <option key={coord.id} value={coord.id}>
                    {coord.shortName}
                  </option>
                ))}
              </select>
              
              <button
                onClick={exportToCSV}
                className="btn-gold py-2 px-4 flex items-center gap-2 text-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-muted-foreground">
              Ajuste os filtros ou aguarde novos agendamentos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              {filteredAppointments.length} agendamento(s) encontrado(s)
            </p>
            
            {filteredAppointments.map(appointment => {
              const coord = getCoordinationById(appointment.coordinationId);
              const CoordIcon = coord?.icon || Building2;
              
              return (
                <div 
                  key={appointment.id}
                  className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">{appointment.studentName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CoordIcon className="w-4 h-4 text-secondary" />
                          {coord?.shortName}
                        </span>
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

                    <button
                      onClick={() => handleAttendanceChange(appointment)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        appointment.attended 
                          ? 'bg-secondary/20 text-secondary' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {appointment.attended ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Compareceu</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span>Não compareceu</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
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
              );
            })}
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

export default CoordenacaoGeral;
