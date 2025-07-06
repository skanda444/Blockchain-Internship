export const idlFactory = ({ IDL }) => {
  const PatientDetailsPayload = IDL.Record({
    'patient_name' : IDL.Text,
    'patient_history' : IDL.Text,
    'in_clinic' : IDL.Bool,
    'next_appointment' : IDL.Nat64,
    'doctor_name' : IDL.Text,
  });
  const PatientDetails = IDL.Record({
    'id' : IDL.Nat64,
    'patient_name' : IDL.Text,
    'updated_at' : IDL.Opt(IDL.Nat64),
    'patient_history' : IDL.Text,
    'created_at' : IDL.Nat64,
    'in_clinic' : IDL.Bool,
    'next_appointment' : IDL.Nat64,
    'doctor_name' : IDL.Text,
  });
  const Error = IDL.Variant({ 'NotFound' : IDL.Record({ 'msg' : IDL.Text }) });
  const Result = IDL.Variant({ 'Ok' : PatientDetails, 'Err' : Error });
  const ChangeRecord = IDL.Record({
    'change_type' : IDL.Text,
    'timestamp' : IDL.Nat64,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : Error });
  return IDL.Service({
    'add_patient' : IDL.Func(
        [PatientDetailsPayload],
        [IDL.Opt(PatientDetails)],
        [],
      ),
    'bulk_update_patients' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Nat64, PatientDetailsPayload))],
        [IDL.Vec(Result)],
        [],
      ),
    'delete_patient' : IDL.Func([IDL.Nat64], [Result], []),
    'get_all_patients' : IDL.Func([], [IDL.Vec(PatientDetails)], ['query']),
    'get_available_patients' : IDL.Func(
        [],
        [IDL.Vec(PatientDetails)],
        ['query'],
      ),
    'get_paginated_patients' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(PatientDetails)],
        ['query'],
      ),
    'get_patient' : IDL.Func([IDL.Nat64], [Result], ['query']),
    'get_patient_update_history' : IDL.Func(
        [IDL.Nat64],
        [IDL.Vec(ChangeRecord)],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'mark_patient_in_clinic' : IDL.Func([IDL.Nat64], [Result], []),
    'mark_patient_not_in_clinic' : IDL.Func([IDL.Nat64], [Result], []),
    'patient_in_clinic' : IDL.Func([IDL.Nat64], [Result_1], ['query']),
    'search_doctors' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(PatientDetails)],
        ['query'],
      ),
    'search_patients' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(PatientDetails)],
        ['query'],
      ),
    'set_next_appointment' : IDL.Func([IDL.Nat64, IDL.Nat64], [Result], []),
    'sort_patient_by_name' : IDL.Func([], [IDL.Vec(PatientDetails)], ['query']),
    'update_patient' : IDL.Func(
        [IDL.Nat64, PatientDetailsPayload],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
