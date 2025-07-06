# ON CHAIN HEALTH

This repository contains the source code for a ON CHAIN HEALTH canister on the Internet Computer Protocol (ICP). The canister allows users to manage and query patients details, providing functionality such as adding, updating, deleting, and querying patient's details based on various criteria.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The hospital management canister is designed to be a decentralized solution for managing information about various patients. Each patient is represented by the `PatientDetails` struct, which includes fields such as `id`, `patient_name`, `patient_history`, `doctor_name`, `created_at`, `updated_at`, `next_appointment` and `in_clinic`. The canister uses a BTreeMap for efficient storage and retrieval of patients.

Key Features:

- **Querying**: Retrieve information about specific patient, all patients, patient in clinic, or perform a search based on a query string.

## Prerequisites

Before you begin, ensure that you have the following installed:

- [Rust](https://www.rust-lang.org/tools/install)
- [Internet Computer SDK](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html)

## Installation

Clone the repository to your local machine:

```bash

```

## Usage

To use the hospital management canister, you can explore the provided query and update functions.

## Testing

To run tests, use the following command:

```bash
cargo test
```

## Deployment

To deploy the canister locally, follow these steps:

1. Start the canister:

   ```bash
   dfx start
   ```

2. Deploy the canister:

   ```bash
   dfx deploy
   ```

3. Use the generated canister identifier to interact with the deployed canister.

For additional deployment options and configurations, refer to the [Internet Computer SDK documentation](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html).

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. Follow the standard GitHub flow for contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

