---
layout: default
title: list
nav_order: 80
parent: Command reference
grand_parent: OpenSearch Benchmark Reference
redirect_from: /benchmark/commands/list/
---

# list

The `list` command lists the following elements used by OpenSearch Benchmark:

- `telemetry`: Telemetry devices  
- `workloads`: Workloads 
- `pipelines`: Pipelines
- `test_executions`: Single run of a workload 
- `provision_config_instances`: Provisioned configuration instances
- `opensearch-plugins`: OpenSearch plugins 


## Usage

The following example lists any workload test runs and detailed information about each test:

```
`opensearch-benchmark list test_executions
```

OpenSearch Benchmark returns information about each test. 

```
benchmark list test_executions

   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/


Recent test_executions:

TestExecution ID                      TestExecution Timestamp    Workload    Workload Parameters    TestProcedure        ProvisionConfigInstance    User Tags    workload Revision    Provision Config Revision
------------------------------------  -------------------------  ----------  ---------------------  -------------------  -------------------------  -----------  -------------------  ---------------------------
729291a0-ee87-44e5-9b75-cc6d50c89702  20230524T181718Z           geonames                           append-no-conflicts  4gheap                                  30260cf
f91c33d0-ec93-48e1-975e-37476a5c9fe5  20230524T170134Z           geonames                           append-no-conflicts  4gheap                                  30260cf
d942b7f9-6506-451d-9dcf-ef502ab3e574  20230524T144827Z           geonames                           append-no-conflicts  4gheap                                  30260cf
a33845cc-c2e5-4488-a2db-b0670741ff9b  20230523T213145Z           geonames                           append-no-conflicts  4gheap                                  30260cf
ba643ed3-0db5-452e-a680-2b0dc0350cf2  20230522T224450Z           geonames                           append-no-conflicts  external                                30260cf
8d366ec5-3322-4e09-b041-a4b02e870033  20230519T201514Z           geonames                           append-no-conflicts  external                                30260cf
4574c13e-8742-41af-a4fa-79480629ecf0  20230519T195617Z           geonames                           append-no-conflicts  external                                30260cf
3e240d18-fc87-4c49-9712-863196efcef4  20230519T195412Z           geonames                           append-no-conflicts  external                                30260cf
90f066ae-3d83-41e9-bbeb-17cb0480d578  20230519T194448Z           geonames                           append-no-conflicts  external                                30260cf
78602e07-0ff8-4f00-9a0e-746fb64e4129  20230519T193258Z           geonames                           append-no-conflicts  external                                30260cf

-------------------------------
[INFO] SUCCESS (took 0 seconds)
-------------------------------
```

## Options

You can use the following options with the `test` command: 

- `--limit`: Limits the number of search results for recent test runs. Default is `10`. 
- `--workload-repository`: Defines the repository from where OpenSearch Benchmark loads workloads.
- `--workload-path`: Defines the path to a downloaded or custom workload.
- `--workload-revision`: Defines a specific revision from the workload source tree that OpenSearch Benchmark should use. 


