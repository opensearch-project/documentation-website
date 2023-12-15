---
layout: default
title: Reporting CLI options
nav_order: 30
parent: Reporting using the CLI
grand_parent: Reporting
redirect_from:
  - /dashboards/reporting-cli/rep-cli-options/
---

# Reporting CLI options

You can use any of the following arguments with the `opensearch-reporting-cli` tool.

| Argument      | Description       | Acceptable values and usage | Environment variable
:--------------------- | :--- | :--- |
`-u`, `--url` | The URL for the visualization. | Obtain from OpenSearch Dashboards > Visualize > Share > Permalinks > Copy link. | OPENSEARCH_URL
`-a`, `--auth` | The authentication type for the report. | You can specify either Basic `basic`, Cognito `cognito`, SAML `saml`, or No Auth `none`. If no value is specified, the Reporting CLI tool defaults to no authentication, type `none`. Basic, Cognito, and SAML require credentials with the `-c` flag. | N/A
`-c`, `--credentials` | The OpenSearch login credentials. | Enter your username and password separated by a colon. For example, username:password. Required for Basic, Cognito, and SAML authentication types. | OPENSEARCH_USERNAME and OPENSEARCH_PASSWORD
`-t`, `--tenant` | The tenants in OpenSearch Dashboards. | The default tenant is private.| N/A
`-f`, `--format` | The file format for the report. | Can be either `pdf`, `png`, or `csv`. The default is `pdf`.| N/A
`-w`, `--width` | The window width in pixels for the report. | Default is `1680`.| N/A
`-l`, `--height` | The minimum window height in pixels for the report. | Default is `600`. | N/A
`-n`, `--filename` | The file name of the report. | Default is `reporting`. | opensearch-report-YYY-MM-DDTHH-mm-ss.sssZ
`-e`, `--transport` | The transport mechanism for sending the email. | For Amazon SES, specify `ses`. Amazon SES requires an AWS configuration on your system to store the credentials. For SMTP, use `smtp` and also specify the login credentials with `--smtpusername` and `--smtppassword`. | OPENSEARCH_TRANSPORT
`-s`, `--from` | The email address of the sender. | For example, `user@amazon.com`. | OPENSEARCH_FROM
`-r`, `--to` | The email address of the recipient. | For example, `user@amazon.com`. | OPENSEARCH_TO
`--smtphost` | The hostname of the SMTP server. | For example, `SMTP_HOST`. | OPENSEARCH_SMTP_HOST
`--smtpport` | The port for the SMTP connection. | For example, `SMTP_PORT`. | OPENSEARCH_SMTP_PORT
`--smtpsecure` | Specifies to use TLS when connecting to the server. | For example, `SMTP_SECURE`. | OPENSEARCH_SMTP_SECURE
`--smtpusername` | The SMTP username.| For example, `SMTP_USERNAME`. | OPENSEARCH_SMTP_USERNAME
`--smtppassword` | The SMTP password.| For example, `SMTP_PASSWORD`. | OPENSEARCH_SMTP_PASSWORD
`--subject` | The email subject text encased in quotes. | Can be any string. The default is "This is an email containing your dashboard report". | OPENSEARCH_EMAIL_SUBJECT
`--note` | The email body, either a string or a path to a text file. | The default note is "Hi,\\nHere is the latest report!" | OPENSEARCH_EMAIL_NOTE
`-h`, `--help` | Specifies to display the list of optional arguments from the command line. | N/A

## Getting help

To get a list of all available CLI arguments, run the following command:

``` 
$ opensearch-reporting-cli -h
```