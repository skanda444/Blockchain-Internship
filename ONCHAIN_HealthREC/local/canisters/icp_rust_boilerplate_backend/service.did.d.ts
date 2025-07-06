import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ChangeRecord { 'change_type' : string, 'timestamp' : bigint }
export type Error = { 'NotFound' : { 'msg' : string } };
export interface PatientDetails {
  'id' : bigint,
  'patient_name' : string,
  'updated_at' : [] | [bigint],
  'patient_history' : string,
  'created_at' : bigint,
  'in_clinic' : boolean,
  'next_appointment' : bigint,
  'doctor_name' : string,
}
export interface PatientDetailsPayload {
  'patient_name' : string,
  'patient_history' : string,
  'in_clinic' : boolean,
  'next_appointment' : bigint,
  'doctor_name' : string,
}
export type Result = { 'Ok' : PatientDetails } |
  { 'Err' : Error };
export type Result_1 = { 'Ok' : boolean } |
  { 'Err' : Error };
export interface _SERVICE {
  'add_patient' : ActorMethod<[PatientDetailsPayload], [] | [PatientDetails]>,
  'bulk_update_patients' : ActorMethod<
    [Array<[bigint, PatientDetailsPayload]>],
    Array<Result>
  >,
  'delete_patient' : ActorMethod<[bigint], Result>,
  'get_all_patients' : ActorMethod<[], Array<PatientDetails>>,
  'get_available_patients' : ActorMethod<[], Array<PatientDetails>>,
  'get_paginated_patients' : ActorMethod<
    [bigint, bigint],
    Array<PatientDetails>
  >,
  'get_patient' : ActorMethod<[bigint], Result>,
  'get_patient_update_history' : ActorMethod<[bigint], Array<ChangeRecord>>,
  'mark_patient_in_clinic' : ActorMethod<[bigint], Result>,
  'mark_patient_not_in_clinic' : ActorMethod<[bigint], Result>,
  'patient_in_clinic' : ActorMethod<[bigint], Result_1>,
  'search_doctors' : ActorMethod<[string], Array<PatientDetails>>,
  'search_patients' : ActorMethod<[string], Array<PatientDetails>>,
  'set_next_appointment' : ActorMethod<[bigint, bigint], Result>,
  'sort_patient_by_name' : ActorMethod<[], Array<PatientDetails>>,
  'update_patient' : ActorMethod<[bigint, PatientDetailsPayload], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
