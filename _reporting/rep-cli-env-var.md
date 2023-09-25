---
layout: default
title: Use environment variables with the Reporting CLI
nav_order: 35
parent: Reporting using the CLI
grand_parent: Reporting
redirect_from:
  - /dashboards/reporting-cli/rep-cli-env-var/
---

# Use environment variables with the Reporting CLI

Instead of explicitly providing values in the command line, you can save them as environment variables. The Reporting CLI reads environment variables from the current directory inside the project.

To set the environment variables in Linux, use the following command:

```
export NAME=VALUE
```

Each line should use the format `NAME=VALUE`.
Each line that starts with a hashtag (#) is considered to be a comment.
Quotation marks (") don't get any special handling.

Values from the command line argument have higher priority than the environment file. For example, if you add the file name as *test* in the *.env* file and also add the `--filename report` command option, the generated report's name will be *report*.
{: .note }

#### Example: Requesting a PNG report with environment variables set

The following command requests a report with basic authentication in PNG format:

```
opensearch-reporting-cli --url https://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d --format png --auth basic --credentials admin:admin
```

Upon success, the report will download to the current directory.

## Using Amazon SES to request an email with a report attachment

To use Amazon SES as the email transport mechanism, the following prerequisites apply:

- The sender's email address must be verified by [Amazon SES](https://aws.amazon.com/ses/). The [AWS Command Line Interface (AWS CLI)](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) is required to interact with Amazon SES. To configure basic settings used by the AWS CLI, see [Quick configuration with `aws configure`](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config) in the AWS Command Line Interface user guide.
- Amazon SES transport requires the `ses:SendRawEmail` role:

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

```
opensearch-reporting-cli --url https://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d --transport ses --from <sender_email_id> --to <recipient_email_id>
```

The following command uses default values for all other options. You can also set `OPENSEARCH_FROM`, `OPENSEARCH_TO`, and `OPENSEARCH_TRANSPORT` in your .env file and use the following command:

```
opensearch-reporting-cli --url https://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d
```

To modify the body of your email, you can edit the *index.hbs* file.

#### Example: Sending a report to an email address with SMTP

To send a report to an email address with SMTP transport, you need to set the options `OPENSEARCH_SMTP_HOST`, `OPENSEARCH_SMTP_PORT`, `OPENSEARCH_SMTP_USER`, `OPENSEARCH_SMTP_PASSWORD`, and `OPENSEARCH_SMTP_SECURE` in your .env file.

Once the transport options are set in your .env file, you can send the email using the following command:

```
opensearch-reporting-cli --url https://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d --transport smtp --from <sender_email_id> --to <recipient_email_id>
```

You can choose to set options using either your *.env* file or the command line argument values in any combination. Make sure to specify all required values to avoid errors.

To modify the body of your email, you can edit the *index.hbs* file.

## Limitations

The following limitations apply to environment variable usage with the Reporting CLI:

- Supported platforms are Windows x86, Windows x64, Mac Intel, Mac ARM, Linux x86, and Linux x64.
  
  For any other platform, users can take advantage of the *CHROMIUM_PATH* environment variable to use custom Chromium.

- If a URL contains an exclamation point (!), then the history expansion needs to be disabled temporarily. Depending on which shell you are using, you can disable history expansion using one of the following commands:

  * For bash, use `set +H`. 
  * For zsh, use `setopt nobanghist`.

  Alternatively, you can add a URL value as an environment variable using this format: `URL="<url-with-!>"`.

- All command options only accept lowercase letters.

## Troubleshooting

To resolve **MessageRejected: Email address is not verified**, see [Why am I getting a 400 "message rejected" error with the message "Email address is not verified" from Amazon SES?](https://repost.aws/knowledge-center/ses-554-400-message-rejected-error) in the AWS Knowledge Center.