---
layout: default
title: info
nav_order: 75
parent: Command reference
grand_parent: OpenSearch Benchmark Reference
redirect_from: /benchmark/commands/info/
---

# info

The `info` command prints details about an OpenSearch Benchmark component. 

## Usage

The following example returns information about a workload named `nyc_taxis`: 

```
opensearch-benchmark info --workload=nyc_taxis
```

OpenSearch Benchmark returns information about the workload, as shown in the following example response: 

```
   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/

Showing details for workload [nyc_taxis]:

* Description: Taxi rides in New York in 2015
* Documents: 165,346,692
* Compressed Size: 4.5 GB
* Uncompressed Size: 74.3 GB

===================================
TestProcedure [searchable-snapshot]
===================================

Measuring performance for Searchable Snapshot feature. Based on the default test procedure 'append-no-conflicts'.

Schedule: 
----------

1. delete-index
2. create-index 
3. check-cluster-health
4. index (8 clients)
5. refresh-after-index
6. force-merge
7. refresh-after-force-merge
8. wait-until-merges-finish
9. create-snapshot-repository
10. delete-snapshot
11. create-snapshot
12. wait-for-snapshot-creation
13. delete-local-index
14. restore-snapshot
15. default 
16. range
17. distance_amount_agg
18. autohisto_agg
19. date_histogram_agg

====================================================
TestProcedure [append-no-conflicts] (run by default) 
====================================================

Indexes the entire document corpus using a setup that will lead to a larger indexing throughput than the default settings and produce a smaller index (higher compression rate). Document IDs are unique, so all index operations are append only. After that, a couple of queries are run. 

Schedule:
----------

1. delete-index
2. create-index
3. check-cluster-health
4. index (8 clients)
5. refresh-after-index
6. force-merge
7. refresh-after-force-merge
8. wait-until-merges-finish
9. default
10. range
11. distance_amount_agg
12. autohisto_agg
13. date_histogram_agg

==============================================
TestProcedure [append-no-conflicts-index-only]
==============================================

Indexes the whole document corpus using a setup that will lead to a larger indexing throughput than the default settings and produce a smaller index (higher compression rate). Document ids are unique so all index operations are append only.

Schedule:
----------

1. delete-index
2. create-index
3. check-cluster-health
4. index (8 clients)
5. refresh-after-index
6. force-merge
7. refresh-after-force-merge
8. wait-until-merges-finish

=====================================================
TestProcedure [append-sorted-no-conflicts-index-only]
=====================================================

Indexes the whole document corpus in an index sorted by pickup_datetime field in descending order (most recent first) and using a setup that will lead to a larger indexing throughput than the default settings and produce a smaller index (higher compression rate). Document ids are unique so all index operations are append only.

Schedule:
----------

1. delete-index
2. create-index
3. check-cluster-health
4. index (8 clients)
5. refresh-after-index
6. force-merge
7. refresh-after-force-merge
8. wait-until-merges-finish

======================
TestProcedure [update]
======================

Schedule:
----------

1. delete-index
2. create-index
3. check-cluster-health
4. update (8 clients)
5. refresh-after-index
6. force-merge
7. refresh-after-force-merge
8. wait-until-merges-finish


-------------------------------
[INFO] SUCCESS (took 2 seconds)
-------------------------------
```

## Options

You can use the following options with the `info` command: 


- `--workload-repository`: Defines the repository from where OpenSearch Benchmark loads workloads.
- `--workload-path`: Defines the path to a downloaded or custom workload. 
- `--workload-revision`: Defines a specific revision from the workload source tree that OpenSearch Benchmark should use.
- `--workload`: Defines the workload to use based on the workload's name. You can find a list of preloaded workloads using `opensearch-benchmark list workloads`. 
- `--test-procedure`: Defines a test procedure to use. You can find a list of test procedures using `opensearch-benchmark list test_procedures`.
- `--include-tasks`: Defines a comma-separated list of test procedure tasks to run. By default, all tasks listed in a test procedure array are run.
- `--exclude-tasks`: Defines a comma-separated list of test procedure tasks not to run. 
