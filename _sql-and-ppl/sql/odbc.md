---
layout: default
title: ODBC driver
parent: SQL
nav_order: 72
redirect_from:
  - /search-plugins/sql/odbc/
  - /search-plugins/sql/sql/odbc/
---

# ODBC driver

The Open Database Connectivity (ODBC) driver is a read-only driver for Windows, macOS, and Linux that lets you connect business intelligence (BI) and data visualization applications such as [Microsoft Excel](https://github.com/opensearch-project/sql-odbc/blob/main/docs/user/microsoft_excel_support.md) and [Microsoft Power BI](https://github.com/opensearch-project/sql-odbc/blob/main/bi-connectors/PowerBIConnector/README.md) to the SQL plugin.

For information about downloading and using the driver, see [the `sql-odbc` repository on GitHub](https://github.com/opensearch-project/sql-odbc).

## ODBC compatibility

The ODBC driver is compatible with ODBC version 3.51.

## Supported operating system versions

The following operating systems are supported.

Operating system | Version
:--- | :---
Windows | Windows 10, Windows 11
macOS | Mojave 10.14.6, Catalina 10.15.4, Big Sur 11.6.7, Monterey 12.4
Linux | x86_64 distributions that use unixODBC (build from source; tested on Ubuntu 24.04 using unixODBC 2.3.12)

## Terminology

Before configuring the ODBC driver, review the following terms:

- **Data Source Name (DSN)**: A named configuration that stores the driver connection information so that you do not need to specify it each time you connect.
- **`.tdc` file**: A file containing configuration information that Tableau applies to any connection matching the database vendor name and driver name defined in the file. Use it to fine-tune your ODBC data connection and enable or disable features not supported by the data source.

## Installing the ODBC driver

To install the driver, download the [bundled distribution installer](https://opensearch.org/downloads.html) or build it from source.

### Windows

To install the ODBC driver on Windows, follow these steps:

1. Open the downloaded `OpenSearch SQL ODBC Driver-<version>-Windows.msi` installer.

   The installer is unsigned and shows a security dialog. Select **More info**, then select **Run anyway**.

2. Select **Next** to proceed with the installation.

3. Accept the license agreement and select **Next**.

4. The installer includes documentation and resource files for connecting to various BI tools (for example, a `.tdc` file for Tableau). You can retain or remove these resources. Select **Next**.

5. Select **Install**, then select **Finish**.

The default DSN contains the following connection settings:

<!-- vale off -->
- **Host**: `localhost`
- **Port**: `9200`
- **Auth**: `NONE`
<!-- vale on -->

To customize the DSN, use ODBC Data Source Administrator, which is preinstalled on Windows 10 and Windows 11.

### macOS

Before installing the ODBC driver on macOS, install the iODBC Driver Manager.

To install the ODBC driver on macOS, follow these steps:

1. Open the downloaded `OpenSearch SQL ODBC Driver-<version>-Darwin.pkg` installer.

   The installer is unsigned and shows a security dialog. Select and hold (or right-click) the installer, then select **Open**.

2. Select **Continue** on each screen to proceed through the installation.

3. Select the **Destination** to install the driver files.

4. The installer includes documentation and resource files for connecting to various BI tools (for example, a `.tdc` file for Tableau). You can retain or remove these resources. Select **Continue**.

5. Select **Install**, then select **Close**.

The DSN is not configured as part of the installation. To configure it manually, run the following command to open iODBC Administrator. Running the application using `sudo` lets it save the driver and DSN configurations.

```bash
sudo /Applications/iODBC/iODBC\ Administrator64.app/Contents/MacOS/iODBC\ Administrator64
```
{% include copy.html %}

To configure the driver and DSN, follow these steps:

1. Select the **ODBC Drivers** tab.

2. Select **Add a Driver** and enter the following information:

   - **Description of the Driver**: Enter the driver name for the ODBC connection (for example, `OpenSearch SQL ODBC Driver`). To use the driver with the Tableau connector, the name must start with `OpenSearch SQL ODBC`.
   - **Driver File Name**: Enter the path to the driver file (default: `/Library/ODBC/opensearch-sql-odbc/bin/libsqlodbc.dylib`).
   - **Setup File Name**: Enter the path to the setup file (default: `/Library/ODBC/opensearch-sql-odbc/bin/libsqlodbc.dylib`).

3. Select **System** to register the driver as a system driver.

4. Select **OK** to save the driver.

5. Select the **User DSN** tab.

6. Select **Add**.

7. Select the driver that you added previously.

8. In the **Data Source Name (DSN)** field, enter a name for the data source (for example, `OpenSearch SQL ODBC DSN`).

9. In the **Comment** field, add an optional comment.

10. Add key-value pairs using the **+** button. We recommend the following settings for a default local OpenSearch installation.

    <!-- vale off -->

    Key | Value | Description
    :--- | :--- | :---
    `Host` | `localhost` | The OpenSearch server endpoint.
    `Port` | `9200` | The server port.
    `Auth` | `NONE` | The authentication mode.
    `Username` | Leave blank. | The username used for Basic authentication.
    `Password` | Leave blank. | The password used for Basic authentication.
    `ResponseTimeout` | `10` | The number of seconds to wait for a response from the server.
    `UseSSL` | `0` | Whether to use SSL for the connection (`0` = disabled, `1` = enabled).

    <!-- vale on -->

11. Select **OK** to save the DSN configuration.

12. Select **OK** to exit iODBC Administrator.

### Linux

The driver is not distributed as a Linux package. Linux support requires driver version 1.7.0.0 or later, which you build from source and register in the unixODBC driver manager.

To install the ODBC driver on Linux, follow these steps:

1. Install unixODBC, CMake, a C++ toolchain, and [`vcpkg`](https://vcpkg.io/).

2. Clone the driver repository and build the driver:

   ```bash
   git clone https://github.com/opensearch-project/sql-odbc.git
   cd sql-odbc
   ./build_linux_release64.sh
   ```
   {% include copy.html %}

   The compiled driver library is saved to `build/odbc/lib/libsqlodbc.so`.

3. To find the location of `odbcinst.ini`, run `odbcinst -j`. Add the following entry to the file:

   ```ini
   [OpenSearch SQL ODBC Driver]
   Description=OpenSearch SQL ODBC driver
   Driver=<path-to-sql-odbc>/build/odbc/lib/libsqlodbc.so
   ```
   {% include copy.html %}

4. Define a data source in `~/.odbc.ini`. We recommend the following settings for a default local OpenSearch installation:

   ```ini
   [opensearch]
   Driver=OpenSearch SQL ODBC Driver
   Host=localhost
   Port=9200
   Auth=NONE
   UseSSL=0
   ResponseTimeout=10
   ```
   {% include copy.html %}

5. Verify the connection using `iusql`, the Unicode version of the `isql` tool included in the unixODBC package:

   ```bash
   echo "SELECT 1 AS one" | iusql -v opensearch -b
   ```
   {% include copy.html %}

## Configuring the ODBC driver

The driver is a library file: `sqlodbc.dll` for Windows, `libsqlodbc.dylib` for macOS, and `libsqlodbc.so` for Linux.

If you're using ODBC-compatible BI tools, see your BI tool documentation for configuring a new ODBC driver. In the BI tool, specify the location of the driver library file, and then configure the connection to OpenSearch.

### Connection options

ODBC connection strings are semicolon-delimited key-value pairs that specify connection options. A connection string contains one of the following components:

- A DSN containing a preconfigured set of options (`DSN=<dsn-name>;User=<username>;Password=<password>;`).
- Explicit options configured as key-value pairs (`Host=<host>;Port=<port>;LogLevel=5;...`).

You can configure the following driver options using a DSN or connection string.

All option names are case-insensitive.
{: .note }

#### Basic options

The following table lists the core connection options.

Option | Description | Type | Default
:--- | :--- | :--- | :---
`DSN` | The data source name for the connection. | `string` | -
`Host / Server` | The hostname or IP address of the target cluster. | `string` | -
`Port` | The port for the OpenSearch cluster's REST interface. | `string` | -

#### Authentication options

The following table lists the authentication options.

<!-- vale off -->

Option | Description | Type | Default
:--- | :--- | :--- | :---
`Auth` | The authentication mechanism. Valid values are `BASIC` (HTTP Basic authentication), `AWS_SIGV4` (AWS Signature Version 4), and `NONE`. | `string` | `NONE`
`User / UID` | The username for the connection. Used when `Auth` is `BASIC`. | `string` | -
`Password / PWD` | The password for the connection. Used when `Auth` is `BASIC`. | `string` | -
`Region` | The AWS Region used for signing requests (for example, `us-west-1`). Used when `Auth` is `AWS_SIGV4`. | `string` | -
`TunnelHost` | The domain endpoint hostname used to sign requests when you connect through an SSH tunnel or proxy. Set `Host` to the local tunnel address and `TunnelHost` to the domain endpoint. Used when `Auth` is `AWS_SIGV4`. | `string` | -

<!-- vale on -->

To use `AWS_SIGV4` authentication, add an `opensearchodbc` profile to your `~/.aws/credentials` file. The profile must contain your AWS access key ID and secret access key, and a session token if you use temporary credentials.

#### Advanced options

The following table lists the advanced connection options.

Option | Description | Type | Default
:--- | :--- | :--- | :---
`UseSSL` | Whether to establish the connection over SSL/TLS. | Boolean (`0` or `1`) | `0`
`HostnameVerification` | Whether to verify the certificate hostname for an SSL/TLS connection. | Boolean (`0` or `1`) | `1`
`ResponseTimeout` | The maximum amount of time to wait for a response from the host, in seconds. | `integer` | `10`
`FetchSize` | The number of rows to retrieve per page using cursor-based pagination. Valid values are `-1`, `0`, or an integer from 1 to 10,000. | `integer` | `-1`

If `FetchSize` is `-1` or `0`, the driver does not paginate results, so each query returns at most the number of rows set in `plugins.query.size_limit` (default 10,000), without an error or warning. To retrieve larger results, set `FetchSize` to a positive value, such as `1000`. The driver then retrieves the entire result page by page. Values greater than the index's `index.max_result_window` setting (default 10,000) return an error. For more information, see [SQL settings]({{site.url}}{{site.baseurl}}/sql-and-ppl/settings/) and [Paginating results]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql-and-ppl-api/#paginating-results).

#### Logging options

The following table lists the logging options.

Option | Description | Type | Default
:--- | :--- | :--- | :---
`LogLevel` | The severity level for driver logs. Valid values are `0` (off), `1` (fatal), `2` (error), `3` (warning), `4` (info), `5` (debug), `6` (trace), and `7` (all). | `integer` | `3`
`LogOutput` | The directory in which driver logs are stored. | `string` | `C:\` (Windows) or `/tmp` (macOS and Linux)

The driver reads the log directory from its driver-level configuration when it loads, so a `LogOutput` value in a DSN or connection string does not change where logs are written. On Windows, set the log directory in the DSN setup dialog in ODBC Data Source Administrator, which saves it to the driver-level configuration. On macOS and Linux, logs are written to `/tmp`.

On Windows, you need administrative privileges to change the logging options.
{: .note }

## Connecting to Tableau

Before connecting to Tableau, ensure that the following prerequisites are met:

- The DSN is configured.
- OpenSearch is running on the host and port configured in the DSN.
- The `.tdc` file is copied to `<user_home_directory>/Documents/My Tableau Repository/Datasources` on both macOS and Windows.

To connect to Tableau, follow these steps:

1. Start Tableau. In the **Connect** section, select **To a Server**, then select **Other Databases (ODBC)**.

2. In the **DSN** dropdown list, select the OpenSearch DSN that you configured when you installed the driver. **Connection Attributes** is automatically populated using the options you added.

3. Select **Sign In**. After Tableau connects to OpenSearch, the **Data Source** window opens, and the **Database** field contains the cluster name. To list all indexes, select the search icon in **Table**.

4. Drag the table to the connection area. Select **Update Now** or **Automatically Update** to load the data.

<!-- vale off -->
For more information, see [Connecting OpenSearch to Tableau Desktop via the Tableau Connector](https://github.com/opensearch-project/sql/blob/1.x/sql-odbc/docs/user/tableau_support.md).
<!-- vale on -->

### Troubleshooting

If Tableau cannot connect to OpenSearch, confirm that OpenSearch is running on the host and port configured in the DSN. Also confirm that the `.tdc` file prerequisite is met.

## Connecting to Microsoft Power BI

For information about connecting to Power BI, see [Installation instructions](https://github.com/opensearch-project/sql-odbc/tree/main/bi-connectors/PowerBIConnector/README.md) and [Configuration instructions](https://github.com/opensearch-project/sql-odbc/blob/main/bi-connectors/PowerBIConnector/power_bi_support.md) in the `sql-odbc` repository.
