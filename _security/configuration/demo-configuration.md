---
layout: default
title: Demo Configuration Setup Guide
parent: Configuration
nav_order: 4
redirect_from:
 - /security-plugin/configuration/demo-configuration/
---

# Demo Configuration Setup Guide

Welcome to the OpenSearch Security plugin's demo configuration setup guide. This tool provides a quick and easy way to replicate a production environment for testing purposes. The demo configuration includes the setup of security-related components such as internal users, roles, role mappings, audit configuration, basic authentication, and more.

## Overview

The demo configuration tool performs the following tasks:

1. Configures security settings like internal users, roles, role mappings, audit configuration, basic authentication, etc., which are then loaded into the security index.
2. Generates demo certificates.
3. Updates the `opensearch.yml` file to add security-related settings.

## Installing Demo Configuration

The demo configuration is automatically called as part of the setup for each supported distribution of OpenSearch. Follow the instructions below for your specific distribution.

### Docker

Follow these steps to set up OpenSearch Security via docker:

1. [Download and install Docker](<add-a-link-to-docker-download-steps>).
2. Ensure that the `DISABLE_SECURITY_PLUGIN` environment variable is not set to true.
3. Run the following command in your terminal:
```bash
$ docker-compose up
```

**Note**: If you are working with OpenSearch version 2.12 and above, it's crucial to set the initial admin password before installation. To customize the admin password, you can take the following steps:

- Download the sample [docker-compose.yml](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml).
- Create a `.env` file.
- Add the `OPENSEARCH_INITIAL_ADMIN_PASSWORD` variable with a strong password.
- Run `docker-compose up`.

For more details and examples, please refer to our [documentation](<link-to-docker-docs>).

### TAR (Linux)

For TAR distribution on Linux, after downloading and extracting:

```bash
$ ./opensearch-tar-install.sh
```

**Note**: For OpenSearch 2.12 and above, set the initial admin password before installation:

```bash
$ export OPENSEARCH_INITIAL_ADMIN_PASSWORD=<your-strong-password>
```

### Windows

For ZIP distribution on Windows, after downloading and extracting:

```powershell
> .\opensearch-windows-install.bat
```

**Note**: For OpenSearch 2.12 and above, set the initial admin password before installation:

```powershell
> set OPENSEARCH_INITIAL_ADMIN_PASSWORD=<your-strong-password>
```

### HELM

For HELM charts, the demo configuration is automatically handled during the OpenSearch installation. For OpenSearch 2.12 and above, customize the admin password in `values.yaml` under `extraEnvs`:

```yaml
extraEnvs:
  - name: OPENSEARCH_INITIAL_ADMIN_PASSWORD
    value: <your-strong-password>
```

### RPM (Red Hat / CentOS)

For RPM packages, install OpenSearch and set up the demo configuration using:

```bash
$ sudo yum install opensearch-2.12.0-linux-x64.rpm
```

**Note**: For OpenSearch 2.12 and above, set the initial admin password before installation:

```bash
$ sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<your-strong-password> yum install opensearch-2.12.0-linux-x64.rpm
```

### DEB (Debian / Ubuntu)

For DEB packages, install OpenSearch and set up the demo configuration using:

```bash
$ sudo dpkg -i opensearch-2.12.0-linux-arm64.deb
```

**Note**: For OpenSearch 2.12 and above, set the initial admin password before installation:

```bash
$ sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<your-strong-password> dpkg -i opensearch-2.12.0-linux-arm64.deb
```

### Local Distribution

If you are building a local distribution, refer to the [DEVELOPER_GUIDE.md](https://github.com/opensearch-project/security/blob/main/DEVELOPER_GUIDE.md) for instructions on building a local binary for the Security plugin.

**Note**: For OpenSearch 2.12 and above, ensure that a strong password is set before installation.