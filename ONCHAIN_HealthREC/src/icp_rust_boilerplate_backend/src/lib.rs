

extern crate serde;

use serde::{Serialize, Deserialize}; // ✅ THIS IS MISSING
use candid::{Decode, Encode};
use ic_cdk::api::time;

use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, Cell, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};
use std::borrow::Borrow;

type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdCell = Cell<u64, Memory>;

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default)]
struct PatientDetails {
    id: u64,
    patient_name: String,
    patient_history: String,
    doctor_name: String,
    created_at: u64,
    next_appointment: u64,
    in_clinic: bool,
    updated_at: Option<u64>,
    
}

impl Storable for PatientDetails {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for PatientDetails {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static ID_COUNTER: RefCell<IdCell> = RefCell::new(
        IdCell::init(MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))), 0)
            .expect("Cannot create a counter")
    );

    static STORAGE_PATIENT: RefCell<StableBTreeMap<u64, PatientDetails, Memory>> =
        RefCell::new(StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        ));
}

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct PatientDetailsPayload {
    patient_name: String,
    patient_history: String,
    doctor_name: String,
    next_appointment: u64,
    in_clinic: bool,
}

#[ic_cdk::query]
fn get_patient(id: u64) -> Result<PatientDetails, Error> {
    match _get_patient(&id) {
        Some(item) => Ok(item),
        None => Err(Error::NotFound {
            msg: format!("an item with id={} not found", id),
        }),
    }
}

#[ic_cdk::query]
fn get_all_patients() -> Vec<PatientDetails> {
    STORAGE_PATIENT.with(|service| {
        service
            .borrow()
            .iter()
            .map(|(_, item)| item.clone())
            .collect()
    })
}

#[ic_cdk::query]
fn get_available_patients() -> Vec<PatientDetails> {
    STORAGE_PATIENT.with(|service| {
        service
            .borrow()
            .iter()
            .filter(|(_, item)| item.in_clinic)
            .map(|(_, item)| item.clone())
            .collect()
    })
}

#[ic_cdk::query]
fn search_patients(query: String) -> Vec<PatientDetails> {
    STORAGE_PATIENT.with(|service| {
        service
            .borrow()
            .iter()
            .filter(|(_, item)| item.patient_name.contains(&query) || item.patient_history.contains(&query))
            .map(|(_, item)| item.clone())
            .collect()
    })
}

#[ic_cdk::query]
fn search_doctors(query: String) -> Vec<PatientDetails> {
    STORAGE_PATIENT.with(|service| {
        service
            .borrow()
            .iter()
            .filter(|(_, item)| item.doctor_name.contains(&query) || item.patient_history.contains(&query))
            .map(|(_, item)| item.clone())
            .collect()
    })
}

#[ic_cdk::update]
fn add_patient(item: PatientDetailsPayload) -> Option<PatientDetails> {
    let id = ID_COUNTER
        .with(|counter| {
            let current_value = *counter.borrow().get();
            counter.borrow_mut().set(current_value + 1)
        })
        .expect("cannot increment id counter");
    let storage_item = PatientDetails {
        id,
        patient_name: item.patient_name,
        patient_history: item.patient_history,
        doctor_name: item.doctor_name,
        created_at: time(),
        updated_at: None,
        next_appointment: item.next_appointment,
        in_clinic: item.in_clinic,
    };
    do_insert_patient(&storage_item);
    Some(storage_item)
}

#[ic_cdk::update]
fn update_patient(id: u64, payload: PatientDetailsPayload) -> Result<PatientDetails, Error> {
    match STORAGE_PATIENT.with(|service| service.borrow_mut().get(&id)) {
        Some(mut item) => {
            item.patient_name = payload.patient_name;
            item.patient_history = payload.patient_history;
            item.doctor_name = payload.doctor_name;
            item.updated_at = Some(time());
            item.next_appointment = payload.next_appointment;
            item.in_clinic = payload.in_clinic;
            
            // No need to call do_insert_patient as the item is modified in place

            Ok(item.clone())
        }
        None => Err(Error::NotFound {
            msg: format!(
                "couldn't update an item with id={}. item not found",
                id
            ),
        }),
    }
}

#[ic_cdk::query]
fn patient_in_clinic(id: u64) -> Result<bool, Error> {
    match _get_patient(&id) {
        Some(item) => Ok(item.in_clinic),
        None => Err(Error::NotFound {
            msg: format!("an item with id={} not found", id),
        }),
    }
}

#[ic_cdk::update]
fn mark_patient_in_clinic(id: u64) -> Result<PatientDetails, Error> {
    match STORAGE_PATIENT.with(|service| service.borrow_mut().get(&id)) {
        Some(mut item) => {
            item.in_clinic = true;
            do_insert_patient(&item);
            Ok(item.clone())
        }
        None => Err(Error::NotFound {
            msg: format!("an item with id={} not found", id),
        }),
    }
}

#[ic_cdk::update]
fn mark_patient_not_in_clinic(id: u64) -> Result<PatientDetails, Error> {
    if let Some(mut item) = STORAGE_PATIENT.with(|service| service.borrow_mut().get(&id)) {
        item.in_clinic = false;
        do_insert_patient(&item);
        Ok(item.clone())
    } else {
        Err(Error::NotFound {
            msg: format!("an item with id={} not found", id),
        })
    }
}

#[ic_cdk::update]
fn set_next_appointment(id: u64, next_appointment: u64) -> Result<PatientDetails, Error> {
    match STORAGE_PATIENT.with(|service| service.borrow_mut().get(&id)) {
        Some(mut item) => {
            item.next_appointment = next_appointment;
            do_insert_patient(&item);
            Ok(item.clone())
        }
        None => Err(Error::NotFound {
            msg: format!("an item with id={} not found", id),
        }),
    }
}



fn do_insert_patient(item: &PatientDetails) {
    STORAGE_PATIENT.with(|service| service.borrow_mut().insert(item.id, item.clone()));
}

#[ic_cdk::update]
fn delete_patient(id: u64) -> Result<PatientDetails, Error> {
    match STORAGE_PATIENT.with(|service| service.borrow_mut().remove(&id)) {
        Some(item) => Ok(item),
        None => Err(Error::NotFound {
            msg: format!(
                "couldn't delete an item with id={}. item not found.",
                id
            ),
        }),
    }
}

#[derive(candid::CandidType, Deserialize, Serialize)]
enum Error {
    NotFound { msg: String },
}

fn _get_patient(id: &u64) -> Option<PatientDetails> {
    // Assuming MemoryId::new(1) is reserved for smart storage item storage
    let item_storage = MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)));
    StableBTreeMap::<u64, PatientDetails, Memory>::init(item_storage)
        .borrow()
        .get(id)
}

#[derive(candid::CandidType, Serialize, Deserialize)]
struct ChangeRecord {
    timestamp: u64,
    change_type: String,
}


#[ic_cdk::query]
fn sort_patient_by_name() -> Vec<PatientDetails> {
    let mut items = STORAGE_PATIENT.with(|service| {
        service
            .borrow()
            .iter()
            .map(|(_, item)| item.clone())
            .collect::<Vec<_>>()
    });

    items.sort_by(|a, b| a.patient_name.cmp(&b.patient_name));
    items
}

#[ic_cdk::query]
fn get_patient_update_history(id: u64) -> Vec<ChangeRecord> {
    match _get_patient(&id) {
        Some(item) => {
            let mut history = Vec::new();
            if let Some(updated_at) = item.updated_at {
                history.push(ChangeRecord {
                    timestamp: updated_at,
                    change_type: "Update".to_string(),
                });
            }
            history.push(ChangeRecord {
                timestamp: item.created_at,
                change_type: "Creation".to_string(),
            });
            history
        }
        None => Vec::new(),
    }
}



#[ic_cdk::update]
fn bulk_update_patients(updates: Vec<(u64, PatientDetailsPayload)>) -> Vec<Result<PatientDetails, Error>> {
    let mut results = Vec::new();
    for (id, payload) in updates {
        let result = update_patient(id, payload);
        results.push(result);
    }
    results
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
#[ic_cdk::query]
fn get_paginated_patients(limit: usize, offset: usize) -> Vec<PatientDetails> {
    STORAGE_PATIENT.with(|service| {
        service
            .borrow()
            .iter()
            .skip(offset)
            .take(limit)
            .map(|(_, item)| item.clone())
            .collect()
    })
}
candid::export_service!();

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn export_candid_interface() {
        use std::fs::write;
        let candid = __export_service();
        write("icp_rust_boilerplate_backend.did", candid).expect("Write failed");
    }
}



