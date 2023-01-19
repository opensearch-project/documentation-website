---
layout: default
title: Debian
parent: Install OpenSearch Dashboards
nav_order: 55
---

# Install OpenSearch Dashboards (Debian)

Installing OpenSearch Dashboards using the Advanced Packaging Tool (APT) package manager simplifies the process considerably compared to the [Tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tar/) method. Several technical considerations, such as the installation path, location of configuration files, and creation of a service managed by `systemd`, as examples, are handled automatically by the package manager.

Before installing OpenSearch Dashboards you must configure an OpenSearch cluster. Refer to the OpenSearch [Debian]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/debian/) installation guide for steps.
{: .important}

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but you may use any text editor available.
{:.note}

## Install OpenSearch Dashboards from a package

1. Download the Debian package for the desired version directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}. The Debian package can be downloaded for both **x64** and **arm64** architectures.
1. From the CLI, install using `dpkg`.
   ```bash
   # x64
   sudo dpkg -i opensearch-dashboards-{{site.opensearch_version}}-linux-x64.deb
   # arm64
   sudo dpkg -i opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.deb
   ```
1. After the installation succeeds, reload the systemd manager configuration.
    ```bash
    sudo systemctl daemon-reload
    ```
1. Enable OpenSearch as a service.
    ```bash
    sudo systemctl enable opensearch-dashboards
    ```
1. Start the OpenSearch service.
    ```bash
    sudo systemctl start opensearch-dashboards
    ```
1. Verify that OpenSearch launched correctly.
    ```bash
    sudo systemctl status opensearch-dashboards
    ```

### Fingerprint verification

The Debian package is not signed. If you would like to verify the fingerprint, the OpenSearch Project provides a `.sig` file as well as the `.deb` package for use with GNU Privacy Guard (GPG).

1. Download the desired Debian package.
   ```bash
   curl -SLO https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_version}}/opensearch-dashboards-{{site.opensearch_version}}-linux-x64.deb
   ```
1. Download the corresponding signature file.
   ```bash
   curl -SLO https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_version}}/opensearch-dashboards-{{site.opensearch_version}}-linux-x64.deb.sig
   ```
1. Download and import the GPG key.
   ```bash
   curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp | gpg --import -
   ```
1. Verify the signature.
   ```bash
   gpg --verify opensearch-dashboards-{{site.opensearch_version}}-linux-x64.deb.sig opensearch-dashboards-{{site.opensearch_version}}-linux-x64.deb
   ```

### Install OpenSearch Dashboards from an APT repository

APT, the primary package management tool for Debian–based operating systems, allows you to download and install the Debian package from the APT repository. 

1. Import the public GPG key. This key is used to verify that the APT repository is signed.
    ```bash
    curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp | sudo apt-key add -
    ```
1. Create an APT repository for OpenSearch:
   ```bash
   echo "deb https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/2.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/opensearch-2.x.list
   ```
1. Verify that the repository was created successfully.
    ```bash
    sudo apt-get update
    ```
1. With the repository information added, list all available versions of OpenSearch:
   ```bash
   sudo apt list -a opensearch-dashboards
   ```
1. Choose the version of OpenSearch you want to install: 
   - Unless otherwise indicated, the latest available version of OpenSearch is installed.
   ```bash
   sudo apt-get install opensearch-dashboards
   ```
   - To install a specific version of OpenSearch Dashboards:
   ```bash
   # Specify the version manually using opensearch=<version>
   sudo apt-get install opensearch-dashboards={{site.opensearch_version}}
   ```
1. During installation, the installer will present you with the GPG key fingerprint. Verify that the information matches the following:
   ```bash
   Fingerprint: c5b7 4989 65ef d1c2 924b a9d5 39d3 1987 9310 d3fc
   ```
1. Once complete, enable OpenSearch.
    ```bash
    sudo systemctl enable opensearch-dashboards
    ```
1. Start OpenSearch.
    ```bash
    sudo systemctl start opensearch-dashboards
    ```
1. Verify that OpenSearch launched correctly.
    ```bash
    sudo systemctl status opensearch-dashboards
    ```

