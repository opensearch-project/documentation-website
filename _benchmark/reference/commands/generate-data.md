---
layout: default
title: generate-data
nav_order: 50
parent: Command reference
grand_parent: Reference
redirect_from:
  - /benchmark/commands/generate-data/
---

# generate-data

The `generate-data` command creates synthetic datasets for benchmarking and testing. OpenSearch Benchmark supports two methods for data generation: using OpenSearch index mappings or custom Python modules with user-defined logic. For more information, see [Synthetic data generation]({{site.url}}{{site.baseurl}}/benchmark/features/synthetic-data-generation/).

## Usage

```shell
osb generate-data --index-name <INDEX_NAME> --output-path <OUTPUT_PATH> --total-size <SIZE_GB> [OPTIONS]
```

**Requirements**:

- Either `--index-mappings` or `--custom-module` must be specified, but not both.
- When using `--custom-module`, your Python module must include the `generate_synthetic_document(providers, **custom_lists)` function.

## Data generation methods

Choose one of the following approaches:

**Method 1: Using index mappings**:

```shell
osb generate-data --index-name my-index --index-mappings mapping.json --output-path ./data --total-size 1
```

**Method 2: Using a custom Python module**:

```shell
osb generate-data --index-name my-index --custom-module custom.py --output-path ./data --total-size 1
```

## Options

Use the following options with the `generate-data` command.

| Option | Required/Optional | Description |
|---|---|---|
| `--index-name` or `-n` | Required | The name of the data corpora you want to generate. |
| `--output-path` or `-p` | Required | The path where you want the data to be generated. |
| `--total-size` or `-s` | Required | The total amount of data you want to generate, in GB. |
| `--index-mappings` or `-i` | Conditional (Either `--index-mappings` or `--custom-module` must be specified)| The path to the OpenSearch index mappings you want to use. Required when using mapping-based generation. Cannot be used with `--custom-module`. |
| `--custom-module` or `-m` | Conditional (Either `--index-mappings` or `--custom-module` must be specified)| The path to the Python module that includes your custom logic. Required when using custom logic generation. Cannot be used with `--index-mappings`. The Python module must include the `generate_synthetic_document(providers, **custom_lists)` function. |
| `--custom-config` or `-c` | Optional | The path to a YAML configuration file defining rules for how you want data to be generated. |
| `--test-document` or `-t` | Optional | When this flag is present, OpenSearch Benchmark generates a single synthetic document and outputs it to the console. This provides you with a way to verify that the generated example document aligns with your expectations. When the flag is not present, the entire data corpora will be generated. |

## Example output

The following is an example output when generating synthetic data:

```
   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/


[NOTE] ✨ Dashboard link to monitor processes and task streams: [http://127.0.0.1:8787/status]
[NOTE] ✨ For users who are running generation on a virtual machine, consider SSH port forwarding (tunneling) to localhost to view dashboard.
[NOTE] Example of localhost command for SSH port forwarding (tunneling) from an AWS EC2 instance:
ssh -i <PEM_FILEPATH> -N -L localhost:8787:localhost:8787 ec2-user@<DNS>

Total GB to generate: [1]
Average document size in bytes: [412]
Max file size in GB: [40]

100%|███████████████████████████████████████████████████████████████████| 100.07G/100.07G [3:35:29<00:00, 3.98MB/s]

Generated 24271844660 docs in 12000 seconds. Total dataset size is 100.21GB.
✅ Visit the following path to view synthetically generated data: /home/ec2-user/

-----------------------------------
[INFO] ✅ SUCCESS (took 272 seconds)
-----------------------------------
```

## Related documentation

- [Generating data using index mappings]({{site.url}}{{site.baseurl}}/benchmark/features/synthetic-data-generation/mapping-sdg/)
- [Generating data using custom logic]({{site.url}}{{site.baseurl}}/benchmark/features/synthetic-data-generation/custom-logic-sdg/)