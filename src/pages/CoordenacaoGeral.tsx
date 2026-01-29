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
  Users, TrendingUp, FileSpreadsheet, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoFVP from '@/assets/logo-fvp.jpg';

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
    if (filterDate && apt.date !== filterDate) return false;
    if (filterCoordination && apt.coordinationId !== filterCoordination) return false;
    return true;
  });

  const totalAppointments = appointments.length;
  const attendedCount = appointments.filter(a => a.attended).length;
  const resolvedCount = appointments.filter(a => a.resolved).length;
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

  /**
   * =====================================================
   * FUNÇÃO DE EXPORTAÇÃO PARA PDF
   * =====================================================
   * 
   * Esta função gera um PDF com cabeçalho institucional contendo:
   * - Logo da FVP no lado esquerdo
   * - Nome da instituição centralizado
   * - Linha separadora
   * - Tabela com todos os agendamentos filtrados
   * 
   * INSTRUÇÕES PARA ATUALIZAÇÕES:
   * 
   * 1. ALTERAR LOGO:
   *    - Substitua o arquivo em src/assets/logo-fvp.jpg
   *    - Ou altere o import no topo do arquivo para o novo caminho
   * 
   * 2. ALTERAR NOME DA INSTITUIÇÃO:
   *    - Modifique a constante INSTITUTION_NAME abaixo
   * 
   * 3. ALTERAR SUBTÍTULO:
   *    - Modifique a constante INSTITUTION_SUBTITLE abaixo
   * 
   * 4. ADICIONAR NOVAS COLUNAS NA TABELA:
   *    - Adicione o nome da coluna no array 'head'
   *    - Adicione o valor correspondente no array 'body'
   * 
   * 5. ALTERAR ESTILOS:
   *    - headStyles: estilos do cabeçalho da tabela
   *    - bodyStyles: estilos do corpo da tabela
   *    - alternateRowStyles: estilos para linhas alternadas
   * 
   * 6. ALTERAR TAMANHO DA PÁGINA:
   *    - Modifique o parâmetro 'format' em new jsPDF()
   *    - Opções: 'a4', 'letter', 'legal', etc.
   * 
   * 7. ALTERAR ORIENTAÇÃO:
   *    - Modifique o parâmetro 'orientation' para 'portrait' ou 'landscape'
   * =====================================================
   */
  const exportToPDF = () => {
    // Configurações da Instituição (modifique aqui para atualizar)
    const INSTITUTION_NAME = 'Faculdade Vale do Pajeú';
    const INSTITUTION_SUBTITLE = 'São José do Egito - PE';
    const REPORT_TITLE = 'Relatório de Agendamentos';

    // Criar documento PDF em formato A4, orientação paisagem para caber mais colunas
    const doc = new jsPDF({
      orientation: 'landscape', //portrait ou landscape
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // ===== CABEÇALHO COM LOGO =====
    // Adicionar logo no lado esquerdo
    const logoWidth = 40;
    const logoHeight = 25;
    
    try {
      doc.addImage(logoFVP, 'JPEG', margin, 10, logoWidth, logoHeight);
    } catch (error) {
      console.warn('Não foi possível carregar a logo:', error);
      // Continua sem a logo caso haja erro
    }

    // Nome da instituição (ao lado da logo)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41); // Cor escura
    doc.text(INSTITUTION_NAME, pageWidth / 2,20,{ align: 'center' });

    // Subtítulo (cidade)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(108, 117, 125); // Cor cinza
    doc.text(INSTITUTION_SUBTITLE, pageWidth / 2,28,{ align: 'center' });

    // ===== LINHA SEPARADORA =====
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, 40, pageWidth - margin, 40);

    // ===== TÍTULO DO RELATÓRIO =====
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text(REPORT_TITLE, margin, 50);

    // Data de geração
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(108, 117, 125);
    const currentDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Gerado em: ${currentDate}`, pageWidth - margin - 50, 50);

    // Informações de filtro aplicado
    let filterInfo = 'Filtros aplicados: ';
    if (filterDate) {
      filterInfo += `Data: ${formatDate(filterDate)} | `;
    }
    if (filterCoordination) {
      const coord = getCoordinationById(filterCoordination);
      filterInfo += `Coordenação: ${coord?.shortName || filterCoordination} | `;
    }
    if (!filterDate && !filterCoordination) {
      filterInfo += 'Nenhum';
    } else {
      filterInfo = filterInfo.slice(0, -3); // Remove último " | "
    }
    doc.setFontSize(9);
    doc.text(filterInfo, margin, 57);

    // Total de registros
    doc.text(`Total de registros: ${filteredAppointments.length}`, margin, 63);

    // ===== TABELA DE DADOS =====
    // Preparar dados para a tabela
    const tableData = filteredAppointments.map(apt => {
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
        apt.notes || '-'
      ];
    });

    // Gerar tabela com autoTable
    autoTable(doc, {
      startY: 68,
      head: [[
        'Aluno',
        'Período',
        'Coordenação',
        'Data',
        'Horário',
        'Motivo',
        'Compareceu',
        'Resolvido',
        'Anotações'
      ]],
      body: tableData,
      // Estilos do cabeçalho da tabela
      headStyles: {
        fillColor: [59, 130, 246], // Azul
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      // Estilos do corpo da tabela
      bodyStyles: {
        fontSize: 8,
        textColor: [33, 37, 41]
      },
      // Estilos para linhas alternadas
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      // Estilos das colunas específicas
      columnStyles: {
        0: { cellWidth: 40 }, // Aluno
        1: { cellWidth: 20, halign: 'center' }, // Período
        2: { cellWidth: 35 }, // Coordenação
        3: { cellWidth: 25, halign: 'center' }, // Data
        4: { cellWidth: 18, halign: 'center' }, // Horário
        5: { cellWidth: 50 }, // Motivo
        6: { cellWidth: 22, halign: 'center' }, // Compareceu
        7: { cellWidth: 22, halign: 'center' }, // Resolvido
        8: { cellWidth: 45 } // Anotações
      },
      // Margens
      margin: { left: margin, right: margin },
      // Adicionar número de página no rodapé
      didDrawPage: (data) => {
        // Rodapé com número da página
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Página ${data.pageNumber} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        // Rodapé com nome da instituição
        doc.text(
          `© ${new Date().getFullYear()} ${INSTITUTION_NAME}`,
          margin,
          pageHeight - 10
        );
      }
    });

    // ===== SALVAR PDF =====
    const fileName = `relatorio_agendamentos_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast.success('Relatório PDF exportado com sucesso!');
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
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
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comparecimentos</p>
                <p className="text-2xl font-bold text-foreground">{attendedCount}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolvidos</p>
                <p className="text-2xl font-bold text-foreground">{resolvedCount}</p>
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
              {/* Botão de Exportar PDF */}
              <button
                onClick={exportToPDF}
                className="btn-gold py-2 px-4 flex items-center gap-2 text-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Exportar PDF
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
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          Desenvolvido por
          <a href="https://caiodiom.github.io/portfolio-caio/" target="_blank" rel="noopener"> Caio Braga 🔗
          </a>
        </p>
      </footer>
    </div>
  );
};

export default CoordenacaoGeral;
