---
layout: default
title: Use environment variables with the Reporting CLI
nav_order: 35
parent: Reporting using the CLI
grand_parent: Reporting
redirect_from:
  - /reporting/rep-cli-env-var/
  - /dashboards/reporting-cli/rep-cli-env-var/
---

# Use environment variables with the Reporting CLI

Instead of providing values on the command line, you can set them as environment variables. For a list of the options that have a corresponding environment variable, see [Reporting CLI options]({{site.url}}{{site.baseurl}}/dashboards/reporting/rep-cli-options/).

Set environment variables in either of the following ways:

- Export them in your shell, for example, `export OPENSEARCH_FROM=reports@example.com`.
- Save them in a file named `.env` in the directory from which you run the Reporting CLI. The Reporting CLI reads the `.env` file only from the current directory.

In a `.env` file, use the `NAME=VALUE` format, one variable per line. Lines that start with `#` are comments. To include characters such as `#`, `'`, or `!` in a value, enclose the value in double quotation marks. The quotation marks are not included in the value.

When the same value is set in more than one place, the Reporting CLI uses the following order of precedence:

1. Command line options
1. Environment variables exported in the shell
1. Variables in the `.env` file

For example, if the `.env` file sets `OPENSEARCH_FILENAME=test` and you run the command with the `--filename report` option, the report is saved as `report.pdf`.

## Example: Requesting a report using a .env file

The following `.env` file specifies the URL, the report file name, and the credentials:

```
OPENSEARCH_URL="<dashboards-url>"
OPENSEARCH_FILENAME=daily-traffic
OPENSEARCH_USERNAME=<username>
OPENSEARCH_PASSWORD=<password>
```

To request a PNG report using the values in the `.env` file, run the following command from the directory that contains the file:

```bash
opensearch-reporting-cli --format png --auth basic
```
{% include copy.html %}

The report is saved to the current directory as `daily-traffic.png`.

## Sending a report by email using SMTP

To send a report by email using SMTP, set the following variables in your `.env` file:

```
OPENSEARCH_TRANSPORT=smtp
OPENSEARCH_SMTP_HOST=<smtp-host>
OPENSEARCH_SMTP_PORT=<smtp-port>
OPENSEARCH_SMTP_SECURE=true
OPENSEARCH_SMTP_USERNAME=<smtp-username>
OPENSEARCH_SMTP_PASSWORD=<smtp-password>
OPENSEARCH_FROM=<sender-email>
OPENSEARCH_TO=<recipient-email>
```

Then run the following command:

```bash
opensearch-reporting-cli --url '<dashboards-url>'
```
{% include copy.html %}

If your SMTP server does not require authentication, omit `OPENSEARCH_SMTP_USERNAME` and `OPENSEARCH_SMTP_PASSWORD`.

## Using Amazon SES to request an email with a report attachment

To use Amazon SES as the email transport, the following prerequisites apply:

- The sender's email address must be verified by [Amazon SES](https://aws.amazon.com/ses/).
- The Reporting CLI reads AWS credentials and the AWS Region from your AWS configuration. To configure them using the [AWS Command Line Interface (AWS CLI)](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html), see [Quick configuration with `aws configure`](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config) in the AWS Command Line Interface user guide.
- The AWS credentials must grant the `ses:SendRawEmail` permission:

  ```json
  {
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "ses:SendRawEmail",
        "Resource": "*"
      }
    ]
  }
  ```

The following command requests an email with the report attached:

```bash
opensearch-reporting-cli --url '<dashboards-url>' --transport ses --from <sender-email> --to <recipient-email>
```
{% include copy.html %}

Alternatively, set `OPENSEARCH_TRANSPORT`, `OPENSEARCH_FROM`, and `OPENSEARCH_TO` in your `.env` file and provide only the URL:

```bash
opensearch-reporting-cli --url '<dashboards-url>'
```
{% include copy.html %}

## Customizing the email

To change the email subject and body, use the `--subject` and `--note` options or the `OPENSEARCH_EMAIL_SUBJECT` and `OPENSEARCH_EMAIL_NOTE` variables. To change the email layout, edit the `src/views/index.hbs` template in the Reporting CLI installation directory.

## Troubleshooting

To resolve **MessageRejected: Email address is not verified**, see [Why am I getting a 400 "message rejected" error with the message "Email address is not verified" from Amazon SES?](https://repost.aws/knowledge-center/ses-554-400-message-rejected-error) in the AWS Knowledge Center.
