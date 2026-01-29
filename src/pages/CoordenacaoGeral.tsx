import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAllAppointments, Appointment } from '@/hooks/useAppointments';
import Header from '@/components/Header';
import { AttendanceButtons, ResolvedButtons } from '@/components/AppointmentStatusButtons';
import { coordinations, getCoordinationById } from '@/lib/coordinations';
import {
  LogOut, Calendar, Clock, User, CheckCircle,
  Filter, Loader2, Save, Building2, BarChart3,
  Users, TrendingUp, FileText
} from 'lucide-react';
import { toast } from 'sonner';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CoordenacaoGeral = () => {
  const { user, logout, isAuthenticated, isGeneralCoordinator } = useAuth();
  const navigate = useNavigate();
  const { appointments, loading, updateAppointment } = useAllAppointments();

  const [filterDate, setFilterDate] = useState('');
  const [filterCoordination, setFilterCoordination] = useState('');
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (!isGeneralCoordinator) return <Navigate to="/painel" replace />;

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logout realizado com sucesso');
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterDate && apt.date !== filterDate) return false;
    if (filterCoordination && apt.coordinationId !== filterCoordination) return false;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  /* ================= EXPORTAR PDF ================= */
  const exportToPDF = () => {
    if (filteredAppointments.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const doc = new jsPDF('landscape');

    doc.setFontSize(16);
    doc.text('Relatório de Agendamentos', 14, 15);

    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);

    const columns = [
      'Aluno',
      'Período',
      'Coordenação',
      'Data',
      'Horário',
      'Motivo',
      'Compareceu',
      'Resolvido',
      'Anotações',
    ];

    const rows = filteredAppointments.map(apt => {
      const coord = getCoordinationById(apt.coordinationId);

      return [
        apt.studentName,
        apt.period || '-',
        coord?.shortName || apt.coordinationId,
        formatDate(apt.date),
        apt.time,
        apt.reason || '-',
        apt.attended ? 'Sim' : 'Não',
        apt.resolved ? 'Sim' : 'Não',
        apt.notes || '',
      ];
    });

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 10, right: 10 },
    });

    doc.save(`agendamentos_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF gerado com sucesso!');
  };
  /* ================================================= */

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Coordenação Geral" />

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* FILTROS */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Filter className="w-4 h-4 text-muted-foreground" />

            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="input-field text-sm"
            />

            <select
              value={filterCoordination}
              onChange={e => setFilterCoordination(e.target.value)}
              className="input-field text-sm"
            >
              <option value="">Todas as Coordenações</option>
              {coordinations.map(coord => (
                <option key={coord.id} value={coord.id}>
                  {coord.shortName}
                </option>
              ))}
            </select>

            <button
              onClick={exportToPDF}
              className="btn-gold px-4 py-2 flex items-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4" />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* LISTAGEM */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          filteredAppointments.map(appointment => {
            const coord = getCoordinationById(appointment.coordinationId);
            return (
              <div key={appointment.id} className="bg-card p-4 rounded-xl border mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{appointment.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {coord?.shortName} • {formatDate(appointment.date)} • {appointment.time}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <AttendanceButtons
                      attended={appointment.attended}
                      onToggle={() =>
                        updateAppointment(appointment.id, { attended: !appointment.attended })
                      }
                    />
                    <ResolvedButtons
                      resolved={appointment.resolved ?? false}
                      onToggle={() =>
                        updateAppointment(appointment.id, { resolved: !appointment.resolved })
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-2 bg-muted text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Faculdade Vale do Pajeú
        </p>
        <p className="text-xs text-muted-foreground">
          Desenvolvido por{' '}
          <a
            href="https://caiodiom.github.io/portfolio-caio/"
            target="_blank"
            rel="noopener"
          >
            Caio Braga
          </a>
        </p>
      </footer>
    </div>
  );
};

export default CoordenacaoGeral;
