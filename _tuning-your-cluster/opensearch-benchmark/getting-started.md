---
layout: default
title: Getting started
nav_order: 3
parent: OpenSearch Benchmark
---

# Getting started

Start using OpenSearch Benchmark right now to measure the performance of your OpenSearch cluster with this guide. In this document you will learn about the basic software dependencies required by OpenSearch Benchmark depending on your installation method. You will also learn about running a basic benchmark against an existing OpenSearch cluster.

## Installing prerequisite software

You can install OpenSearch Benchmark on your host manually&#8212;using Python 3 and pip&#8212;or you can choose to run OpenSearch Benchmark in a Docker container. Running OpenSearch Benchmark in a Docker container might be easier to set up because all of the required software dependencies are included with the official image. There are, however, two important restrictions to consider when you decide to run OpenSearch Benchmark in a Docker container:
- You cannot distribute load worker coordinator hosts using the OpenSearch Benchmark daemon when you run OpenSearch Benchmark using Docker.
- You can only use the `benchmark-only` pipeline when you run OpenSearch Benchmark using Docker.

### Option 1: Installing OpenSearch Benchmark manually with Python 3 and pip

You can install OpenSearch Benchmark on any compatible host running Linux&#8212;such as Ubuntu, Amazon Linux 2, and Red Hat-based distributions like CentOS&#8212;or macOS. We recommend that you do not install OpenSearch Benchmark on a host that is also running OpenSearch because benchmark results can be inconsistent due to kernel thread scheduling between OpenSearch Benchmark processes and OpenSearch processes.

After selecting a host, you can verify that the prerequisite software is installed. OpenSearch Benchmark requires:
- [Python](https://www.python.org/) 3.8 or newer (with pip).
- [Git](https://git-scm.com/) 1.9 or newer.

If you plan to provision OpenSearch nodes using OpenSearch Benchmark, then you must also configure some [important settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings) on your host, such as increasing the maximum memory map count and installing an appropriate JDK version.

We recommend using [pyenv](https://github.com/pyenv/pyenv), an open source tool for managing Python versions. Pyenv uses shim executables that allow you to use any available version of Python. See the official [installation](https://github.com/pyenv/pyenv#installation) documentation for more information.
{: .tip}

#### Checking software dependencies

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

Refer to the official documentation of the respective software for information about installion.

#### Installing OpenSearch Benchmark

After the required software packages and versions are satisfied, you can install OpenSearch Benchmark:
```bash
pip install opensearch-benchmark
```
{% include copy.html %}

Verify the installation by using the following command to print the help text to the standard output:
```bash
opensearch-benchmark -h
```
{% include copy.html %}

### Option 2: Installing OpenSearch Benchmark with Docker

Before deploying OpenSearch Benchmark in a Docker container you should verify that Docker is installed on the desired host. Refer to Docker's official documentation for instructions on installing and configuring Docker. All OpenSearch Benchmark software dependencies are bundled with the official image, so no additional setup is needed.

You can find official images for OpenSearch Benchmark on [Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch-benchmark) or on the [Amazon ECR Public Gallery](https://gallery.ecr.aws/opensearchproject/opensearch-benchmark).

Pull the image from Docker Hub:
```bash
docker pull opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

Pull the image from Amazon ECR Public Gallery:
```bash
docker pull public.ecr.aws/opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

Verify that Docker is able to launch the container by using the following command to print help text to the standard output:
```bash
docker run opensearchproject/opensearch-benchmark opensearch-benchmark -h
```
{% include copy.html %}

## Running your first benchmark in test mode

The syntax you should use for issuing commands with OpenSearch Benchmark will depend on your installation method.

If you installed 

You can run commands by passing them as arguments to the OpenSearch Benchmark Docker container. When you invoke a command using `docker run`, the Docker container launches and executes the command, and then the container exits.

Try it out by using the following command to print the OpenSearch Benchmark help text:
```bash
docker run opensearchproject/opensearch-benchmark opensearch-benchmark -h
```
{% include copy.html %}



Exit code (0) indicates that OpenSearch Benchmark successfully completed the operation. Exit code (1) indicates that OpenSearch Benchmark encountered an error. You can review the logs by 
{: .tip}




docker run -v $PWD/benchmarks:/benchmark/.benchmark opensearchproject/opensearch-benchmark opensearch-benchmark -h


Open question: how to inspect logs from the Docker container if it only runs for the duration of a command?
Correct way to mount?