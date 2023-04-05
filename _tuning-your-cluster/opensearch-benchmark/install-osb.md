---
layout: default
title: Installing OpenSearch Benchmark
nav_order: 5
parent: OpenSearch Benchmark
---

# Installing OpenSearch Benchmark

You can install OpenSearch Benchmark directly on a host running Linux or macOS or you can run OpenSearch Benchmark in a Docker container on any compatible host. This section of documentation describes high-level considerations for your OpenSearch Benchmark host, as well as instructions for installing OpenSearch Benchmark.

Some OpenSearch Benchmark functionality is unavailable when you run OpenSearch Benchmark in a Docker container:
- You cannot distribute the load test drivers with OpenSearch Benchmark running in a Docker container. Instead, you can distribute the load test drivers by installing OpenSearch Benchmark directly on your hosts and starting the OpenSearch Benchmark daemon.
- You can only use the `benchmark-only` pipeline because OpenSearch Benchmark cannot recursively deploy an OpenSearch cluster in its own container.

## Hardware considerations

OpenSearch Benchmark doesn't have any specific hardware requirements or constraints, but there are a few things to keep in mind.

OpenSearch Benchmark can deploy a local OpenSearch node for testing unless you are running OpenSearch Benchmark in a Docker container. If you intend to leverage this functionality in your environment, then you will need to install OpenSearch Benchmark directly on the host and make sure the host is configured appropriately for OpenSearch. See [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) for important host settings.

You should also think about which workloads you want to run. To see a list of default workload specifications for OpenSearch Benchmark, visit the [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository on GitHub. As a general rule, make sure that the OpenSearch Benchmark host has enough free storage space to store the compressed data and the full decompressed data corpus. You can use the following table to determine the approximate minimum amount of required free space by adding the compressed size with the uncompressed size for a particular workload:

| Workload Name | Document Count | Compressed Size | Uncompressed Size |
| :----: | :----: | :----: | :----: |
| eventdata | 20,000,000 | 756.0 MB | 15.3 GB |
| geonames | 11,396,503 | 252.9 MB | 3.3 GB |
| geopoint | 60,844,404 | 482.1 MB | 2.3 GB |
| geopointshape | 60,844,404 | 470.8 MB | 2.6 GB |
| geoshape | 60,523,283 | 13.4 GB | 45.4 GB |
| http_logs | 247,249,096 | 1.2 GB | 31.1 GB |
| nested | 11,203,029 | 663.3 MB | 3.4 GB |
| noaa | 33,659,481 | 949.4 MB | 9.0 GB |
| nyc_taxis | 165,346,692 | 4.5 GB | 74.3 GB |
| percolator | 2,000,000 | 121.1 kB | 104.9 MB |
| pmc | 574,199 | 5.5 GB | 21.7 GB |
| so | 36,062,278 | 8.9 GB | 33.1 GB |

Finally, your OpenSearch Benchmark host should use solid-state drives (SSDs) for storage because they perform significantly faster at read and write operations than traditional spinning disk hard drives. If your host uses spinning disk hard drives, then you might see performance bottlenecking which can skew benchmark results.

## Software dependencies

OpenSearch Benchmark has a few software dependencies based on your specific use case. If you only intend to benchmark existing, remote clusters then you only need to install the [required software](#required-software). If you plan to run OpenSearch on the same host, however, then there is [additional optional software](#additional-optional-software) that you need to install.

### Required software

OpenSearch Benchmark is written in the [Python](https://www.python.org/) programming language and requires **Python 3.8 or newer** along with [pip](https://pypi.org/project/pip/), the package installer for Python.

You can check whether Python 3 is installed, and the version, with the following command:
```bash
python3 --version
```
{% include copy.html %}

If a compatible version of Python 3 isn't installed, then we recommend using a Python management tool like [pyenv](https://github.com/pyenv/pyenv). For installation instructions, refer to the pyenv [Installation](https://github.com/pyenv/pyenv#installation) documentation.

Lastly, confirm that pip is installed on the host:
```bash
pip3 --version
```

For information about installing pip, see [pip documentation](https://pip.pypa.io/en/stable/).

### Additional optional software

You may need to install additional software on the host if any of the following apply:
- You want to use OpenSearch Benchmark to deploy a local instance of OpenSearch.
- You want to run a benchmark using a default workload.

#### Deploying a local instance of OpenSearch

When you use OpenSearch Benchmark to deploy a local instance of OpenSearch, the same requirements apply to the host as they would if you were manually installing OpenSearch. You must configure [important settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings), which includes increasing the maximum memory map count and installing an appropriate JDK version.

[Docker Engine](https://docs.docker.com/engine/) and [Docker Compose](https://docs.docker.com/compose/) must also be installed because OpenSearch Benchmark uses Docker Compose to deploy a local container for testing.

#### Running a benchmark using a default workload

OpenSearch Benchmark requires git 1.9 or newer to retrieve default workloads from the [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository on GitHub. Git is preinstalled on macOS. If your OpenSearch Benchmark host uses Linux, then you should refer to the Linux installation instructions for [git](https://git-scm.com/download/linux).

**Tip**: Install `pbzip2` 
{: .tip}

## Installing OpenSearch Benchmark

After the prerequisites are installed, you can install OpenSearch Benchmark with pip:
```bash
pip3 install opensearch-benchmark
```

You can display information about usage and syntax by passing `-h` or `--help`:
```bash
opensearch-benchmark -h
```

## Next steps

ADD