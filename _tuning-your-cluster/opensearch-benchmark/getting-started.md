---
layout: default
title: Getting started
nav_order: 3
parent: OpenSearch Benchmark
---

# Getting started

This guide explains how to install and run OpenSearch Benchmark to perform a test benchmark on an **existing** OpenSearch cluster. If you do not already have running OpenSearch cluster, then you should review the OpenSearch [Quickstart]({{site.url}}{{site.baseurl}}/quickstart/) guide to deploy a test cluster before continuing with the process outlined in this document.

## Installing prerequisite software

You can install OpenSearch Benchmark on a host manually&#8212;using Python 3 and pip&#8212;or you can choose to run OpenSearch Benchmark in a Docker container. Running OpenSearch Benchmark in a Docker container simplifies the setup process because all of the required software dependencies are included with the official image. 

There are two important restrictions to consider when you decide to run OpenSearch Benchmark in a Docker container:
- You cannot distribute load worker coordinator hosts using the OpenSearch Benchmark daemon when you run OpenSearch Benchmark using Docker.
- You can only use the `benchmark-only` pipeline when you run OpenSearch Benchmark using Docker.

### Option 1: Installing OpenSearch Benchmark manually with Python 3 and pip

You can install OpenSearch Benchmark on any compatible host running Linux&#8212;such as Ubuntu, Amazon Linux 2, and Red Hat-based distributions like CentOS&#8212;or macOS. We recommend that you do not install OpenSearch Benchmark on a host that is also running OpenSearch because benchmark results can be inconsistent due to kernel thread scheduling between OpenSearch Benchmark processes and OpenSearch processes.

After selecting a host, you can verify that the prerequisite software is installed. OpenSearch Benchmark requires:
- [Python](https://www.python.org/) 3.8 or newer (with pip).
- [Git](https://git-scm.com/) 1.9 or newer.

If you do plan to provision OpenSearch nodes with OpenSearch Benchmark, then you must also configure some [important settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings) on the host, such as increasing the maximum memory map count and installing an appropriate JDK version.

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

After you confirm that software dependencies are satisfied, you can install OpenSearch Benchmark:
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

Docker must be installed on the host if you want to deploy OpenSearch Benchmark in a Docker container.. Refer to Docker's official documentation for instructions on installing and configuring Docker.

You can find official images for OpenSearch Benchmark on [Docker Hub](https://hub.docker.com/r/opensearchproject/opensearch-benchmark) or on the [Amazon ECR Public Gallery](https://gallery.ecr.aws/opensearchproject/opensearch-benchmark).

Pull the image from Docker Hub using the following command:
```bash
docker pull opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

Pull the image from Amazon ECR Public Gallery using the following command:
```bash
docker pull public.ecr.aws/opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

Verify that Docker is able to launch the container by using the following command to print help text to the standard output:
```bash
docker run opensearchproject/opensearch-benchmark opensearch-benchmark -h
```
{% include copy.html %}

Use an alias to simplify the command syntax for Docker commands. For example, you could define an alias like `osb="docker run opensearchproject/opensearch-benchmark opensearch-benchmark"`. Then, using the previous command as an example, you could run `osb -h` which is much shorter than `docker run opensearchproject/opensearch-benchmark opensearch-benchmark -h`.
{: .tip}

## Understanding command line syntax

The syntax you use to issue commands with OpenSearch Benchmark will depend on your installation method.

If you installed using **Python or pip**, you issue commands like any other Linux command line utility:
```bash
opensearch-benchmark [SUBCOMMAND] [ARGS]
```

Alternatively, if you are running OpenSearch Benchmark in a Docker container, you issue commands by passing them as arguments when you run the container:
```bash
docker run opensearchproject/opensearch-benchmark [SUBCOMMAND] [ARGS]
```

You run commands by passing them as arguments to the OpenSearch Benchmark Docker container. When you invoke a command using `docker run`, the Docker container launches and executes the command, and then the container exits.

Try it out by using the following command to print the OpenSearch Benchmark help text:
```bash
docker run opensearchproject/opensearch-benchmark opensearch-benchmark -h
```
{% include copy.html %}

Alternatively, you can run an interactive pseudo-TTY session with the Docker container and issue commands using standard command line syntax:
1. To start the pseudo-TTY session, enter the following command:
   ```bash
   docker run --entrypoint bash -it opensearchproject/opensearch-benchmark -c /bin/bash
   ```
   {% include copy.html %}
1. Run a command to display the help text:
   ```bash
   opensearch-benchmark -h
   ```
   {% include copy.html %}
1. When you are done working with the container you end the pseudo-TTY session by entering `exit`.

## Running your first benchmark in test mode

Now that you've installed OpenSearch Benchmark, it's time for you to run your first test. The following steps assume that the target OpenSearch cluster is secured with self-signed TLS certificates and default security credentials, so the username and password are both `admin`.

Example commands in this section will use standard command line syntax: `opensearch-benchmark [SUBCOMMAND] [ARGS]`. You might need to modify the commands depending on your installation method or if you are using shell aliases.
{: .note}

Run the following command, replacing `<host-address>` with your OpenSearch cluster's endpoint (for example, `https://your-cluster.your-domain.com:9200`):
```bash
opensearch-benchmark execute_test --target-hosts <host-address> --pipeline benchmark-only --workload geonames --client-options basic_auth_user:admin,basic_auth_password:admin,verify_certs:false --test-mode
```
{% include copy.html %}

The following arguments are included:
1. `execute_test` is specified as the subcommand because you want to run a benchmark.
1. `--target-hosts` defines the endpoint of your OpenSearch cluster, including the protocol and port.
1. `--pipeline` defines the steps OpenSearch Benchmark will take. Use `benchmark-only` because you are not using OpenSearch Benchmark to provision an OpenSearch cluster.
1. `--workload` specifies the benchmarking workload you want to use. This example uses the [geonames](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/geonames) workload.
1. `--client-options` allows you to define important parameters as a comma-separated list of key-value pairs:
   1. `basic_auth_user` is the user that OpenSearch Benchmark uses to communicate with the OpenSearch REST API.
   1. `basic_auth_password` is the password for the user that OpenSearch Benchmark uses to communicate with the OpenSearch REST API.
   1. `verify_certs` is set to `false` because the TLS certificates are self-signed so they cannot be verified. You can omit this parameter if your OpenSearch cluster is secured with certificates signed by a trust certificate authority (CA).
1. `--test-mode` is used when you want to validate a benchmark workload. The OpenSearch Benchmark command is checked for syntax errors, and benchmark operations are limited to a single instance each. This flag is useful for validating custom workloads, and it significantly reduces the time a benchmark takes to complete.

