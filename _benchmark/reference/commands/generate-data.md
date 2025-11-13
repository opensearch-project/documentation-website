---
layout: default
title: generate-data
nav_order: 75
parent: Command reference
grand_parent: OpenSearch Benchmark Reference
redirect_from:
  - /benchmark/commands/generate-data/
---

# generate-data

### Usage

Users can generate synthetic data with the subcommand generate-data. There are currently two ways to generate synthetic data in OpenSearch — with an OpenSearch index mapping or a custom Python module. The following pages explore generating data with OpenSearch index mappings, generating data with a custom Python module, and general tips and tricks users can use.

For more information and examples, see [Synthetic Data Generation Guide]({{site.url}}{{site.baseurl}}/benchmark/features/synthetic-data-generation/)

### Options

```shell
osb generate-data --custom-module ~/Desktop/http-logs.py --index-name http-logs-regenerated --output-path ~/Desktop/sdg_outputs/ --total-size 2
```

* `generate-data` (required): sub-command that activates synthetic data generation in OpenSearch Benchmark
* `--index-mappings` or `-i` (required): Path to OpenSearch index mappings. If present, `--custom-module` cannot be used.
* `--custom-module` or `-m` (required): Path to Python logic that includes custom logic. If present, `--index-mappings` cannot be used.

Custom Python module must include generate_synthetic_data(providers, **custom_lists)
{: .important}

* `--index-name` or `-n` (required): Name of data corpora generated
* `--output-path` or `-p` (required): Path where data should be generated in
* `--total-size` or `-s` (required): Total amount of data that should be generated in GB
* `--custom-config` or `-c` (optional): Path to YAML config defining rules for how data should be generated. This is further explored in the subsequent section
* `--test-document` or `-t` (optional): When flag is present, OSB generates a single synthetic document and outputs to the console. Provides users a way to verify that the example document generated is aligned with expectations. When the flag is not present, the entire data corpora will be generated

### Example Output

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
ssh -i <PEM filepath> -N -L localhost:8787:localhost:8787 ec2-user@<DNS>

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