---
layout: default
title: Docker quickstart for OpenSearch Benchmark
nav_order: 3
parent: OpenSearch Benchmark
---

# Docker quickstart guide for OpenSearch Benchmark

Start using OpenSearch Benchmark right now to measure the performance of your OpenSearch cluster with the official [Docker](https://www.docker.com/) distribution. The Docker distribution of OpenSearch Benchmark, which can be found on [Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch-benchmark) and in the [Amazon ECR Public Gallery](https://gallery.ecr.aws/opensearchproject/opensearch-benchmark), is already bundled with the necessary software packages. That means that you can spend less time configuring OpenSearch Benchmark host and more time tuning your OpenSearch cluster for optimal performance.

This quickstart guide is specific to the Docker distribution of OpenSearch Benchmark. For information about installing OpenSearch Benchmark manually on a Linux or macOS host, see [Install OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/tuning-your-cluster/opensearch-benchmark/install-osb/)
{: .note}

## Verifying your Docker installation

[Docker Desktop](https://docs.docker.com/desktop/) offers a graphical user interface (GUI) and you can install it on popular operating systems like Windows, macOS, and Linux. If your environment does not have a GUI&#8212;or if you just prefer to work with the command-line interface (CLI)&#8212;then you can install [Docker Engine](https://docs.docker.com/engine/). Refer to the official [Docker documentation](https://docs.docker.com/) for information about installing and configuring Docker in your environment.

Verify that Docker is installed by running the official [hello-world](https://hub.docker.com/_/hello-world) Docker image:
```bash
docker run hello-world
```
{% include copy.html %}

If the container can be started successfully then you will see a message and some helpful tips written to the standard output.

## Running your first benchmark

You can run commands using the OpenSearch Benchmark Docker image. When you invoke a command, the Docker container launches and executes the specified command, and then the container stops.

View the OpenSearch Benchmark help text with the following command:
```bash
docker run opensearchproject/opensearch-benchmark opensearch-benchmark -h
```
{% include copy.html %}

You should see the following output:
```
usage: opensearch-benchmark [-h] [--version]
                            {execute_test,list,info,create-workload,generate,compare,download,install,start,stop}
                            ...

   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/

 A benchmarking tool for OpenSearch

options:
  -h, --help            show this help message and exit
  --version             show program's version number and exit

subcommands:
  {execute_test,list,info,create-workload,generate,compare,download,install,start,stop}
    execute_test        Run a benchmark
    list                List configuration options
    info                Show info about a workload
    create-workload     Create a Benchmark workload from existing data
    generate            Generate artifacts
    compare             Compare two test_executions
    download            Downloads an artifact
    install             Installs an OpenSearch node locally
    start               Starts an OpenSearch node locally
    stop                Stops an OpenSearch node locally

Find out more about Benchmark at https://opensearch.org/docs
```

