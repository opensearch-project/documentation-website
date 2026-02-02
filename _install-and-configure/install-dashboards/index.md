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

OpenSearch Dashboards provides a fully integrated solution for visually exploring, discovering, and querying your observability data. You can install OpenSearch Dashboards with any of the following options:

- [Docker]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/docker/)
- [Tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tar/)
- [RPM]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/rpm/)
- [Debian]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/debian/)
- [Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/helm/)
- [Windows]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/windows/)

## Browser compatibility

OpenSearch Dashboards supports the following web browsers:

- Chrome
- Firefox
- Safari
- Edge (Chromium)

Other Chromium-based browsers might work, as well. Internet Explorer and Microsoft Edge Legacy are **not** supported.

## Node.js compatibility

OpenSearch Dashboards requires the Node.js runtime binary to run. One is included in the distribution packages available from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

OpenSearch Dashboards versions 2.8 through 2.19 support Node.js 14, 16, and 18. Distribution packages for versions 2.10 through 2.19 include Node.js 18 and Node.js 14 (for backward compatibility).

OpenSearch Dashboards >=3.0 <=3.4 include Node.js 20, while OpenSearch Dashboards >=3.5 include Node.js 22.

To use a Node.js runtime binary other than the ones included in the distribution packages, follow these steps:

1. Download and install [Node.js](https://nodejs.org/en/download){:target='\_blank'}; the compatible versions are `>=14.20.1 <23`.
2. Set the installation path to the `NODE_HOME` or `NODE_OSD_HOME` environment variables.
   
    - On UNIX, if Node.js is installed to `/usr/local/nodejs` and the runtime binary is `/usr/local/nodejs/bin/node`:
    ```bash
    export NODE_HOME=/usr/local/nodejs
   ```

    - If Node.js is installed using NVM and the runtime binary is `/Users/user/.nvm/versions/node/v22.22.0/bin/node`:
   ```bash
   export NODE_HOME=/Users/user/.nvm/versions/node/v22.22.0
   # or, if NODE_HOME is used for something else:
   export NODE_OSD_HOME=/Users/user/.nvm/versions/node/v22.22.0
   ```

    - On Windows, if Node.js is installed to `C:\Program Files\nodejs` and the runtime binary is `C:\Program Files\nodejs\node.exe`:
   ```powershell
   set "NODE_HOME=C:\Program Files\nodejs"
   # or using PowerShell:
   $Env:NODE_HOME = 'C:\Program Files\nodejs'
   ```

   Consult your operating system's documentation to make a persistent change to the environment variables.

The OpenSearch Dashboards start script,`bin/opensearch-dashboards`, searches for the Node.js runtime binary using `NODE_OSD_HOME`,
and then `NODE_HOME`, before using the binaries included with the distribution packages. If a usable Node.js runtime binary is not found, the start script will attempt to find one in the system-wide `PATH` before failing.

## Configuration

To learn how to configure TLS for OpenSearch Dashboards, see [Configure TLS]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tls/).
