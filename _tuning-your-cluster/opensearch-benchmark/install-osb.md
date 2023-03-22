---
layout: default
title: Installing OpenSearch Benchmark
nav_order: 5
parent: OpenSearch Benchmark
---

# Installing OpenSearch Benchmark

OpenSearch Benchmark can be installed on any compatible Linux host. This section of documentation covers the following:

- [Operating system requirements](#operating-system-requirements)
- [Hardware requirements](#hardware-requirements)
- [Prequisite software packages](#prerequisite-software-packages)
- [Installing OpenSearch Benchmark](#installing-opensearch-benchmark)

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but you may use any text editor available.
{:.note}

## Operating system requirements

OpenSearch Benchmark is only supported on Linux. 

## Hardware requirements

FOLLOWUP -> Asked in Slack, waiting for feedback.

## Prerequisite software packages

OpenSearch Benchmark requires a few packages that should be installed first. These include:
- [Python](https://www.python.org/) 3.8 or newer (with `pip3`).
- [Git](https://git-scm.com/) 1.9 or newer.

You can check which version of Python is being used with the following command:
```bash
python3 -V
```

**Tip**:If your host is using an older version of Python, then you can use a utility like [pyenv](https://github.com/pyenv/pyenv) that allows users to install and managed multiple versions of Python.
{: .tip}



## Installing OpenSearch Benchmark