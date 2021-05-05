---
layout: default
title: OpenSearch Dashboards
nav_order: 11
has_children: true
has_toc: false
---

# OpenSearch Dashboards

OpenSearch Dashboards is the default visualization tool for data in OpenSearch. It also serves as a user interface for the OpenSearch [security](../security/configuration/), [alerting](../alerting/), and [Index State Management](../ism/) plugins.


## Run OpenSearch Dashboards using Docker

You *can* start OpenSearch Dashboards using `docker run` after [creating a Docker network](https://docs.docker.com/engine/reference/commandline/network_create/) and starting OpenSearch, but the process of connecting OpenSearch Dashboards to OpenSearch is significantly easier with a Docker Compose file.

1. Run `docker pull opensearch/opensearch-dashboards:{{site.opensearch_version}}`.

1. Create a [`docker-compose.yml`](https://docs.docker.com/compose/compose-file/) file appropriate for your environment. A sample file that includes OpenSearch Dashboards is available on the OpenSearch [Docker installation page](../install/docker/#sample-docker-compose-file).

   Just like `opensearch.yml`, you can pass a custom `opensearch_dashboards.yml` to the container in the Docker Compose file.
   {: .tip }

1. Run `docker-compose up`.

   Wait for the containers to start. Then see [Get started with OpenSearch Dashboards](#get-started-with-opensearch-dashboards).

1. When finished, run `docker-compose down`.


## Run OpenSearch Dashboards using the RPM or Debian package

1. If you haven't already, add the `yum` repositories specified in steps 1--2 in [RPM](../install/rpm) or the `apt` repositories in steps 2--3 of [Debian package](../install/deb).
1. `sudo yum install opensearch-dashboards` or `sudo apt install opensearch-dashboards`
1. Modify `/etc/opensearch-dashboards/opensearch_dashboards.yml` to use `opensearch.hosts` rather than `opensearch.url`.
1. `sudo systemctl start opensearch-dashboards.service`
1. To stop OpenSearch Dashboards:

   ```bash
   sudo systemctl stop opensearch-dashboards.service
   ```


### Configuration

To run OpenSearch Dashboards when the system starts:

```bash
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable opensearch-dashboards.service
```

You can also modify the values in `/etc/opensearch-dashboards/opensearch_dashboards.yml`.


## Run OpenSearch Dashboards using the tarball

1. Download the tarball:

   ```bash
   # x64
   curl https://d3g5vo6xdbdb9a.cloudfront.net/tarball/opensearch-dashboards/opensearch-dashboards-{{site.opensearch_version}}-linux-x64.tar.gz -o opensearch-dashboards-{{site.opensearch_version}}-linux-x64.tar.gz
   # ARM64
   curl https://d3g5vo6xdbdb9a.cloudfront.net/tarball/opensearch-dashboards/opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.tar.gz -o opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.tar.gz
   ```

1. Download the checksum:

   ```bash
   # x64
   curl https://d3g5vo6xdbdb9a.cloudfront.net/tarball/opensearch-dashboards/opensearch-dashboards-{{site.opensearch_version}}-linux-x64.tar.gz.sha512 -o opensearch-dashboards-{{site.opensearch_version}}-linux-x64.tar.gz.sha512
   # ARM64
   curl https://d3g5vo6xdbdb9a.cloudfront.net/tarball/opensearch-dashboards/opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.tar.gz.sha512 -o opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.tar.gz.sha512
   ```

1. Verify the tarball against the checksum:

   ```bash
   # x64
   shasum -a 512 -c opensearch-dashboards-{{site.opensearch_version}}-linux-x64.tar.gz.sha512
   # ARM64
   shasum -a 512 -c opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.tar.gz.sha512
   ```

   On CentOS, you might not have `shasum`. Install this package:

   ```bash
   sudo yum install perl-Digest-SHA
   ```

1. Extract the TAR file to a directory and change to that directory:

   ```bash
   # x64
   tar -zxf opensearch-dashboards-{{site.opensearch_version}}-linux-x64.tar.gz
   cd opensearch-dashboards
   # ARM64
   tar -zxf opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.tar.gz
   cd opensearch-dashboards
   ```

1. If desired, modify `config/opensearch_dashboards.yml`.

1. Run OpenSearch Dashboards:

   ```bash
   ./bin/opensearch-dashboards
   ```


## Run OpenSearch Dashboards on Windows (ZIP)

1. Download the ZIP.

1. Extract [the ZIP file](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-windows/ode-windows-zip/opensearch-dashboards-{{site.opensearch_version}}-windows-x64.zip) to a directory and open that directory at the command prompt.

1. If desired, modify `config/opensearch_dashboards.yml`.

1. Run OpenSearch Dashboards:

   ```
   .\bin\opensearch-dashboards.bat
   ```


## Run OpenSearch Dashboards on Windows (EXE)

1. Download [the EXE file](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-windows/opensearch-executables/opensearch-dashboards-{{site.opensearch_version}}-windows-x64.exe), run it, and click through the steps.

1. Open the command prompt.

1. Navigate to the OpenSearch Dashboards install directory.

1. If desired, modify `config/opensearch_dashboards.yml`.

1. Run OpenSearch Dashboards:

   ```
   .\bin\opensearch-dashboards.bat
   ```


## Get started with OpenSearch Dashboards

1. After starting OpenSearch Dashboards, you can access it at port 5601. For example, http://localhost:5601.
1. Log in with the default username `admin` and password `admin`.
1. Choose **Try our sample data** and add the sample flight data.
1. Choose **Discover** and search for a few flights.
1. Choose **Dashboard**, **[Flights] Global Flight Dashboard**, and wait for the dashboard to load.
