---
layout: default
title: Reporting CLI options
nav_order: 30
parent: Reporting using the CLI
grand_parent: Reporting
redirect_from:
  - /reporting/rep-cli-options/
  - /dashboards/reporting-cli/rep-cli-options/
---

# Reporting CLI options

The `opensearch-reporting-cli` tool supports the following options. Option values are case sensitive and must be lowercase. Options provided on the command line take precedence over environment variables. For more information, see [Use environment variables with the Reporting CLI]({{site.url}}{{site.baseurl}}/dashboards/reporting/rep-cli-env-var/).

| Option | Description | Environment variable |
| :--- | :--- | :--- |
| `-u`, `--url` | The OpenSearch Dashboards URL of the dashboard, visualization, notebook, or saved search. To get the URL, select **Share** > **Permalinks** > **Copy link**. Required. | `OPENSEARCH_URL` |
| `-a`, `--auth` | The authentication type. Valid values are `basic`, `cognito`, and `saml`. Requires credentials. To connect without authentication, omit this option. | N/A |
| `-c`, `--credentials` | The OpenSearch Dashboards login credentials in the `<username>:<password>` format. | `OPENSEARCH_USERNAME` and `OPENSEARCH_PASSWORD` |
| `-t`, `--tenant` | The tenant to select after login when multi-tenancy is enabled. Valid values are `private`, `global`, or the name of a custom tenant. A tenant specified in the URL takes precedence over this option. Default is `private`. | N/A |
| `--multitenancy` | Whether to select a tenant after login. Valid values are `true` and `false`. Default is `true`. | N/A |
| `-f`, `--format` | The file format of the report. Valid values are `pdf`, `png`, and `csv`. The `csv` format is supported only for saved searches. Default is `pdf`. | N/A |
| `-w`, `--width` | The browser window width, in pixels. Default is `1680`. | N/A |
| `-l`, `--height` | The minimum browser window height, in pixels. Default is `600`. | N/A |
| `-n`, `--filename` | The file name of the report, without the extension. Default is `opensearch-report-<timestamp>`. | `OPENSEARCH_FILENAME` |
| `-e`, `--transport` | The email transport. Valid values are `ses` (Amazon SES) and `smtp`. If not specified, the report is not sent by email. | `OPENSEARCH_TRANSPORT` |
| `-s`, `--from` | The sender email address. | `OPENSEARCH_FROM` |
| `-r`, `--to` | The recipient email address. To specify multiple recipients, separate the addresses with commas. | `OPENSEARCH_TO` |
| `--smtphost` | The host name of the SMTP server. | `OPENSEARCH_SMTP_HOST` |
| `--smtpport` | The port of the SMTP server. | `OPENSEARCH_SMTP_PORT` |
| `--smtpsecure` | Specify `true` to use TLS when connecting to the SMTP server. Any value enables TLS, including `false`, so to connect without TLS, omit this option. | `OPENSEARCH_SMTP_SECURE` |
| `--smtpusername` | The SMTP username. | `OPENSEARCH_SMTP_USERNAME` |
| `--smtppassword` | The SMTP password. | `OPENSEARCH_SMTP_PASSWORD` |
| `--selfsignedcerts` | Whether to accept a self-signed certificate from the SMTP server. Valid values are `true` and `false`. Default is `false`. | N/A |
| `--subject` | The email subject. Default is `This is an email containing your opensearch dashboard report`. | `OPENSEARCH_EMAIL_SUBJECT` |
| `--note` | The email body, either a string or the path to a text file. Default is `Hi,\nHere is the latest report!`. | `OPENSEARCH_EMAIL_NOTE` |
| `--timeout` | The maximum amount of time to wait for the page to load, in milliseconds. Default is `300000` (5 minutes). | `OPENSEARCH_TIMEOUT` |
| `-h`, `--help` | Displays the list of options. | N/A |

## Getting help

To get a list of all available options, run the following command:

```bash
opensearch-reporting-cli -h
```
{% include copy.html %}
