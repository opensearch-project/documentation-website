---
layout: default
title: Setting up a demo configuration
parent: Configuration
nav_order: 4
---

# Setting up a demo configuration

Welcome to the OpenSearch Security plugin's demo configuration setup guide. This tool provides a quick and easy way to replicate a production environment for testing purposes. The demo configuration includes the setup of security-related components such as internal users, roles, role mappings, audit configuration, basic authentication, tenants, and allow lists.


The demo configuration tool performs the following tasks:

1. Configures security settings which are then loaded into the security index.
2. Generates demo certificates.
3. Updates the `opensearch.yml` file to add security-related settings.

## Installing demo configuration

The demo configuration is automatically called as part of the setup for each supported distribution of OpenSearch. Following are the instructions per distribution.

**Note**: Starting from OpenSearch 2.12, a custom admin password is required to install demo configuration. If none is provided, the cluster would fail to start. Note, that this change affects fresh clusters only. Already setup clusters are not affected, as they already have `opensearch.yml` configured, and so the installation tool will not run. 

### Docker

Use the following steps to set up OpenSearch Security using Docker:

1. Download [docker-compose.yml](https://opensearch.org/downloads.html)
2. In the `docker-compose.yml` file, set `DISABLE_SECURITY_PLUGIN` to `false`.
3. Run the following command:

```bash
$ docker-compose up
```

### Setting up a custom admin password
**Note**: If you are working with OpenSearch version 2.12 and later, it's crucial to set the initial admin password before installation. To customize the admin password, you can take the following steps:

1. Download the following sample [docker-compose.yml](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml) file.
2. Create a `.env` file.
3. Add the variable `OPENSEARCH_INITIAL_ADMIN_PASSWORD` and set the variable with a strong string password.
4. Run `docker-compose up`.

### TAR (Linux)

For TAR distributions on Linux, download the the Linux set up files from the OpenSearch [downloads](https://opensearch.org/downloads.html) page. Then, use the following command to run the demo configuration: 

```bash
$ ./opensearch-tar-install.sh
```

For OpenSearch 2.12 or greater, set a new custom admin password before installation using the following command:

```bash
$ export OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>
```

### Windows

For ZIP distribution on Windows, after downloading and extracting:

```powershell
> .\opensearch-windows-install.bat
```

For OpenSearch 2.12 or greater, set a new custom admin password before installation using the following command:

```powershell
> set OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>
```

### Helm

For Helm charts, the demo configuration is automatically handled during the OpenSearch installation. For OpenSearch 2.12 and later, customize the admin password in `values.yaml` under `extraEnvs`:

```yaml
extraEnvs:
  - name: OPENSEARCH_INITIAL_ADMIN_PASSWORD
    value: <custom-admin-password>
```

### RPM

For RPM packages, install OpenSearch and set up the demo configuration using:

```bash
$ sudo yum install opensearch-{{site.opensearch_version}}-linux-x64.rpm
```

For OpenSearch 2.12 or greater, set a new custom admin password before installation using the following command:

```bash
$ sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password> yum install opensearch-{{site.opensearch_version}}-linux-x64.rpm
```

### DEB

For DEB packages, install OpenSearch and set up the demo configuration using:

```bash
$ sudo dpkg -i opensearch-{{site.opensearch_version}}-linux-arm64.deb
```

For OpenSearch 2.12 or greater, set a new custom admin password before installation using the following command:

```bash
$ sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password> dpkg -i opensearch-{{site.opensearch_version}}-linux-arm64.deb
```

### Local distribution

If you are building a local distribution, refer to the [DEVELOPER_GUIDE.md](https://github.com/opensearch-project/security/blob/main/DEVELOPER_GUIDE.md) for instructions on building a local binary for the Security plugin.

For OpenSearch 2.12 or greater, make sure that a strong password is set before installation.