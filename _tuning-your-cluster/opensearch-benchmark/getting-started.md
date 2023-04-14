---
layout: default
title: Getting started
nav_order: 3
parent: OpenSearch Benchmark
---

# Getting started

Start using OpenSearch Benchmark right now to measure the performance of your OpenSearch cluster. This guide walks you through prerequisites for installing and running OpenSearch Benchmark, and provides some basic information about configuring OpenSearch Benchmark.

## Installing prerequisite software

You can install OpenSearch Benchmark on your host manually&#8212;using Python 3 and pip&#8212;or you can choose to run OpenSearch Benchmark in a Docker container. Running OpenSearch Benchmark in a Docker container might be easier to set up because all of the required software dependencies are included with the official image. There are, however, two important restrictions to consider when you decide to run OpenSearch Benchmark in a Docker container:
- You cannot distribute load worker coordinator hosts using the OpenSearch Benchmark daemon when you run OpenSearch Benchmark using Docker.
- You can only use the `benchmark-only` pipeline when you run OpenSearch Benchmark using Docker.

### Option 1: Installing OpenSearch Benchmark manually with Python 3 and pip

First, you need to choose a host that will run OpenSearch Benchmark. You can install OpenSearch Benchmark on any compatible host running Linux&#8212;such as Ubuntu, Amazon Linux 2, and Red Hat-based distributions like CentOS&#8212;or macOS. We recommend that you do not install OpenSearch Benchmark on a host that is also running OpenSearch because 

### Option 2: Installing OpenSearch Benchmark with Docker

You can find official images for OpenSearch Benchmark on [Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch-benchmark) or on the [Amazon ECR Public Gallery](https://gallery.ecr.aws/opensearchproject/opensearch-benchmark).
{: .note}

with the official [Docker](https://www.docker.com/) distribution. The Docker distribution of OpenSearch Benchmark, which can be found on [Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch-benchmark) and in the [Amazon ECR Public Gallery](https://gallery.ecr.aws/opensearchproject/opensearch-benchmark), is already bundled with the necessary software packages. That means that you can spend less time configuring OpenSearch Benchmark host and more time tuning your OpenSearch cluster for optimal performance.

## Verifying your Docker installation

[Docker Desktop](https://docs.docker.com/desktop/) offers a graphical user interface (GUI) and you can install it on popular operating systems like Windows, macOS, and Linux. If your environment does not have a GUI&#8212;or if you just prefer to work with the command-line interface (CLI)&#8212;then you can install [Docker Engine](https://docs.docker.com/engine/). Refer to the official [Docker documentation](https://docs.docker.com/) for information about installing and configuring Docker in your environment.

Verify that Docker is installed by running the official [hello-world](https://hub.docker.com/_/hello-world) Docker image:
```bash
docker run hello-world
```
{% include copy.html %}

If the container starts successfully then you will see a message written to the standard output.

## Running your first benchmark

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