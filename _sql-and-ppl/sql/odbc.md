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

The Open Database Connectivity (ODBC) driver is a read-only ODBC driver for Windows, macOS, and Linux that lets you connect business intelligence (BI) and data visualization applications like [Microsoft Excel](https://github.com/opensearch-project/sql-odbc/blob/main/docs/user/microsoft_excel_support.md) and [Power BI](https://github.com/opensearch-project/sql-odbc/blob/main/bi-connectors/PowerBIConnector/README.md) to the SQL plugin.

For information about downloading and using the driver, see [the SQL repository on GitHub](https://github.com/opensearch-project/sql-odbc).

## Specifications

The ODBC driver is compatible with ODBC version 3.51.

## Supported operating system versions

The following operating systems are supported.

Operating system | Version
:--- | :---
Windows | Windows 10, Windows 11
macOS | Catalina 10.15.4, Mojave 10.14.6, Big Sur 11.6.7, Monterey 12.4
Linux | x86_64 distributions with unixODBC, built from source (tested on Ubuntu 24.04 with unixODBC 2.3.12)


## Concepts

Before configuring the ODBC driver, review the following terms:

- **DSN (Data Source Name)**: Stores driver information in the system so that the connection information does not need to be specified each time the driver connects.
- **`.tdc` file**: Contains configuration information that Tableau applies to any connection matching the database vendor name and driver name defined in the file. Use it to fine-tune your ODBC data connection and enable or disable features not supported by the data source.


## Installing the ODBC driver

To install the driver, download the [bundled distribution installer](https://opensearch.org/downloads.html) or build it from source.

### Windows

To install the ODBC driver on Windows, follow these steps:

1. Open the downloaded `OpenSearch SQL ODBC Driver-<version>-Windows.msi` installer.

   The installer is unsigned and shows a security dialog. Select **More info**, then select **Run anyway**.

2. Select **Next** to proceed with the installation.

3. Accept the agreement, and select **Next**.

4. The installer includes documentation and resource files for connecting to various BI tools (for example, a `.tdc` file for Tableau). You can retain or remove these resources. Select **Next**.

5. Select **Install** and **Finish**.

The following connection information is configured as part of the default DSN:

```
Host: localhost
Port: 9200
Auth: NONE
```
{% include copy.html %}


To customize the DSN, use **ODBC Data Source Administrator**, which is preinstalled on Windows 10 and Windows 11.

### macOS

Before installing the ODBC driver on macOS, install the iODBC Driver Manager.

To install the ODBC driver on macOS, follow these steps:

1. Open the downloaded `OpenSearch SQL ODBC Driver-<version>-Darwin.pkg` installer.

   The installer is unsigned and shows a security dialog. Right-click on the installer and select **Open**.

2. Select **Continue** on each screen to proceed through the installation.

3. Select the **Destination** to install the driver files.

4. The installer includes documentation and resource files for connecting to various BI tools (for example, a `.tdc` file for Tableau). You can retain or remove these resources. Select **Continue**.

5. Select **Install** and **Close**.

The DSN is not configured as part of the installation. To configure it manually, run the following command to open `iODBC Administrator`. This command grants the application permissions to save the driver and DSN configurations.

```bash
sudo /Applications/iODBC/iODBC\ Administrator64.app/Contents/MacOS/iODBC\ Administrator64
```
{% include copy.html %}

To configure the driver and DSN, follow these steps:

1. Select the **ODBC Drivers** tab.
2. Select **Add a Driver** and fill in the following details:
   - **Description of the Driver**: Enter the driver name for the ODBC connection (for example, OpenSearch SQL ODBC Driver).
   - **Driver File Name**: Enter the path to the driver file (default: `<driver-install-dir>/bin/libopensearchsqlodbc.dylib`).
   - **Setup File Name**: Enter the path to the setup file (default: `<driver-install-dir>/bin/libopensearchsqlodbc.dylib`).

3. Select the user driver.
4. Select **OK** to save the options.
5. Select the **User DSN** tab.
6. Select **Add**.
7. Select the driver that you added previously.
8. In the **Data Source Name (DSN)** field, enter a name for the data source (for example, OpenSearch SQL ODBC DSN).
9. In the **Comment** field, add an optional comment.
10. Add key-value pairs using the `+` button. We recommend the following options for a default local OpenSearch installation:
<!-- vale off -->

   - **Host**: `localhost` -- The OpenSearch server endpoint
   - **Port**: `9200` -- The server port
   - **Auth**: `NONE` -- The authentication mode
   - **Username**: `(blank)` -- The username used for Basic authentication
   - **Password**: `(blank)` -- The password used for Basic authentication
   - **ResponseTimeout**: `10` -- The number of seconds to wait for a response from the server
   - **UseSSL**: `0` -- Disables SSL for the connection (`0` = disabled, `1` = enabled)

<!-- vale on -->

11. Select **OK** to save the DSN configuration.
12. Select **OK** to exit the iODBC Administrator.

### Linux

The driver is not distributed as a Linux package. Starting with driver version 1.7.0.0, you can build it from source and register it with the unixODBC driver manager.

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

4. Define a data source in `~/.odbc.ini`. We recommend the following options for a default local OpenSearch installation:

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


## Customizing the ODBC driver

The driver is a library file: `opensearchsqlodbc.dll` for Windows, `libopensearchsqlodbc.dylib` for macOS, and `libsqlodbc.so` for Linux.

If you're using ODBC-compatible BI tools, refer to your BI tool documentation for configuring a new ODBC driver. Point the BI tool to the driver library file location, then use it to configure the OpenSearch database connection.


### Connection strings and other settings

ODBC connection strings are semicolon-delimited key-value pairs that specify connection options.
A connection string contains one of the following components:
  - A Data Source Name (DSN) with a preconfigured set of options (`DSN=xxx;User=xxx;Password=xxx;`).
  - Explicit options configured as key-value pairs (`Host=xxx;Port=xxx;LogLevel=ES_DEBUG;...`).

You can configure the following driver options using a DSN or connection string:

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
`Auth` | Authentication mechanism to use. | `BASIC` (HTTP Basic authentication), `AWS_SIGV4` (AWS Signature Version 4), or `NONE` | `NONE`
`User / UID` | [`Auth=BASIC`] Username for the connection. | `string` | -
`Password / PWD` | [`Auth=BASIC`] Password for the connection. | `string` | -
`Region` | [`Auth=AWS_SIGV4`] Region used for signing requests. | `AWS region (for example, us-west-1)` | -

<!-- vale on -->

#### Advanced options

The following table lists the advanced connection options.

Option | Description | Type | Default
:--- | :---
`UseSSL` | Whether to establish the connection over SSL/TLS. | `boolean (0 or 1)` | `false (0)`
`HostnameVerification` | Whether to verify the certificate hostname for an SSL/TLS connection. | `boolean` (0 or 1) | `true (1)`
`ResponseTimeout` | The maximum time to wait for responses from the host, in seconds. | `integer` | `10`

#### Logging options

The following table lists the logging options.

Option | Description | Type | Default
:--- | :--- | :--- | :---
`LogLevel` | Severity level for driver logs. | `LOG_OFF`, `LOG_FATAL`, `LOG_ERROR`, `LOG_INFO`, `LOG_DEBUG`, `LOG_TRACE`, or `LOG_ALL` | `LOG_WARNING`
`LogOutput` | Location for storing driver logs. | `string` | `WIN: C:\`, `MAC: /tmp`

You need administrative privileges to change the logging options.
{: .note }

## Connecting to Tableau

Before connecting to Tableau, ensure that the following prerequisites are met:

- The DSN is already configured.
- OpenSearch is running on _host_ and _port_ as configured in the DSN.
- The `.tdc` file is copied to `<user_home_directory>/Documents/My Tableau Repository/Datasources` in both macOS and Windows.

To connect to Tableau, follow these steps:

1. Start Tableau. Under the **Connect** section, select **To a Server**, then select **Other Databases (ODBC)**.

2. In the **DSN** dropdown list, select the OpenSearch DSN you configured in the previous steps. The options you added are automatically filled in under **Connection Attributes**.

3. Select **Sign In**. After a few seconds, Tableau connects to your OpenSearch server. Once connected, you are directed to the **Data Source** window. The **Database** is already populated with the name of the OpenSearch cluster. To list all the indexes, select the search icon under **Table**.

4. Drag the table to the connection area. Select **Update Now** or **Automatically Update** to load the data.

For more information, see [Tableau support documentation](https://github.com/opensearch-project/sql/blob/1.x/sql-odbc/docs/user/tableau_support.md) in the GitHub repository.

### Troubleshooting

**Problem**

Unable to connect to server.

**Mitigation**

This is most likely because OpenSearch is not running on the **host** and **port** configured in the DSN.
Confirm that **host** and **port** are correct and that OpenSearch is running with the OpenSearch SQL plugin.
Also ensure that the `.tdc` file that was downloaded with the installer is copied to `<user_home_directory>/Documents/My Tableau Repository/Datasources`.

## Connecting to Microsoft Power BI

Follow the [installation instructions](https://github.com/opensearch-project/sql-odbc/tree/main/bi-connectors/PowerBIConnector/README.md) and the [configuration instructions](https://github.com/opensearch-project/sql-odbc/blob/main/bi-connectors/PowerBIConnector/power_bi_support.md) published in the GitHub repository.
