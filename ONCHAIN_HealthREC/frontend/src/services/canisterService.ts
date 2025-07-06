import { HttpAgent } from '@dfinity/agent';
// @ts-ignore
import { createActor } from '../ic';

export interface Patient {
  id?: string;
  name: string;
  history: string;
  doctor: string;
  appointment: string;
  inClinic: boolean;
}

const agent = new HttpAgent({
  host: import.meta.env.MODE === 'development' ? 'http://localhost:4943' : 'https://ic0.app'
});

if (import.meta.env.MODE === 'development') {
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check that your local replica is running.');
    console.error(err);
  });
}

const actor = createActor();

export const addPatient = async (patient: Omit<Patient, 'id'>): Promise<void> => {
  try {
    const payload = {
      patient_name: patient.name,
      patient_history: patient.history,
      doctor_name: patient.doctor,
      next_appointment: BigInt(new Date(patient.appointment).getTime()),
      in_clinic: patient.inClinic,
    };

    await actor.add_patient(payload);
  } catch (error) {
    console.error('Error adding patient:', error);
    throw new Error('Failed to add patient to the blockchain');
  }
};

export const loadPatients = async (): Promise<Patient[]> => {
  try {
    const rawPatients = await actor.get_all_patients();

    // Optionally map backend format to frontend format
    return rawPatients.map((p: any) => ({
      id: p.id.toString(),
      name: p.patient_name,
      history: p.patient_history,
      doctor: p.doctor_name,
      appointment: new Date(Number(p.next_appointment)).toISOString(),
      inClinic: p.in_clinic,
    }));
  } catch (error) {
    console.error('Error loading patients:', error);
    throw new Error('Failed to load patients from the blockchain');
  }
};