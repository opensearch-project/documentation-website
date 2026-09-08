---
layout: default
title: Debian
parent: Installing OpenSearch Dashboards
nav_order: 33
---

{% comment %}
The following liquid syntax declares a variable, major_version_mask, which is transformed into "N.x" where "N" is the major version number. This is required for proper versioning references to the Yum repo.
{% endcomment %}
{% assign version_parts = site.opensearch_major_minor_version | split: "." %}
{% assign major_version_mask = version_parts[0] | append: ".x" %}

# Installing OpenSearch Dashboards (Debian)

Installing OpenSearch Dashboards using the Advanced Packaging Tool (APT) package manager simplifies the process considerably compared to the [Tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tar/) method. For example, the package manager handles several technical considerations, such as the installation path, location of configuration files, and creation of a service managed by `systemd`.

Before installing OpenSearch Dashboards you must configure an OpenSearch cluster. Refer to the OpenSearch [Debian]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/debian/) installation guide for steps.
{: .important}

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but you may use any text editor available.
{:.note}

## Installing OpenSearch Dashboards from a package

1. Download the Debian package for the desired version directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}. The Debian package can be downloaded for both **x64** and **arm64** architectures.
1. From the CLI, install using `dpkg`.

   x64:
   ```bash
   sudo dpkg -i opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-x64.deb
   ```
   {% include copy.html %}

   arm64:
   ```bash
   sudo dpkg -i opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-arm64.deb
   ```
   {% include copy.html %}

   For new installations of OpenSearch Dashboards 3.7 and later, you can use the following environment variable to control the Security Dashboards plugin behavior:
   ```bash
   DISABLE_SECURITY_DASHBOARDS_PLUGIN=true
   ```
   {% include copy.html %}

1. After the installation completes, reload the systemd manager configuration:
    ```bash
    sudo systemctl daemon-reload
    ```
    {% include copy.html %}

1. Enable OpenSearch Dashboards as a service:
    ```bash
    sudo systemctl enable opensearch-dashboards
    ```
    {% include copy.html %}

1. Start the OpenSearch Dashboards service:
    ```bash
    sudo systemctl start opensearch-dashboards
    ```
    {% include copy.html %}

1. Verify that OpenSearch Dashboards launched correctly:
    ```bash
    sudo systemctl status opensearch-dashboards
    ```
    {% include copy.html %}

### Fingerprint verification

The Debian package is not signed. If you would like to verify the fingerprint, the OpenSearch Project provides a `.sig` file as well as the `.deb` package for use with GNU Privacy Guard (GPG).

1. Download the desired Debian package:
   ```bash
   curl -SLO https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_dashboards_version}}/opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-x64.deb
   ```
   {% include copy.html %}

1. Download the corresponding signature file:
   ```bash
   curl -SLO https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_dashboards_version}}/opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-x64.deb.sig
   ```
   {% include copy.html %}

1. Download and import the GPG key:
   ```bash
   curl -o- https://artifacts.opensearch.org/publickeys/opensearch-release.pgp | gpg --import -
   ```
   {% include copy.html %}

1. Verify the signature:
   ```bash
   gpg --verify opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-x64.deb.sig opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-x64.deb
   ```
   {% include copy.html %}

## Installing OpenSearch Dashboards from an APT repository

APT, the primary package management tool for Debian–based operating systems, allows you to download and install the Debian package from the APT repository. 

1. Install the necessary packages:
   ```bash
   sudo apt-get update && sudo apt-get -y install lsb-release ca-certificates curl gnupg2
   ```
   {% include copy.html %}

1. Create the keyrings directory if it doesn't already exist:
   ```bash
   sudo mkdir -p /etc/apt/keyrings
   ```
   {% include copy.html %}

1. Import the public GPG key. This key is used to verify that the APT repository is signed.
    ```bash
    curl -o- https://artifacts.opensearch.org/publickeys/opensearch-release.pgp | sudo gpg --dearmor --batch --yes -o /etc/apt/keyrings/opensearch-release-keyring
    ```
    {% include copy.html %}

1. Create an APT repository for OpenSearch Dashboards:
   ```bash
   echo "deb [signed-by=/etc/apt/keyrings/opensearch-release-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{major_version_mask}}/apt stable main" | sudo tee /etc/apt/sources.list.d/opensearch-dashboards-{{major_version_mask}}.list
   ```
   {% include copy.html %}

1. Verify that the repository was created successfully:
    ```bash
    sudo apt-get update
    ```
    {% include copy.html %}

1. (Optional) As of May 22, 2024, the `Origin` and `Label` values of the APT repository were updated as part of [this change](https://github.com/opensearch-project/opensearch-build/issues/4485). If you created the APT repository before this date, run the following command to accept the updated release information:
    ```bash
    sudo apt-get update --allow-releaseinfo-change
    ```
    {% include copy.html %}

1. With the repository information added, list all available versions of OpenSearch Dashboards:
   ```bash
   sudo apt list -a opensearch-dashboards
   ```
   {% include copy.html %}

1. Choose the version of OpenSearch Dashboards you want to install:
   - Unless otherwise indicated, the latest available version of OpenSearch Dashboards is installed:
   ```bash
   sudo apt-get install opensearch-dashboards
   ```
   {% include copy.html %}

   - To install a specific version of OpenSearch Dashboards, pass a version number after the package name:
   ```bash
   sudo apt-get install opensearch-dashboards={{site.opensearch_dashboards_version}}
   ```
   {% include copy.html %}

1. Once complete, enable OpenSearch Dashboards:
    ```bash
    sudo systemctl enable opensearch-dashboards
    ```
    {% include copy.html %}

1. Start OpenSearch Dashboards:
    ```bash
    sudo systemctl start opensearch-dashboards
    ```
    {% include copy.html %}

1. Verify that OpenSearch Dashboards launched correctly:
    ```bash
    sudo systemctl status opensearch-dashboards
    ```
    {% include copy.html %}

## Exploring OpenSearch Dashboards

By default, OpenSearch Dashboards, like OpenSearch, binds to `localhost` when you initially install it. As a result, OpenSearch Dashboards is not reachable from a remote host unless the configuration is updated.

1. Open `opensearch_dashboards.yml`:
    ```bash
    sudo vi /etc/opensearch-dashboards/opensearch_dashboards.yml
    ```
    {% include copy.html %}

1. Specify a network interface that OpenSearch Dashboards should bind to. Use `0.0.0.0` to bind to any available interface:
    ```bash
    server.host: 0.0.0.0
    ```
    {% include copy.html %}

1. Save and quit.
1. Restart OpenSearch Dashboards to apply the configuration change:
    ```bash
    sudo systemctl restart opensearch-dashboards
    ```
    {% include copy.html %}

1. From a web browser, navigate to OpenSearch Dashboards. The default port is 5601.
1. Log in with the default username `admin` and the default password `admin`. (For OpenSearch 2.12 and later, the password should be the custom admin password)
1. Visit [Getting started with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/) to learn more.


## Upgrade to a newer version

OpenSearch Dashboards instances installed using `dpkg` or `apt-get` can be upgraded to a newer version.

Upgrade your OpenSearch cluster before you upgrade OpenSearch Dashboards. OpenSearch Dashboards must run the same version as the cluster it connects to, and installed plugins must match that version. For more information, see [Plugin compatibility]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/#plugin-compatibility).
{: .important}

### Prepare the host for an upgrade

The `opensearch-dashboards` package declares no dependencies on other Debian packages. An upgrade that fails with unresolved dependencies therefore points to the APT configuration on the host rather than to OpenSearch Dashboards itself. Complete the following steps before you run an upgrade command.

1. Install the packages that APT needs in order to read the OpenSearch Dashboards repository over HTTPS:
   ```bash
   sudo apt-get update && sudo apt-get -y install lsb-release ca-certificates curl gnupg2
   ```
   {% include copy.html %}

1. Back up your configuration. The package registers the following files as configuration files, and `dpkg` prompts you to keep or replace each one that you edited:

   - `/etc/opensearch-dashboards/opensearch_dashboards.yml`
   - `/etc/opensearch-dashboards/node.options`
   - `/etc/default/opensearch-dashboards`
   - `/etc/init.d/opensearch-dashboards`

   To back up the main configuration file, run the following command:
   ```bash
   sudo cp /etc/opensearch-dashboards/opensearch_dashboards.yml /etc/opensearch-dashboards/opensearch_dashboards.yml.bak
   ```
   {% include copy.html %}

   Run the upgrade from an interactive shell so that you can respond to these prompts. An unattended upgrade either stops at the prompt or applies the default answer configured in `Dpkg::Options` on the host.
   {: .note}

1. Refresh the package lists and confirm that a newer version is available:
   ```bash
   sudo apt-get update && sudo apt list -a opensearch-dashboards
   ```
   {% include copy.html %}

   If `apt-get update` reports that a public key is unavailable, or if the newest version listed is the version that you already have, see [Upgrade across major versions](#upgrade-across-major-versions).

### Manual upgrade with DPKG

Download the Debian package for the desired upgrade version directly from the [OpenSearch Project downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

Navigate to the directory containing the distribution and run the following command:

```bash
sudo dpkg -i opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-x64.deb
```
{% include copy.html %}

This method reads the package file directly and does not use an APT repository, so it also upgrades across major versions.
{: .tip}

### APT-GET

To upgrade to the newest available version of OpenSearch Dashboards, run the following command:

```bash
sudo apt-get install --only-upgrade opensearch-dashboards
```
{% include copy.html %}

You can also upgrade to a specific OpenSearch Dashboards version by providing the version number:

```bash
sudo apt-get install opensearch-dashboards=<version>
```
{% include copy.html %}

The `apt-get upgrade` subcommand acts on every installed package on the host and cannot install or remove packages, so an unrelated package that APT holds back stops the OpenSearch Dashboards upgrade. The `--only-upgrade` option limits the operation to the `opensearch-dashboards` package.
{: .note}

### Upgrade across major versions

The repository definition that you create during installation is pinned to one major version, so APT reports no newer version when you try to move to a different major version. The repositories for different major versions are also signed with different GPG keys, so APT reports a missing public key when it reads the new repository using your existing keyring.

1. Import the public GPG key for the new repository:
   ```bash
   curl -o- https://artifacts.opensearch.org/publickeys/opensearch-release.pgp | sudo gpg --dearmor --batch --yes -o /etc/apt/keyrings/opensearch-release-keyring
   ```
   {% include copy.html %}

   Repositories for OpenSearch Dashboards 2.x are signed with the key published at `https://artifacts.opensearch.org/publickeys/opensearch.pgp`. Leave the keyring for that key in place until you remove the 2.x repository definition. Otherwise, `apt-get update` fails while reading the 2.x repository.
   {: .note}

1. Add the repository for the new major version:
   ```bash
   echo "deb [signed-by=/etc/apt/keyrings/opensearch-release-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{major_version_mask}}/apt stable main" | sudo tee /etc/apt/sources.list.d/opensearch-dashboards-{{major_version_mask}}.list
   ```
   {% include copy.html %}

1. Remove the repository definition for your previous major version, replacing `<previous-major-version>` with a value such as `2.x`:
   ```bash
   sudo rm /etc/apt/sources.list.d/opensearch-dashboards-<previous-major-version>.list
   ```
   {% include copy.html %}

1. Refresh the package lists and confirm that the new version appears:
   ```bash
   sudo apt-get update && sudo apt list -a opensearch-dashboards
   ```
   {% include copy.html %}

1. Install the new version:
   ```bash
   sudo apt-get install opensearch-dashboards=<version>
   ```
   {% include copy.html %}

### Automatically restart the service after a package upgrade (2.13.0+)

To automatically restart OpenSearch Dashboards after a package upgrade, enable the `opensearch-dashboards.service` through `systemd`:

```bash
sudo systemctl enable opensearch-dashboards.service
```
{% include copy.html %}
