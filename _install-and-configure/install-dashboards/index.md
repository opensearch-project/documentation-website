---
layout: default
title: Installing OpenSearch Dashboards
nav_order: 3
has_children: true
redirect_from:
  - /dashboards/install/index/
  - /dashboards/compatibility/
  - /install-and-configure/install-dashboards/
---

# Installing OpenSearch Dashboards

OpenSearch Dashboards is the user interface for OpenSearch. You can use it to explore, visualize, and query your data. You can install OpenSearch Dashboards using any of the following methods:

- [Docker]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/docker/)
- [OpenSearch Kubernetes Operator]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/), which installs OpenSearch and OpenSearch Dashboards together
- [Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/helm/)
- [Debian]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/debian/)
- [RPM]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/rpm/)
- [Tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tar/)
- [Ansible playbook]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/ansible/), which installs OpenSearch and OpenSearch Dashboards together
- [Windows]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/windows/)

OpenSearch Dashboards connects to an existing OpenSearch cluster, so install OpenSearch first. For more information, see [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/).

## Preparing OpenSearch Dashboards for production

The [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/) and the default configuration in most guides connect OpenSearch Dashboards to OpenSearch using the demo security configuration. In this configuration, OpenSearch Dashboards serves pages over HTTP, does not verify the OpenSearch certificate, and authenticates to OpenSearch using the `kibanaserver` user's known default password. Before you use OpenSearch Dashboards in production, complete the following tasks:

- Prepare the OpenSearch cluster for production. For more information, see [Preparing a cluster for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#preparing-a-cluster-for-production).
- Enable TLS between browsers and OpenSearch Dashboards, and verify the OpenSearch certificate by setting `opensearch.ssl.verificationMode` to `full`. For more information, see [Configuring TLS for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tls/).
- Change the `kibanaserver` password. For more information, see [Dashboards service account password]({{site.url}}{{site.baseurl}}/security/configuration/passwords/#dashboards-service-account-password).
- Configure how users sign in. For more information, see [Configuring sign-in options]({{site.url}}{{site.baseurl}}/security/configuration/multi-auth/).

## Accessing OpenSearch Dashboards

After you install and start OpenSearch Dashboards, open it in a web browser:

1. Go to `http://localhost:5601`. OpenSearch Dashboards listens on port `5601` by default. If OpenSearch Dashboards runs on a different host, replace `localhost` with the IP address or DNS name of that host.

   By default, the tarball, RPM, and Debian installations bind OpenSearch Dashboards to `localhost`, so you cannot reach it from other hosts. To allow access from other hosts, set `server.host` to `0.0.0.0` or to an IP address of the host in `opensearch_dashboards.yml` and restart OpenSearch Dashboards.

1. Log in as the `admin` user using the custom admin password that you set when you installed OpenSearch. If you disabled the Security plugin, no login is required.

OpenSearch Dashboards can take about 1 minute to start. If the page does not load or returns a `503` error, wait and then reload the page.

If you cannot log in, see [Common issues](#common-issues).

To learn how to use OpenSearch Dashboards, see [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/).

## Browser compatibility

OpenSearch Dashboards supports the following web browsers:

- Chrome
- Firefox
- Safari
- Edge (Chromium)

Other Chromium-based browsers might work, as well. Internet Explorer and Microsoft Edge Legacy are **not** supported.

<!-- vale off -->
## Node.js compatibility
<!-- vale on -->

OpenSearch Dashboards requires the Node.js runtime binary to run. One is included in the distribution packages available from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

OpenSearch Dashboards versions 2.8 through 2.19 support Node.js 14, 16, and 18. Distribution packages for versions 2.10 through 2.19 include Node.js 18 and Node.js 14 (for backward compatibility).

OpenSearch Dashboards versions 3.0 through 3.4 include Node.js 20. Versions 3.5 and later include Node.js 22.

To use a Node.js runtime binary other than the ones included in the distribution packages, follow these steps:

1. Download and install [Node.js](https://nodejs.org/en/download){:target='\_blank'}. The compatible versions are `>=14.20.1 <23`.
1. Set the `OSD_NODE_HOME` or `NODE_HOME` environment variable to the Node.js installation directory:

    - On Linux or macOS, if Node.js is installed to `/usr/local/nodejs` and the runtime binary is `/usr/local/nodejs/bin/node`:

      ```bash
      export NODE_HOME=/usr/local/nodejs
      ```

    - If Node.js is installed using NVM and the runtime binary is `/Users/user/.nvm/versions/node/v22.22.3/bin/node`:

      ```bash
      export NODE_HOME=/Users/user/.nvm/versions/node/v22.22.3
      # or, if NODE_HOME is used for something else:
      export OSD_NODE_HOME=/Users/user/.nvm/versions/node/v22.22.3
      ```

    - On Windows, if Node.js is installed to `C:\Program Files\nodejs` and the runtime binary is `C:\Program Files\nodejs\node.exe`, use the following command in Command Prompt:

      ```bat
      set "NODE_HOME=C:\Program Files\nodejs"
      ```

      Alternatively, use the following command in PowerShell:

      ```powershell
      $Env:NODE_HOME = 'C:\Program Files\nodejs'
      ```

   Consult your operating system's documentation to make a persistent change to the environment variables.

The OpenSearch Dashboards start script, `bin/opensearch-dashboards`, searches for the Node.js runtime binary using `OSD_NODE_HOME` and then `NODE_HOME` before using the binaries included with the distribution packages. If a usable Node.js runtime binary is not found, the start script attempts to find one in the system-wide `PATH` before failing.

## Configuration

To learn how to configure TLS for OpenSearch Dashboards, see [Configuring TLS for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tls/).

## Common issues

Review these common issues and suggested solutions if OpenSearch Dashboards fails to start or you cannot log in.

### Error message: "Request Timeout after 30000ms"

If you encounter the error `FATAL  Error: Request Timeout after 30000ms` when OpenSearch Dashboards starts, run OpenSearch Dashboards on a host that has more resources. We recommend four CPU cores and 8 GB of RAM.

### You can't log in to OpenSearch Dashboards

OpenSearch Dashboards does not have its own users. You log in using a user defined in the OpenSearch Security plugin. After installation, log in as the `admin` user using the password that you set in `OPENSEARCH_INITIAL_ADMIN_PASSWORD` when you installed OpenSearch. The `admin` user does not have a default password, so `admin` as a password does not work. The `kibanaserver` user is the account that OpenSearch Dashboards uses to connect to OpenSearch and is not intended for logging in.

### The login page appears after you disable security in OpenSearch

If you disable the Security plugin in OpenSearch, also remove the Security plugin from OpenSearch Dashboards. Otherwise, OpenSearch Dashboards shows a login page, but no credentials work. For more information, see [Removing the Security plugin from OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/security/configuration/disable-enable-security/#removing-the-security-plugin-from-opensearch-dashboards).

### Error message: "OpenSearch Dashboards server is not ready yet"

This message means that OpenSearch Dashboards cannot connect to OpenSearch. To find the cause, follow these steps:

1. Make sure that OpenSearch is running by sending a request directly to OpenSearch:

   ```bash
   curl https://localhost:9200 -u admin:<custom-admin-password> --insecure
   ```
   {% include copy.html %}

   If this request fails, the problem is in OpenSearch, not in OpenSearch Dashboards. Check the OpenSearch log.

1. Make sure that `opensearch.hosts` in `opensearch_dashboards.yml` contains the address of OpenSearch.

1. Make sure that `opensearch.username` and `opensearch.password` in `opensearch_dashboards.yml` match the credentials of the `kibanaserver` user in OpenSearch. If you changed the `kibanaserver` password in `internal_users.yml`, set `opensearch.password` to the new password in plain text and restart OpenSearch Dashboards.

### Error message: "Client network socket disconnected before secure TLS connection was established"

OpenSearch Dashboards connects to OpenSearch using the protocol in `opensearch.hosts`. This error means that OpenSearch Dashboards tried to connect using HTTPS but OpenSearch did not complete a TLS handshake. If the Security plugin is disabled in OpenSearch, OpenSearch serves HTTP, so use `http://` in `opensearch.hosts`. If the Security plugin is enabled, use `https://`.
