import { useState, useEffect } from 'react';
import { database, ref, onValue, push, set, update } from '@/lib/firebase';

export interface Appointment {
  id: string;
  coordinationId: string;
  studentName: string;
  period: string; // P1 a P10
  reason: string; // Motivo do agendamento
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  attended: boolean;
  notes: string;
  createdAt: number;
}

export const useAppointments = (coordinationId?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appointmentsRef = ref(database, 'appointments');
    
    const unsubscribe = onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const appointmentsList: Appointment[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value
        }));
        
        // Filtra por coordenação se especificado
        const filtered = coordinationId 
          ? appointmentsList.filter(a => a.coordinationId === coordinationId)
          : appointmentsList;
        
        setAppointments(filtered.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          if (dateCompare !== 0) return dateCompare;
          return a.time.localeCompare(b.time);
        }));
      } else {
        setAppointments([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [coordinationId]);

  const createAppointment = async (data: Omit<Appointment, 'id' | 'attended' | 'notes' | 'createdAt'>) => {
    const appointmentsRef = ref(database, 'appointments');
    const newRef = push(appointmentsRef);
    
    await set(newRef, {
      coordinationId: data.coordinationId,
      studentName: data.studentName,
      period: data.period || '',
      reason: data.reason || '',
      date: data.date,
      time: data.time,
      attended: false,
      notes: '',
      createdAt: Date.now()
    });
    
    return newRef.key;
  };

  const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    const appointmentRef = ref(database, `appointments/${id}`);
    await update(appointmentRef, data);
  };

  const isSlotBooked = (coordinationId: string, date: string, time: string): boolean => {
    return appointments.some(
      a => a.coordinationId === coordinationId && a.date === date && a.time === time
    );
  };

  const getBookedSlots = (coordinationId: string, date: string): string[] => {
    return appointments
      .filter(a => a.coordinationId === coordinationId && a.date === date)
      .map(a => a.time);
  };

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    isSlotBooked,
    getBookedSlots
  };
};

export const useAllAppointments = () => {
  return useAppointments();
};
