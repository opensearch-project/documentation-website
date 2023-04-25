---
layout: default
title: Installing OpenSearch Benchmark
nav_order: 5
has_children: false
---

# Installing OpenSearch Benchmark

You can install OpenSearch Benchmark directly on a host running Linux or macOS or you can run OpenSearch Benchmark in a Docker container on any compatible host. This section of documentation describes high-level considerations for your OpenSearch Benchmark host, as well as instructions for installing OpenSearch Benchmark.

Some OpenSearch Benchmark functionality is unavailable when you run OpenSearch Benchmark in a Docker container. Specifically, the following restrictions apply:
- You cannot distribute load worker coordinator hosts.
- You can only use the `benchmark-only` pipeline.

## Choosing appropriate hardware

OpenSearch Benchmark can be used to provision OpenSearch nodes for testing. If you intend to use OpenSearch Benchmark to provision nodes in your environment, then you will need to install OpenSearch Benchmark directly on each host in the cluster. Additionally, you must configure each host in the cluster for OpenSearch. See [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) for guidance about important host settings you should review.

Remember that OpenSearch Benchmark cannot be used to provision OpenSearch nodes when you run OpenSearch Benchmark in a Docker container. If you want to use OpenSearch Benchmark to provision nodes, or if you want to distribute the benchmark workload with the OpenSearch Benchmark daemon, then you must install OpenSearch Benchmark directly on each host using Python and pip.
{: .important}

When you select a host, you should also think about which workloads you want to run. To see a list of default benchmark workload, visit the [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository on GitHub. As a general rule, make sure that the OpenSearch Benchmark host has enough free storage space to store the compressed data and the fully decompressed data corpus once OpenSearch Benchmark is installed.

If you want to benchmark with a default workload, then use the following table to determine the approximate minimum amount of required free space needed by adding the compressed size with the uncompressed size:

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

Your OpenSearch Benchmark host should use solid-state drives (SSDs) for storage because they perform significantly faster at read and write operations than traditional spinning-disk hard drives. Spinning-disk hard drives can introduce performance bottlenecking, which can make benchmark results unreliable and inconsistent.
{: .tip}

## Resolving software dependencies

If you want to run OpenSearch Benchmark in a Docker container then you can skip to [Completing the installation](#completing-the-installation). The OpenSearch Benchmark Docker image includes all of the required software, so there are no additional steps for you to take.
{: .important}

A manual installation of OpenSearch Benchmark&#8212;where you install OpenSearch Benchmark directly on the host, as opposed to using a Docker container&#8212;requires **Python 3.8 or newer** with **pip**, the package installer for Python. If you need help installing Python, refer to the official [Python Setup and Usage](https://docs.python.org/3/using/index.html) documentation. See pip [Installation](https://pip.pypa.io/en/stable/installation/) documentation for more information.

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

Use [pyenv](https://github.com/pyenv/pyenv) to manage multiple versions of Python on your host. This is especially useful if your "system" version of Python is older than version 3.8.
{: .tip}

**Git 1.9 or newer** is not required for OpenSearch Benchmark installation, but it is required to fetch benchmark workload resources from a repository when you want to perform tests. See the official Git [Documentation](https://git-scm.com/doc) for help installing Git.

Check the installed version of Git:
```bash
git --version
```
{% include copy.html %}

### Resolving optional software dependencies

When you use OpenSearch Benchmark to deploy a local instance of OpenSearch you must follow the same requirements as if you were manually installing OpenSearch on the node. For example, you must configure [important settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings) and install an appropriate JDK version.

## Completing the installation

The last steps of the installation will depend on your host environment. If you are installing OpenSearch Benchmark directly on a Linux or macOS host, then you can use pip to install the package. Otherwise, if you are running OpenSearch Benchmark in a Docker container, then you only need to pull down the image and invoke `docker run` with the desired arguments.

### Installing OpenSearch Benchmark on Linux and macOS

After the prerequisites are installed, you can install OpenSearch Benchmark using the following command:
```bash
pip install opensearch-benchmark
```
{% include copy.html %}

After the installation completes you can use the following command to display help information:
```bash
opensearch-benchmark -h
```
{% include copy.html %}

OpenSearch Benchmark will exit with an error if no arguments are supplied. Use the `-h` option to print the help text in the command line if you want to test the installation.
{: .warning}

Now that OpenSearch Benchmark is installed on your host you can learn about [Configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/tuning-your-cluster/opensearch-benchmark/config-osb/).

### Running OpenSearch Benchmark with Docker

Find official Docker images for OpenSearch Benchmark on [Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch-benchmark) and on the [Amazon ECR Public Gallery](https://gallery.ecr.aws/opensearchproject/opensearch-benchmark).

To pull the image from Docker Hub:
```bash
docker pull opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

To pull the image from Amazon ECR:
```bash
docker pull public.ecr.aws/opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

To run OpenSearch Benchmark, you use `docker run` to launch a container. OpenSearch Benchmark subcommands are passed as arguments when you start the container. OpenSearch Benchmark then processes the command, then stops the container after the requested operation completes.

For example, the following command will print the help text for OpenSearch Benchmark to the command line, and then stop the container:
```bash
docker run opensearchproject/opensearch-benchmark -h
```
{% include copy.html %}

OpenSearch Benchmark will exit with an error if no arguments are supplied. Use the `-h` option to print the help text in the command line if you want to test the installation.
{: .warning}

#### Establishing volume persistence for OpenSearch Benchmark in a Docker container

You should specify a Docker volume to mount when you work with OpenSearch Benchmark in a Docker container so that your configuration, benchmark data, and logs will persist after the container is stopped. To accomplish this, you use the `-v` option and specify a local directory to mount, and a directory in the container where the volume is attached.

The following example command creates a volume in a user's home directory, mounts the volume to the OpenSearch Benchmark container at `/opensearch-benchmark/.benchmark`, and then executes a test benchmark using the geonames workload. Some client options are also specified:
```bash
run -v $HOME/benchmarks:/opensearch-benchmark/.benchmark opensearchproject/opensearch-benchmark execute_test --target-hosts https://198.51.100.25:9200 --pipeline benchmark-only --workload geonames --client-options basic_auth_user:admin,basic_auth_password:admin,verify_certs:false --test-mode
```
{% include copy.html %}

See [Configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/tuning-your-cluster/opensearch-benchmark/config-osb/) to learn more about the files and subdirectories located in `/opensearch-benchmark/.benchmark`.

## Next steps

- [Configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/tuning-your-cluster/opensearch-benchmark/config-osb/)