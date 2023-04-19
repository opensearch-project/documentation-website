---
layout: default
title: Getting started
nav_order: 3
parent: OpenSearch Benchmark
---

<!--
Testing out tabs for code blocks to identify example outputs and file names.
To use, invoke class="codeblock-label"
-->

<style>
.codeblock-label {
    display: inline-block;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    font-family: Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    font-size: .75rem;
    --bg-opacity: 1;
    background-color: #e1e7ef;
    background-color: rgba(224.70600000000002,231.07080000000002,239.394,var(--bg-opacity));
    padding: 0.25rem 0.75rem;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    --border-opacity: 1;
    border-color: #ccd6e0;
    border-color: rgba(204,213.85999999999999,224.39999999999998,var(--border-opacity));
    margin-bottom: 0;
}
</style>

# Getting started

This guide explains how to get started with OpenSearch Benchmark, from installation to running your first test benchmark on an **existing** OpenSearch cluster. If you do not already have a running OpenSearch cluster then you should review the OpenSearch [Quickstart]({{site.url}}{{site.baseurl}}/quickstart/) guide to deploy a test cluster before continuing with the following procedure.

## Installing prerequisite software

There are two methods for installing OpenSearch Benchmark. With the first method, you can install it on a host manually with Python 3 and pip. Alternatively, you can choose to run OpenSearch Benchmark in a Docker container. Running OpenSearch Benchmark in a Docker container simplifies the setup process because all of the required software dependencies are included with the official image. 

There are two important constraints to remember when you decide to run OpenSearch Benchmark in a Docker container:
- You cannot distribute load worker coordinator hosts using the OpenSearch Benchmark daemon when you run OpenSearch Benchmark using Docker.
- You can only use the `benchmark-only` pipeline when you run OpenSearch Benchmark using Docker.

### Option 1: Installing OpenSearch Benchmark manually with Python 3 and pip

You can install OpenSearch Benchmark on any compatible host running Linux&#8212;such as Ubuntu, Amazon Linux 2, and Red Hat-based distributions like CentOS&#8212;or macOS. We recommend that you do not install OpenSearch Benchmark on a host that is also running OpenSearch. Benchmark results can be inconsistent and unreliable when both processes run on a single node due to the sharing of system resources and task scheduling.

After you select a host, you can verify that the prerequisite software is installed. OpenSearch Benchmark requires:
- [Python](https://www.python.org/) 3.8 or newer (with pip).
- [Git](https://git-scm.com/) 1.9 or newer.

If you plan to provision OpenSearch nodes using OpenSearch Benchmark, then you must also install Docker on the host and configure some [important settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings). This guide does not cover the process of provisioning OpenSearch nodes with OpenSearch Benchmark, however, so you can ignore those optional considerations for now.

We recommend using [pyenv](https://github.com/pyenv/pyenv), an open source tool for managing Python versions. Pyenv uses shim executables that allow you to use any available version of Python. See the official [installation](https://github.com/pyenv/pyenv#installation) documentation for more information.
{: .tip}

#### Checking software dependencies and installing with pip

Check the installed version of Python 3:
```bash
python3 --version
```
{% include copy.html %}

Check the installed version of pip:
```bash
pip --version
```
{% include copy.html %}

Check the installed version of Git:
```bash
git --version
```
{% include copy.html %}

Refer to the official product documentation for guidance if you need help installing Python, pip, or Git in your environment.
{: .tip}

After you confirm that the required software is installed, you can install OpenSearch Benchmark with the following command:
```bash
pip install opensearch-benchmark
```
{% include copy.html %}

Verify that OpenSearch Benchmark was installed correctly by entering the following command to print the help text to the standard output:
```bash
opensearch-benchmark -h
```
{% include copy.html %}

### Option 2: Installing OpenSearch Benchmark with Docker

Docker must be installed on the host if you want to deploy OpenSearch Benchmark in a Docker container. See [Get Docker](https://docs.docker.com/get-docker/) for help installing Docker on your host.

You can find official images for OpenSearch Benchmark on [Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch-benchmark) and on the [Amazon ECR Public Gallery](https://gallery.ecr.aws/opensearchproject/opensearch-benchmark).

You can pull the image from Docker Hub using the following command:
```bash
docker pull opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

You can pull the image from Amazon ECR Public Gallery using the following command:
```bash
docker pull public.ecr.aws/opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

Verify that Docker is able to launch the container by using the following command to print help text to the standard output:
```bash
docker run opensearchproject/opensearch-benchmark opensearch-benchmark -h
```
{% include copy.html %}

Use an alias to simplify syntax when you interact with OpenSearch Benchmark using Docker commands. For example, you could define an alias like `osb="docker run opensearchproject/opensearch-benchmark opensearch-benchmark"`. Then, using the previous command as an example, you could run `osb -h` which is much shorter than the equivalent command `docker run opensearchproject/opensearch-benchmark opensearch-benchmark -h`.
{: .tip}

## Understanding command syntax

The syntax you use to issue commands with OpenSearch Benchmark will depend on your installation method.

If you installed using **Python or pip**, you issue commands similar to any standard Linux command-line utility:
```bash
opensearch-benchmark [SUBCOMMAND] [ARGS]
```

Alternatively, if you are running OpenSearch Benchmark in a Docker container, you will issue commands by passing them as arguments when you run the container:
```bash
docker run opensearchproject/opensearch-benchmark [SUBCOMMAND] [ARGS]
```

When you invoke a command using `docker run`, the Docker container launches and executes the command, and then the container exits.

Try it out by using the following command to print the OpenSearch Benchmark help text:
```bash
docker run opensearchproject/opensearch-benchmark opensearch-benchmark -h
```
{% include copy.html %}

Alternatively, you can run an interactive pseudo-TTY session with the Docker container and issue commands using standard command-line syntax:
1. To start a pseudo-TTY session in the container, enter the following command:
   ```bash
   docker run --entrypoint bash -it opensearchproject/opensearch-benchmark -c /bin/bash
   ```
   {% include copy.html %}
1. At the new prompt, enter the command to display the help text:
   ```bash
   opensearch-benchmark -h
   ```
   {% include copy.html %}
1. When you are done working with the container you end the pseudo-TTY session by entering `exit`.

## Running your first benchmark in test mode

Now that you've installed OpenSearch Benchmark, it's time for you to run your first test. The following steps assume that the target OpenSearch cluster is secured with self-signed TLS certificates and default security credentials, so the username and password are both `admin`.

Example commands in this section use standard command-line syntax: `opensearch-benchmark [SUBCOMMAND] [ARGS]`. You might need to modify some commands depending on your installation method and whether or not you use shell aliases.
{: .note}

Run the following command, replacing `<host-address>` with your OpenSearch cluster's endpoint (for example, `https://192.0.2.3:9200`):
```bash
opensearch-benchmark execute_test --target-hosts <host-address> --pipeline benchmark-only --workload geonames --client-options basic_auth_user:admin,basic_auth_password:admin,verify_certs:false --test-mode
```
{% include copy.html %}

A few arguments are included in the command:
- `execute_test` is specified as the subcommand because you want to run a benchmark.
- `--target-hosts` defines the endpoint of your OpenSearch cluster, including the protocol and port number.
- `--pipeline` defines the steps OpenSearch Benchmark will perform. Use `benchmark-only` because you are not using OpenSearch Benchmark to provision an OpenSearch cluster.
- `--workload` specifies the benchmarking workload you want to use. This example uses the [geonames](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/geonames) workload.
- `--client-options` allows you to define important parameters as a comma-separated list of key-value pairs, which is required if OpenSearch Security is enabled:
   - `basic_auth_user` is the user that OpenSearch Benchmark uses to communicate with the OpenSearch REST API.
   - `basic_auth_password` is the password for the specified OpenSearch user.
   - `verify_certs` is set to `false` because the TLS certificates are self-signed and cannot be verified. You can omit this parameter if your OpenSearch cluster certificates are signed by a trusted certificate authority (CA).
- `--test-mode` is used when you want to validate a benchmark workload. When `--test-mode` is specified, OpenSearch benchmark checks the command for syntax errors and limits each benchmark operation to a single instance. This flag is useful for validating custom workloads and it significantly reduces the time a benchmark takes to complete.

After you begin the benchmark, OpenSearch Benchmark will report progress to the standard output in the terminal window. You can see the order of test procedures performed and when they are completed, like in the following example output for the `geonames` benchmark workload that lists the operations sequentially and indicates that all operations were completed successfully:
<p class="codeblock-label">Example output</p>
```
Running delete-index                                                           [100% done]
Running create-index                                                           [100% done]
Running check-cluster-health                                                   [100% done]
Running index-append                                                           [100% done]
Running refresh-after-index                                                    [100% done]
Running force-merge                                                            [100% done]
Running refresh-after-force-merge                                              [100% done]
Running wait-until-merges-finish                                               [100% done]
Running index-stats                                                            [100% done]
Running node-stats                                                             [100% done]
Running default                                                                [100% done]
Running term                                                                   [100% done]
Running phrase                                                                 [100% done]
Running country_agg_uncached                                                   [100% done]
Running country_agg_cached                                                     [100% done]
Running scroll                                                                 [100% done]
Running expression                                                             [100% done]
Running painless_static                                                        [100% done]
Running painless_dynamic                                                       [100% done]
Running decay_geo_gauss_function_score                                         [100% done]
Running decay_geo_gauss_script_score                                           [100% done]
Running field_value_function_score                                             [100% done]
Running field_value_script_score                                               [100% done]
Running large_terms                                                            [100% done]
Running large_filtered_terms                                                   [100% done]
Running large_prohibited_terms                                                 [100% done]
Running desc_sort_population                                                   [100% done]
Running asc_sort_population                                                    [100% done]
Running asc_sort_with_after_population                                         [100% done]
Running desc_sort_geonameid                                                    [100% done]
Running desc_sort_with_after_geonameid                                         [100% done]
Running asc_sort_geonameid                                                     [100% done]
Running asc_sort_with_after_geonameid                                          [100% done]
```

You can review the test procedures and operations for the [geonames](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/geonames) workload GitHub to learn more about each individual operation.
{: .note}

## Reviewing the output of the test benchmark

When the benchmark is completed, OpenSearch Benchmark will display the results. By default, OpenSearch Benchmark prints the results to the standard output, but you can also use an OpenSearch cluster as a remote metric store by modifying `benchmark.ini`. To learn more about configuring OpenSearch Benchmark, see [Installing and configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/tuning-your-cluster/install-osb/).

The results summary lists various metrics in a table. You can review the summary to see how your OpenSearch cluster performed overall, as well as how it performed individually per operation. For a full explanation of the benchmark results summary, see [NEED-LINK](NEED-LINK).

<p class="codeblock-label">Example benchmark summary</p>
```
------------------------------------------------------
    _______             __   _____
   / ____(_)___  ____ _/ /  / ___/_________  ________
  / /_  / / __ \/ __ `/ /   \__ \/ ___/ __ \/ ___/ _ \
 / __/ / / / / / /_/ / /   ___/ / /__/ /_/ / /  /  __/
/_/   /_/_/ /_/\__,_/_/   /____/\___/\____/_/   \___/
------------------------------------------------------
            
|                                                         Metric |                           Task |       Value |    Unit |
|---------------------------------------------------------------:|-------------------------------:|------------:|--------:|
|                     Cumulative indexing time of primary shards |                                |   0.0441667 |     min |
|             Min cumulative indexing time across primary shards |                                |           0 |     min |
|          Median cumulative indexing time across primary shards |                                |    0.000375 |     min |
|             Max cumulative indexing time across primary shards |                                |   0.0119833 |     min |
|            Cumulative indexing throttle time of primary shards |                                |           0 |     min |
|    Min cumulative indexing throttle time across primary shards |                                |           0 |     min |
| Median cumulative indexing throttle time across primary shards |                                |           0 |     min |
|    Max cumulative indexing throttle time across primary shards |                                |           0 |     min |
|                        Cumulative merge time of primary shards |                                |      0.0329 |     min |
|                       Cumulative merge count of primary shards |                                |         102 |         |
|                Min cumulative merge time across primary shards |                                |           0 |     min |
|             Median cumulative merge time across primary shards |                                | 0.000166667 |     min |
|                Max cumulative merge time across primary shards |                                |   0.0123667 |     min |
|               Cumulative merge throttle time of primary shards |                                |           0 |     min |
|       Min cumulative merge throttle time across primary shards |                                |           0 |     min |
|    Median cumulative merge throttle time across primary shards |                                |           0 |     min |
|       Max cumulative merge throttle time across primary shards |                                |           0 |     min |
|                      Cumulative refresh time of primary shards |                                |    0.219433 |     min |
|                     Cumulative refresh count of primary shards |                                |        1917 |         |
|              Min cumulative refresh time across primary shards |                                |           0 |     min |
|           Median cumulative refresh time across primary shards |                                |  0.00205833 |     min |
|              Max cumulative refresh time across primary shards |                                |   0.0719333 |     min |
|                        Cumulative flush time of primary shards |                                |     0.02145 |     min |
|                       Cumulative flush count of primary shards |                                |         125 |         |
|                Min cumulative flush time across primary shards |                                |           0 |     min |
|             Median cumulative flush time across primary shards |                                | 0.000491667 |     min |
|                Max cumulative flush time across primary shards |                                |      0.0013 |     min |
|                                        Total Young Gen GC time |                                |       0.088 |       s |
|                                       Total Young Gen GC count |                                |          16 |         |
|                                          Total Old Gen GC time |                                |           0 |       s |
|                                         Total Old Gen GC count |                                |           0 |         |
|                                                     Store size |                                |  0.00907052 |      GB |
|                                                  Translog size |                                | 0.000159951 |      GB |
|                                         Heap used for segments |                                |           0 |      MB |
|                                       Heap used for doc values |                                |           0 |      MB |
|                                            Heap used for terms |                                |           0 |      MB |
|                                            Heap used for norms |                                |           0 |      MB |
|                                           Heap used for points |                                |           0 |      MB |
|                                    Heap used for stored fields |                                |           0 |      MB |
|                                                  Segment count |                                |         198 |         |
|                                                 Min Throughput |                   index-append |     7130.74 |  docs/s |
|                                                Mean Throughput |                   index-append |     7130.74 |  docs/s |
|                                              Median Throughput |                   index-append |     7130.74 |  docs/s |
|                                                 Max Throughput |                   index-append |     7130.74 |  docs/s |
|                                        50th percentile latency |                   index-append |     96.5621 |      ms |
|                                       100th percentile latency |                   index-append |     105.859 |      ms |
|                                   50th percentile service time |                   index-append |     96.5621 |      ms |
|                                  100th percentile service time |                   index-append |     105.859 |      ms |
|                                                     error rate |                   index-append |           0 |       % |
|                                                 Min Throughput |       wait-until-merges-finish |       12.98 |   ops/s |
|                                                Mean Throughput |       wait-until-merges-finish |       12.98 |   ops/s |
|                                              Median Throughput |       wait-until-merges-finish |       12.98 |   ops/s |
|                                                 Max Throughput |       wait-until-merges-finish |       12.98 |   ops/s |
|                                       100th percentile latency |       wait-until-merges-finish |     51.1548 |      ms |
|                                  100th percentile service time |       wait-until-merges-finish |     51.1548 |      ms |
|                                                     error rate |       wait-until-merges-finish |           0 |       % |
|                                                 Min Throughput |                    index-stats |       11.73 |   ops/s |
|                                                Mean Throughput |                    index-stats |       11.73 |   ops/s |
|                                              Median Throughput |                    index-stats |       11.73 |   ops/s |
|                                                 Max Throughput |                    index-stats |       11.73 |   ops/s |
|                                       100th percentile latency |                    index-stats |     112.275 |      ms |
|                                  100th percentile service time |                    index-stats |     15.3099 |      ms |
|                                                     error rate |                    index-stats |           0 |       % |
|                                                 Min Throughput |                     node-stats |          15 |   ops/s |
|                                                Mean Throughput |                     node-stats |          15 |   ops/s |
|                                              Median Throughput |                     node-stats |          15 |   ops/s |
|                                                 Max Throughput |                     node-stats |          15 |   ops/s |
|                                       100th percentile latency |                     node-stats |     87.5747 |      ms |
|                                  100th percentile service time |                     node-stats |     15.7009 |      ms |
|                                                     error rate |                     node-stats |           0 |       % |
|                                                 Min Throughput |                        default |       14.96 |   ops/s |
|                                                Mean Throughput |                        default |       14.96 |   ops/s |
|                                              Median Throughput |                        default |       14.96 |   ops/s |
|                                                 Max Throughput |                        default |       14.96 |   ops/s |
|                                       100th percentile latency |                        default |     81.3681 |      ms |
|                                  100th percentile service time |                        default |     14.2514 |      ms |
|                                                     error rate |                        default |           0 |       % |
|                                                 Min Throughput |                           term |       15.59 |   ops/s |
|                                                Mean Throughput |                           term |       15.59 |   ops/s |
|                                              Median Throughput |                           term |       15.59 |   ops/s |
|                                                 Max Throughput |                           term |       15.59 |   ops/s |
|                                       100th percentile latency |                           term |      78.107 |      ms |
|                                  100th percentile service time |                           term |     13.7333 |      ms |
|                                                     error rate |                           term |           0 |       % |
|                                                 Min Throughput |                         phrase |       15.09 |   ops/s |
|                                                Mean Throughput |                         phrase |       15.09 |   ops/s |
|                                              Median Throughput |                         phrase |       15.09 |   ops/s |
|                                                 Max Throughput |                         phrase |       15.09 |   ops/s |
|                                       100th percentile latency |                         phrase |     80.0189 |      ms |
|                                  100th percentile service time |                         phrase |     13.5385 |      ms |
|                                                     error rate |                         phrase |           0 |       % |
|                                                 Min Throughput |           country_agg_uncached |       15.15 |   ops/s |
|                                                Mean Throughput |           country_agg_uncached |       15.15 |   ops/s |
|                                              Median Throughput |           country_agg_uncached |       15.15 |   ops/s |
|                                                 Max Throughput |           country_agg_uncached |       15.15 |   ops/s |
|                                       100th percentile latency |           country_agg_uncached |     80.8607 |      ms |
|                                  100th percentile service time |           country_agg_uncached |     14.6161 |      ms |
|                                                     error rate |           country_agg_uncached |           0 |       % |
|                                                 Min Throughput |             country_agg_cached |       14.98 |   ops/s |
|                                                Mean Throughput |             country_agg_cached |       14.98 |   ops/s |
|                                              Median Throughput |             country_agg_cached |       14.98 |   ops/s |
|                                                 Max Throughput |             country_agg_cached |       14.98 |   ops/s |
|                                       100th percentile latency |             country_agg_cached |     82.7271 |      ms |
|                                  100th percentile service time |             country_agg_cached |     15.6875 |      ms |
|                                                     error rate |             country_agg_cached |           0 |       % |
|                                                 Min Throughput |                         scroll |       12.86 | pages/s |
|                                                Mean Throughput |                         scroll |       12.86 | pages/s |
|                                              Median Throughput |                         scroll |       12.86 | pages/s |
|                                                 Max Throughput |                         scroll |       12.86 | pages/s |
|                                       100th percentile latency |                         scroll |      239.72 |      ms |
|                                  100th percentile service time |                         scroll |     83.4411 |      ms |
|                                                     error rate |                         scroll |           0 |       % |
|                                                 Min Throughput |                     expression |       14.89 |   ops/s |
|                                                Mean Throughput |                     expression |       14.89 |   ops/s |
|                                              Median Throughput |                     expression |       14.89 |   ops/s |
|                                                 Max Throughput |                     expression |       14.89 |   ops/s |
|                                       100th percentile latency |                     expression |     84.7679 |      ms |
|                                  100th percentile service time |                     expression |     17.3546 |      ms |
|                                                     error rate |                     expression |           0 |       % |
|                                                 Min Throughput |                painless_static |       16.82 |   ops/s |
|                                                Mean Throughput |                painless_static |       16.82 |   ops/s |
|                                              Median Throughput |                painless_static |       16.82 |   ops/s |
|                                                 Max Throughput |                painless_static |       16.82 |   ops/s |
|                                       100th percentile latency |                painless_static |     78.5918 |      ms |
|                                  100th percentile service time |                painless_static |     19.0224 |      ms |
|                                                     error rate |                painless_static |           0 |       % |
|                                                 Min Throughput |               painless_dynamic |       13.43 |   ops/s |
|                                                Mean Throughput |               painless_dynamic |       13.43 |   ops/s |
|                                              Median Throughput |               painless_dynamic |       13.43 |   ops/s |
|                                                 Max Throughput |               painless_dynamic |       13.43 |   ops/s |
|                                       100th percentile latency |               painless_dynamic |     100.295 |      ms |
|                                  100th percentile service time |               painless_dynamic |     25.6153 |      ms |
|                                                     error rate |               painless_dynamic |           0 |       % |
|                                                 Min Throughput | decay_geo_gauss_function_score |       13.92 |   ops/s |
|                                                Mean Throughput | decay_geo_gauss_function_score |       13.92 |   ops/s |
|                                              Median Throughput | decay_geo_gauss_function_score |       13.92 |   ops/s |
|                                                 Max Throughput | decay_geo_gauss_function_score |       13.92 |   ops/s |
|                                       100th percentile latency | decay_geo_gauss_function_score |     102.169 |      ms |
|                                  100th percentile service time | decay_geo_gauss_function_score |     30.0424 |      ms |
|                                                     error rate | decay_geo_gauss_function_score |           0 |       % |
|                                                 Min Throughput |   decay_geo_gauss_script_score |       16.91 |   ops/s |
|                                                Mean Throughput |   decay_geo_gauss_script_score |       16.91 |   ops/s |
|                                              Median Throughput |   decay_geo_gauss_script_score |       16.91 |   ops/s |
|                                                 Max Throughput |   decay_geo_gauss_script_score |       16.91 |   ops/s |
|                                       100th percentile latency |   decay_geo_gauss_script_score |       81.08 |      ms |
|                                  100th percentile service time |   decay_geo_gauss_script_score |     21.6468 |      ms |
|                                                     error rate |   decay_geo_gauss_script_score |           0 |       % |
|                                                 Min Throughput |     field_value_function_score |       15.67 |   ops/s |
|                                                Mean Throughput |     field_value_function_score |       15.67 |   ops/s |
|                                              Median Throughput |     field_value_function_score |       15.67 |   ops/s |
|                                                 Max Throughput |     field_value_function_score |       15.67 |   ops/s |
|                                       100th percentile latency |     field_value_function_score |     79.0089 |      ms |
|                                  100th percentile service time |     field_value_function_score |     14.9767 |      ms |
|                                                     error rate |     field_value_function_score |           0 |       % |
|                                                 Min Throughput |       field_value_script_score |       14.77 |   ops/s |
|                                                Mean Throughput |       field_value_script_score |       14.77 |   ops/s |
|                                              Median Throughput |       field_value_script_score |       14.77 |   ops/s |
|                                                 Max Throughput |       field_value_script_score |       14.77 |   ops/s |
|                                       100th percentile latency |       field_value_script_score |      85.858 |      ms |
|                                  100th percentile service time |       field_value_script_score |     17.9302 |      ms |
|                                                     error rate |       field_value_script_score |           0 |       % |
|                                                 Min Throughput |                    large_terms |        1.11 |   ops/s |
|                                                Mean Throughput |                    large_terms |        1.11 |   ops/s |
|                                              Median Throughput |                    large_terms |        1.11 |   ops/s |
|                                                 Max Throughput |                    large_terms |        1.11 |   ops/s |
|                                       100th percentile latency |                    large_terms |     1563.37 |      ms |
|                                  100th percentile service time |                    large_terms |     653.493 |      ms |
|                                                     error rate |                    large_terms |           0 |       % |
|                                                 Min Throughput |           large_filtered_terms |        1.57 |   ops/s |
|                                                Mean Throughput |           large_filtered_terms |        1.57 |   ops/s |
|                                              Median Throughput |           large_filtered_terms |        1.57 |   ops/s |
|                                                 Max Throughput |           large_filtered_terms |        1.57 |   ops/s |
|                                       100th percentile latency |           large_filtered_terms |      1245.8 |      ms |
|                                  100th percentile service time |           large_filtered_terms |     591.724 |      ms |
|                                                     error rate |           large_filtered_terms |           0 |       % |
|                                                 Min Throughput |         large_prohibited_terms |        1.42 |   ops/s |
|                                                Mean Throughput |         large_prohibited_terms |        1.42 |   ops/s |
|                                              Median Throughput |         large_prohibited_terms |        1.42 |   ops/s |
|                                                 Max Throughput |         large_prohibited_terms |        1.42 |   ops/s |
|                                       100th percentile latency |         large_prohibited_terms |     1369.91 |      ms |
|                                  100th percentile service time |         large_prohibited_terms |     647.845 |      ms |
|                                                     error rate |         large_prohibited_terms |           0 |       % |
|                                                 Min Throughput |           desc_sort_population |       15.25 |   ops/s |
|                                                Mean Throughput |           desc_sort_population |       15.25 |   ops/s |
|                                              Median Throughput |           desc_sort_population |       15.25 |   ops/s |
|                                                 Max Throughput |           desc_sort_population |       15.25 |   ops/s |
|                                       100th percentile latency |           desc_sort_population |     85.1217 |      ms |
|                                  100th percentile service time |           desc_sort_population |     19.3051 |      ms |
|                                                     error rate |           desc_sort_population |           0 |       % |
|                                                 Min Throughput |            asc_sort_population |       13.52 |   ops/s |
|                                                Mean Throughput |            asc_sort_population |       13.52 |   ops/s |
|                                              Median Throughput |            asc_sort_population |       13.52 |   ops/s |
|                                                 Max Throughput |            asc_sort_population |       13.52 |   ops/s |
|                                       100th percentile latency |            asc_sort_population |      91.282 |      ms |
|                                  100th percentile service time |            asc_sort_population |     17.1354 |      ms |
|                                                     error rate |            asc_sort_population |           0 |       % |
|                                                 Min Throughput | asc_sort_with_after_population |       14.87 |   ops/s |
|                                                Mean Throughput | asc_sort_with_after_population |       14.87 |   ops/s |
|                                              Median Throughput | asc_sort_with_after_population |       14.87 |   ops/s |
|                                                 Max Throughput | asc_sort_with_after_population |       14.87 |   ops/s |
|                                       100th percentile latency | asc_sort_with_after_population |     83.2379 |      ms |
|                                  100th percentile service time | asc_sort_with_after_population |     15.7722 |      ms |
|                                                     error rate | asc_sort_with_after_population |           0 |       % |
|                                                 Min Throughput |            desc_sort_geonameid |       15.98 |   ops/s |
|                                                Mean Throughput |            desc_sort_geonameid |       15.98 |   ops/s |
|                                              Median Throughput |            desc_sort_geonameid |       15.98 |   ops/s |
|                                                 Max Throughput |            desc_sort_geonameid |       15.98 |   ops/s |
|                                       100th percentile latency |            desc_sort_geonameid |     87.0126 |      ms |
|                                  100th percentile service time |            desc_sort_geonameid |     24.0742 |      ms |
|                                                     error rate |            desc_sort_geonameid |           0 |       % |
|                                                 Min Throughput | desc_sort_with_after_geonameid |       12.23 |   ops/s |
|                                                Mean Throughput | desc_sort_with_after_geonameid |       12.23 |   ops/s |
|                                              Median Throughput | desc_sort_with_after_geonameid |       12.23 |   ops/s |
|                                                 Max Throughput | desc_sort_with_after_geonameid |       12.23 |   ops/s |
|                                       100th percentile latency | desc_sort_with_after_geonameid |     101.463 |      ms |
|                                  100th percentile service time | desc_sort_with_after_geonameid |     19.4328 |      ms |
|                                                     error rate | desc_sort_with_after_geonameid |           0 |       % |
|                                                 Min Throughput |             asc_sort_geonameid |       13.36 |   ops/s |
|                                                Mean Throughput |             asc_sort_geonameid |       13.36 |   ops/s |
|                                              Median Throughput |             asc_sort_geonameid |       13.36 |   ops/s |
|                                                 Max Throughput |             asc_sort_geonameid |       13.36 |   ops/s |
|                                       100th percentile latency |             asc_sort_geonameid |     98.4937 |      ms |
|                                  100th percentile service time |             asc_sort_geonameid |     23.3735 |      ms |
|                                                     error rate |             asc_sort_geonameid |           0 |       % |
|                                                 Min Throughput |  asc_sort_with_after_geonameid |       15.52 |   ops/s |
|                                                Mean Throughput |  asc_sort_with_after_geonameid |       15.52 |   ops/s |
|                                              Median Throughput |  asc_sort_with_after_geonameid |       15.52 |   ops/s |
|                                                 Max Throughput |  asc_sort_with_after_geonameid |       15.52 |   ops/s |
|                                       100th percentile latency |  asc_sort_with_after_geonameid |     88.1628 |      ms |
|                                  100th percentile service time |  asc_sort_with_after_geonameid |     23.4953 |      ms |
|                                                     error rate |  asc_sort_with_after_geonameid |           0 |       % |


--------------------------------
[INFO] SUCCESS (took 28 seconds)
--------------------------------
```