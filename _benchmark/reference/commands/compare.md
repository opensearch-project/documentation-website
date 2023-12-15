---
layout: default
title: compare
nav_order: 55
parent: Command reference
grand_parent: OpenSearch Benchmark Reference
redirect_from: /benchmark/commands/compare/
---

# compare

The `compare` command helps you analyze the difference between two benchmark tests. This can help you analyze the performance impact of changes made from a previous test based on a specific Git revision. 

## Usage

You can compare two different workload tests using their `TestExecution IDs`. To find a list of tests run from a specific workload, use `opensearch-benchmark list test_executions`. You should receive an output similar to the following: 


```
   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/
Recent test-executions:

Recent test_executions:

TestExecution ID                      TestExecution Timestamp    Workload    Workload Parameters    TestProcedure        ProvisionConfigInstance    User Tags    workload Revision    Provision Config Revision
------------------------------------  -------------------------  ----------  ---------------------  -------------------  -------------------------  -----------  -------------------  ---------------------------
729291a0-ee87-44e5-9b75-cc6d50c89702  20230524T181718Z           geonames                           append-no-conflicts  4gheap                                  30260cf
f91c33d0-ec93-48e1-975e-37476a5c9fe5  20230524T170134Z           geonames                           append-no-conflicts  4gheap                                  30260cf
d942b7f9-6506-451d-9dcf-ef502ab3e574  20230524T144827Z           geonames                           append-no-conflicts  4gheap                                  30260cf
a33845cc-c2e5-4488-a2db-b0670741ff9b  20230523T213145Z           geonames                           append-no-conflicts  

```

Then, use `compare` to call a `--baseline` test and a  `--contender` test for comparison.

```
opensearch-benchmark compare --baseline=417ed42-6671-9i79-11a1-e367636068ce --contender=beb154e4-0a05-4f45-ad9f-e34f9a9e51f7
```

You should receive the following response comparing the final benchmark metrics for both tests:

```
   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/

Comparing baseline
  TestExecution ID: 729291a0-ee87-44e5-9b75-cc6d50c89702
  TestExecution timestamp: 2023-05-24 18:17:18 

with contender
  TestExecution ID: a33845cc-c2e5-4488-a2db-b0670741ff9b
  TestExecution timestamp: 2023-05-23 21:31:45


------------------------------------------------------
    _______             __   _____
   / ____(_)___  ____ _/ /  / ___/_________  ________
  / /_  / / __ \/ __ `/ /   \__ \/ ___/ __ \/ ___/ _ \
 / __/ / / / / / /_/ / /   ___/ / /__/ /_/ / /  /  __/
/_/   /_/_/ /_/\__,_/_/   /____/\___/\____/_/   \___/
------------------------------------------------------
                                                  Metric    Baseline    Contender               Diff
--------------------------------------------------------  ----------  -----------  -----------------
                        Min Indexing Throughput [docs/s]       19501        19118  -383.00000
                     Median Indexing Throughput [docs/s]       20232      19927.5  -304.45833
                        Max Indexing Throughput [docs/s]       21172        20849  -323.00000
                               Total indexing time [min]     55.7989       56.335    +0.53603
                                  Total merge time [min]     12.9766      13.3115    +0.33495
                                Total refresh time [min]     5.20067      5.20097    +0.00030
                                  Total flush time [min]   0.0648667    0.0681833    +0.00332
                         Total merge throttle time [min]    0.796417     0.879267    +0.08285
               Query latency term (50.0 percentile) [ms]     2.10049      2.15421    +0.05372
               Query latency term (90.0 percentile) [ms]     2.77537      2.84168    +0.06630
              Query latency term (100.0 percentile) [ms]     4.52081      5.15368    +0.63287
        Query latency country_agg (50.0 percentile) [ms]     112.049      110.385    -1.66392
        Query latency country_agg (90.0 percentile) [ms]     128.426      124.005    -4.42138
       Query latency country_agg (100.0 percentile) [ms]     155.989      133.797   -22.19185
             Query latency scroll (50.0 percentile) [ms]     16.1226      14.4974    -1.62519
             Query latency scroll (90.0 percentile) [ms]     17.2383      15.4079    -1.83043
            Query latency scroll (100.0 percentile) [ms]     18.8419      18.4241    -0.41784
 Query latency country_agg_cached (50.0 percentile) [ms]     1.70223      1.64502    -0.05721
 Query latency country_agg_cached (90.0 percentile) [ms]     2.34819      2.04318    -0.30500
Query latency country_agg_cached (100.0 percentile) [ms]     3.42547      2.86814    -0.55732
            Query latency default (50.0 percentile) [ms]     5.89058      5.83409    -0.05648
            Query latency default (90.0 percentile) [ms]     6.71282      6.64662    -0.06620
           Query latency default (100.0 percentile) [ms]     7.65307       7.3701    -0.28297
             Query latency phrase (50.0 percentile) [ms]     1.82687      1.83193    +0.00506
             Query latency phrase (90.0 percentile) [ms]     2.63714      2.46286    -0.17428
            Query latency phrase (100.0 percentile) [ms]     5.39892      4.22367    -1.17525
                            Median CPU usage (index) [%]     668.025       679.15   +11.12499
                            Median CPU usage (stats) [%]      143.75        162.4   +18.64999
                           Median CPU usage (search) [%]       223.1        229.2    +6.10000
                             Total Young Gen GC time [s]      39.447       40.456    +1.00900
                                Total Young Gen GC count          10           11    +1.00000
                               Total Old Gen GC time [s]       7.108        7.703    +0.59500
                                  Total Old Gen GC count          10           11    +1.00000
                                         Index size [GB]     3.25475      3.25098    -0.00377
                                      Total written [GB]     17.8434      18.3143    +0.47083
                             Heap used for segments [MB]     21.7504      21.5901    -0.16037
                           Heap used for doc values [MB]     0.16436      0.13905    -0.02531
                                Heap used for terms [MB]     20.0293      19.9159    -0.11345
                                Heap used for norms [MB]    0.105469    0.0935669    -0.01190
                               Heap used for points [MB]    0.773487     0.772155    -0.00133
                               Heap used for points [MB]    0.677795     0.669426    -0.00837
                                           Segment count         136          121   -15.00000
                     Indices Stats(90.0 percentile) [ms]     3.16053      3.21023    +0.04969
                     Indices Stats(99.0 percentile) [ms]     5.29526      3.94132    -1.35393
                    Indices Stats(100.0 percentile) [ms]     5.64971      7.02374    +1.37403
                       Nodes Stats(90.0 percentile) [ms]     3.19611      3.15251    -0.04360
                       Nodes Stats(99.0 percentile) [ms]     4.44111      4.87003    +0.42892
                      Nodes Stats(100.0 percentile) [ms]     5.22527      5.66977    +0.44450
```

## Options

You can use the following options to customize the results of your test comparison: 

- `--baseline`: The baseline TestExecution ID used to compare the contender TestExecution.  
- `--contender`: The TestExecution ID for the contender being compared to the baseline. 
- `--results-format`: Defines the output format for the command line results, either `markdown` or `csv`. Default is `markdown`.
- `--results-number-align`: Defines the column number alignment for when the `compare` command outputs results. Default is `right`.
- `--results-file`: When provided a file path, writes the compare results to the file indicated in the path. 
- `--show-in-results`: Determines whether or not to include the comparison in the results file. 


