---
layout: default
title: Setting up a demo configuration
parent: Configuration
nav_order: 4
---

# Setting up a demo configuration

Welcome to the OpenSearch Security plugin demo configuration setup guide. This tool provides a quick and easy way to replicate a production environment for testing purposes. The demo configuration includes the setup of security-related components, such as internal users, roles, role mappings, audit configuration, basic authentication, tenants, and allow lists.

The demo configuration tool performs the following tasks:

1. Configures security settings, which are then loaded into the security index.
2. Generates demo certificates.
3. Adds security-related settings to the `opensearch.yml` file.

## Installing the demo configuration

The demo configuration is automatically called as part of the setup for each supported distribution of OpenSearch. The following are instructions for each distribution.

**Note**: Starting with OpenSearch 2.12, a custom admin password is required in order to install the demo configuration. If none is provided, the cluster will fail to start. Note that this change only affects new clusters. Existing clusters are not affected because they already have `opensearch.yml` configured, so the installation tool will not run. 

### Docker

Use the following steps to set up the Security plugin using Docker:

1. Download [docker-compose.yml](https://opensearch.org/downloads.html).
2. Run the following command:

```bash
docker compose up
```
{% include copy.html %}

If you want to disable the Security plugin when using Docker, set the `DISABLE_SECURITY_PLUGIN` environment variable  to `true` in the `docker-compose.yml` file. Disabling the Security plugin is not recommended. For more information, see the [Docker image release README](https://github.com/opensearch-project/opensearch-build/tree/main/docker/release#disable-security-plugin-security-dashboards-plugin-security-demo-configurations-and-related-configurations) in GitHub.

### Setting up a custom admin password
**Note**: For OpenSearch versions 2.12 and later, you must set the initial admin password before installation. To customize the admin password, you can take the following steps:

1. Download the following sample [docker-compose.yml](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml) file.
2. Create a `.env` file.
3. Add the variable `OPENSEARCH_INITIAL_ADMIN_PASSWORD` and set the variable with a strong password. The password must pass the following complexity requirements:

   - Minimum 8 characters
   - Must contain at least one uppercase letter [A--Z]
   - One lowercase letter [a--z]
   - One digit [0--9]
   - One special character

4. Make sure that Docker is running on your local machine
5. Run `docker compose up` from the file directory where your `docker-compose.yml` file and `.env` file are located.

### TAR (Linux) and Mac OS 

For TAR distributions on Linux, download the Linux setup files from the OpenSearch [Download & Get Started](https://opensearch.org/downloads.html) page. Then use the following command to run the demo configuration: 

```bash
./opensearch-tar-install.sh
```
{% include copy.html %}

For OpenSearch 2.12 or later, set a new custom admin password before installation by using the following command:

```bash
export OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>
```
{% include copy.html %}

### Windows

For ZIP distributions on Windows, after downloading and extracting the setup files, run the following command:

```powershell
> .\opensearch-windows-install.bat
```
{% include copy.html %}

For OpenSearch 2.12 or later, set a new custom admin password before installation by running the following command:

```powershell
> set OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>
```
{% include copy.html %}

### Helm

For Helm charts, the demo configuration is automatically installed during the OpenSearch installation. For OpenSearch 2.12 or later, customize the admin password in `values.yaml` under `extraEnvs`:

```yaml
extraEnvs:
  - name: OPENSEARCH_INITIAL_ADMIN_PASSWORD
    value: <custom-admin-password>
```

### RPM

For RPM packages, install OpenSearch and set up the demo configuration by running the following command:

```bash
sudo yum install opensearch-{{site.opensearch_version}}-linux-x64.rpm
```
{% include copy.html %}

For OpenSearch 2.12 or later, set a new custom admin password before installation by using the following command:

```bash
sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password> yum install opensearch-{{site.opensearch_version}}-linux-x64.rpm
```
{% include copy.html %}

### DEB

For DEB packages, install OpenSearch and set up the demo configuration by running the following command:

```bash
sudo dpkg -i opensearch-{{site.opensearch_version}}-linux-arm64.deb
```
{% include copy.html %}

For OpenSearch 2.12 or later, set a new custom admin password before installation by using the following command:

```bash
sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password> dpkg -i opensearch-{{site.opensearch_version}}-linux-arm64.deb
```
{% include copy.html %}

## Local distribution

If you are building a local distribution, refer to [DEVELOPER_GUIDE.md](https://github.com/opensearch-project/security/blob/main/DEVELOPER_GUIDE.md) for instructions on building a local binary for the Security plugin.

For OpenSearch 2.12 or later, make sure that you set a strong password before installation.
