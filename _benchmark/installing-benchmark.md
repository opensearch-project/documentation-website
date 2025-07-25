---
layout: default
title: Installing OpenSearch Benchmark
nav_order: 5
has_children: false
canonical_url: https://docs.opensearch.org/latest/benchmark/user-guide/installing-benchmark/
redirect_to: https://docs.opensearch.org/latest/benchmark/user-guide/installing-benchmark/
---

# Installing OpenSearch Benchmark

You can install OpenSearch Benchmark directly on a host running Linux or macOS, or you can run OpenSearch Benchmark in a Docker container on any compatible host. This page provides general considerations for your OpenSearch Benchmark host as well as instructions for installing OpenSearch Benchmark.


## Choosing appropriate hardware

OpenSearch Benchmark can be used to provision OpenSearch nodes for testing. If you intend to use OpenSearch Benchmark to provision nodes in your environment, then install OpenSearch Benchmark directly on each host in the cluster. Additionally, you must configure each host in the cluster for OpenSearch. See [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) for guidance on important host settings.

Remember that OpenSearch Benchmark cannot be used to provision OpenSearch nodes when you run OpenSearch Benchmark in a Docker container. If you want to use OpenSearch Benchmark to provision nodes, or if you want to distribute the benchmark workload with the OpenSearch Benchmark daemon, then you must install OpenSearch Benchmark directly on each host using Python and pip.
{: .important}

When you select a host, you should also think about which workloads you want to run. To see a list of default benchmark workloads, visit the [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository on GitHub. As a general rule, make sure that the OpenSearch Benchmark host has enough free storage space to store the compressed data and the fully decompressed data corpus once OpenSearch Benchmark is installed.

If you want to benchmark with a default workload, then use the following table to determine the approximate minimum amount of required free space needed by adding the compressed size with the uncompressed size.

| Workload name | Document count | Compressed size | Uncompressed size |
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

Your OpenSearch Benchmark host should use solid-state drives (SSDs) for storage because they perform read and write operations significantly faster than traditional spinning-disk hard drives. Spinning-disk hard drives can introduce performance bottlenecks, which can make benchmark results unreliable and inconsistent.
{: .tip}

## Installing on Linux and macOS

If you want to run OpenSearch Benchmark in a Docker container, see [Installing with Docker](#installing-with-docker). The OpenSearch Benchmark Docker image includes all of the required software, so there are no additional steps required.
{: .important}

To install OpenSearch Benchmark directly on a UNIX host, such as Linux or macOS, make sure you have **Python 3.8 or later** installed. 

If you need help installing Python, refer to the official [Python Setup and Usage](https://docs.python.org/3/using/index.html) documentation. 

### Checking software dependencies

Before you begin installing OpenSearch Benchmark, check the following software dependencies.

Use [pyenv](https://github.com/pyenv/pyenv) to manage multiple versions of Python on your host. This is especially useful if your "system" version of Python is earlier than version 3.8.
{: .tip}

- Check that Python 3.8 or later is installed:

  ```bash
  python3 --version
  ```
  {% include copy.html %}

- Check that `pip` is installed and functional:

  ```bash
  pip --version
  ```
  {% include copy.html %}

- _Optional_: Check that your installed version of `git` is **Git 1.9 or later** using the following command. `git` is not required for OpenSearch Benchmark installation, but it is required in order to fetch benchmark workload resources from a repository when you want to perform tests. See the official Git [Documentation](https://git-scm.com/doc) for help installing Git. 

  ```bash
  git --version
  ```
  {% include copy.html %}

### Completing the installation

After the required software is installed, you can install OpenSearch Benchmark using the following command:

```bash
pip install opensearch-benchmark
```
{% include copy.html %}

After the installation completes, you can use the following command to display help information:

```bash
opensearch-benchmark -h
```
{% include copy.html %}


Now that OpenSearch Benchmark is installed on your host, you can learn about [Configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/configuring-benchmark/).

## Installing with Docker

You can find the official Docker images for OpenSearch Benchmark on [Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch-benchmark) or on the [Amazon ECR Public Gallery](https://gallery.ecr.aws/opensearchproject/opensearch-benchmark).


### Docker limitations

Some OpenSearch Benchmark functionality is unavailable when you run OpenSearch Benchmark in a Docker container. Specifically, the following restrictions apply:

- OpenSearch Benchmark cannot distribute load from multiple hosts, such as load worker coordinator hosts.
- OpenSearch Benchmark cannot provision OpenSearch nodes and can only run tests on previously existing clusters. You can only invoke OpenSearch Benchmark commands using the `benchmark-only` pipeline.

### Pulling the Docker images

To pull the image from Docker Hub, run the following command:

```bash
docker pull opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

To pull the image from Amazon Elastic Container Registry (Amazon ECR):

```bash
docker pull public.ecr.aws/opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

### Running Benchmark with Docker

To run OpenSearch Benchmark, use `docker run` to launch a container. OpenSearch Benchmark subcommands are passed as arguments when you start the container. OpenSearch Benchmark then processes the command and stops the container after the requested operation completes.

For example, the following command prints the help text for OpenSearch Benchmark to the command line and then stops the container:

```bash
docker run opensearchproject/opensearch-benchmark -h
```
{% include copy.html %}


### Establishing volume persistence in a Docker container

To make sure your benchmark data and logs persist after your Docker container stops, specify a Docker volume to mount to the image when you work with OpenSearch Benchmark.

Use the `-v` option to specify a local directory to mount and a directory in the container where the volume is attached.

The following example command creates a volume in a user's home directory, mounts the volume to the OpenSearch Benchmark container at `/opensearch-benchmark/.benchmark`, and then runs a test benchmark using the geonames workload. Some client options are also specified:

```bash
run -v $HOME/benchmarks:/opensearch-benchmark/.benchmark opensearchproject/opensearch-benchmark execute_test --target-hosts https://198.51.100.25:9200 --pipeline benchmark-only --workload geonames --client-options basic_auth_user:admin,basic_auth_password:admin,verify_certs:false --test-mode
```
{% include copy.html %}

See [Configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/configuring-benchmark/) to learn more about the files and subdirectories located in `/opensearch-benchmark/.benchmark`.

## Next steps

- [Configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/configuring-benchmark/)
- [Creating custom workloads]({{site.url}}{{site.baseurl}}/benchmark/creating-custom-workloads/)