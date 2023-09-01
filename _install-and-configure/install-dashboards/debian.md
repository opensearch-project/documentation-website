---
layout: default
title: Debian
parent: Installing OpenSearch Dashboards
nav_order: 33
---

# Installing OpenSearch Dashboards (Debian)

Installing OpenSearch Dashboards using the Advanced Packaging Tool (APT) package manager simplifies the process considerably compared to the [Tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tar/) method. For example, the package manager handles several technical considerations, such as the installation path, location of configuration files, and creation of a service managed by `systemd`.

Before installing OpenSearch Dashboards you must configure an OpenSearch cluster. Refer to the OpenSearch [Debian]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/debian/) installation guide for steps.
{: .important}

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but you may use any text editor available.
{:.note}

## Installing OpenSearch Dashboards from a package

1. Download the Debian package for the desired version directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}. The Debian package can be downloaded for both **x64** and **arm64** architectures.
1. From the CLI, install using `dpkg`.
   ```bash
   # x64
   sudo dpkg -i opensearch-dashboards-{{site.opensearch_version}}-linux-x64.deb
   # arm64
   sudo dpkg -i opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.deb
   ```
1. After the installation completes, reload the systemd manager configuration.
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

## Installing OpenSearch Dashboards from an APT repository

APT, the primary package management tool for Debian–based operating systems, allows you to download and install the Debian package from the APT repository. 

1. Install the necessary packages.
   ```bash
   sudo apt-get update && sudo apt-get -y install lsb-release ca-certificates curl gnupg2
   ```
1. Import the public GPG key. This key is used to verify that the APT repository is signed.
    ```bash
    curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp | sudo gpg --dearmor --batch --yes -o /usr/share/keyrings/opensearch-keyring
    ```
1. Create an APT repository for OpenSearch.
   ```bash
   echo "deb [signed-by=/usr/share/keyrings/opensearch-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/2.x/apt stable main" | sudo tee /etc/apt/sources.list.d/opensearch-dashboards-2.x.list
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
   - To install a specific version of OpenSearch Dashboards, pass a version number after the package name.
   ```bash
   # Specify the version manually using opensearch=<version>
   sudo apt-get install opensearch-dashboards={{site.opensearch_version}}
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

## Exploring OpenSearch Dashboards

By default, OpenSearch Dashboards, like OpenSearch, binds to `localhost` when you initially install it. As a result, OpenSearch Dashboards is not reachable from a remote host unless the configuration is updated.

1. Open `opensearch_dashboards.yml`.
    ```bash
    sudo vi /etc/opensearch-dashboards/opensearch_dashboards.yml
    ```
1. Specify a network interface that OpenSearch Dashboards should bind to.
    ```bash
    # Use 0.0.0.0 to bind to any available interface.
    server.host: 0.0.0.0
    ```
1. Save and quit.
1. Restart OpenSearch Dashboards to apply the configuration change.
    ```bash
    sudo systemctl restart opensearch-dashboards
    ```
1. From a web browser, navigate to OpenSearch Dashboards. The default port is 5601.
1. Log in with the default username `admin` and the default password `admin`.
1. Visit [Getting started with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/) to learn more.
