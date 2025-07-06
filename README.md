# Tasks Links

Task 1
docs link:https://docs.google.com/document/d/1JujLRR1PBDM8JeYR-LI2xnRzvKYahGw2GnE41Nub_Tc/edit?usp=sharing


Task 2
docs link:https://docs.google.com/document/d/1DuNDfQOKjFonbRWddBkyQ9aqJs8mNXe0DUySz82BcDU/edit?usp=sharing


ON CHAIN HEALTH

This repository contains the source code for a ON CHAIN HEALTH canister on the Internet Computer Protocol (ICP). The canister allows users to manage and query patients details, providing functionality such as adding, updating, deleting, and querying patient's details based on various criteria.
Table of Contents

    Overview
    Prerequisites
    Installation
    Usage
    Testing
    Deployment
    Contributing
    License

Overview

The hospital management canister is designed to be a decentralized solution for managing information about various patients. Each patient is represented by the PatientDetails struct, which includes fields such as id, patient_name, patient_history, doctor_name, created_at, updated_at, next_appointment and in_clinic. The canister uses a BTreeMap for efficient storage and retrieval of patients.

Key Features:

    Querying: Retrieve information about specific patient, all patients, patient in clinic, or perform a search based on a query string.

Prerequisites

Before you begin, ensure that you have the following installed:

    Rust
    Internet Computer SDK

Installation

Clone the repository to your local machine:

Usage

To use the hospital management canister, you can explore the provided query and update functions.
Testing

To run tests, use the following command:

cargo test

Deployment

To deploy the canister locally, follow these steps:

    Start the canister:

    dfx start

Deploy the canister:

dfx deploy

    Use the generated canister identifier to interact with the deployed canister.

For additional deployment options and configurations, refer to the Internet Computer SDK documentation.
Contributing

Feel free to contribute to the project by submitting issues or pull requests. Follow the standard GitHub flow for contributing.
License
This project is licensed under the MIT License - see the LICENSE file for details.
