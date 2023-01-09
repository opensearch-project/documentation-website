---
layout: default
title: Debian
parent: Install OpenSearch
nav_order: 55
---

{% comment %}
The following liquid syntax declares a variable, major_version_mask, which is transformed into "N.x" where "N" is the major version number. This is required for proper versioning references to the Yum repo.
{% endcomment %}
{% assign version_parts = site.opensearch_major_minor_version | split: "." %}
{% assign major_version_mask = version_parts[0] | append: ".x" %}

# DEB

Installing OpenSearch using the Advanced Packaging Tool (APT) package manager simplifies the process considerably compared to the [Tarball]({{site.url}}{{site.baseurl}}/opensearch/install/tar/) method. Several technical considerations, such as the installation path, location of configuration files, and creation of a service managed by `systemd`, as examples, are handled automatically by the package manager.

Generally speaking, installing OpenSearch from the DEB distribution can be broken down into a few steps:

1. **Download and install OpenSearch.**
   - Install manually from a DEB distribution or by creating a local repository.
1. **Configure important system settings.**
   - These settings are applied to the host before modifying any OpenSearch files.
1. **(Optional) Test OpenSearch.**
   - Confirm that OpenSearch is able to run before you apply any custom configuration.
   - This can be done without any security (no password, no certificates) or with a demo security configuration that can be applied by a packaged script.
1. **Configure OpenSearch for your environment.**
   -  Apply basic settings to OpenSearch and start using it in your environment.

The DEB distribution provides everything you need to run OpenSearch inside Debian-based Linux Distributions, such as Ubuntu.

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but you may use any text editor available.
{:.note}

## Step 1: Download and install OpenSearch

### Install OpenSearch from a package

1. Download the DEB package for the desired version directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}. The DEB package can be downloaded for both **x64** and **arm64** architectures.
1. Import the public GNU Privacy Guard (GPG) key. This key verifies that your OpenSearch package is signed.
    ```bash
    wget -qO - https://artifacts.opensearch.org/GPG-KEY-opensearch | sudo gpg --dearmor -o /usr/share/keyrings/opensearch-keyring.gpg
    ```
1. From the CLI, you can install the package with `dpkg` or `apt`.
   **x64**
   ```bash
   # Install the x64 package using dpkg.
   
   # Install the x64 package using apt.
   
   ```
   **arm64**
   ```bash
   # Install the arm64 package using dpkg.
   
   # Install the arm64 package using apt.
   
   ```
1. After the installation succeeds, enable OpenSearch as a service.
    ```bash
    sudo systemctl enable opensearch
    ```
1. Start OpenSearch.
    ```bash
    sudo systemctl start opensearch
    ```
1. Verify that OpenSearch launched correctly.
    ```bash
    sudo systemctl status opensearch
    ```

### Install OpenSearch from a local APT repository

APT, the primary package management tool for Debian–based operating systems, allows you to download and install the DEB package from the APT repository. 

1. Create a local repository file for OpenSearch:
   ```bash
   echo "deb https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/opensearch-2.x.list
   ```
1. Verify that the repository was created successfully.
    ```bash
    sudo apt-get update
    ```
1. With the repository file downloaded, list all available versions of OpenSearch:
   ```bash
   sudo apt list -a opensearch
   ```
1. Choose the version of OpenSearch you want to install: 
   - Unless otherwise indicated, the latest available version of OpenSearch is installed.
   ```bash
   sudo apt-get install opensearch
   ```
   - To install a specific version of OpenSearch:
   ```bash
   # Specify the version manually after appending a "=" to the end of opensearch in the command:
   sudo apt-get install opensearch={{site.opensearch_version}}
   ```
1. During installation, the installer will present you with the GPG key fingerprint. Verify that the information matches the following:
   ```bash
   Fingerprint: c5b7 4989 65ef d1c2 924b a9d5 39d3 1987 9310 d3fc
   ```
1. Once complete, you can run OpenSearch.
    ```bash
    sudo systemctl start opensearch
    ```
1. Verify that OpenSearch launched correctly.
    ```bash
    sudo systemctl status opensearch
    ```