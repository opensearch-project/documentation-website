---
layout: default
title: Reporting using the CLI
nav_order: 10
has_children: true
redirect_from:
  - /dashboards/reporting-cli/rep-cli-index/
---

# Reporting using the CLI

You can programmatically create dashboard reports in PDF or PNG format with the Reporting CLI without using OpenSearch Dashboards or the Reporting plugin. This allows you to create reports automatically within your email workflows.

If you want to download a CSV file, you need to have the Reporting plugin installed.
{: .note }

For any dashboard view, you can request a report in PNG or PDF format to be sent to an email address. This can be useful for sending reports to multiple email recipients with an email alias. The only dashboard application that supports creating a CSV report is **Discover**.

With the Reporting CLI, you can specify options for your report in the command line. The report is sent to an email address as a PDF attachment by default. You can also request a PNG image or a CSV file with the `--formats` argument.

You can download the report to the directory in which you are running the Reporting CLI, or you can email the report by specifying Amazon Simple Email Service (Amazon SES) or SMTP for the email transport option.

You can connect to OpenSearch with any of the following authentication types:

- **Basic** – Basic HTTP authentication. Use `-a basic`.
- **Cognito** – Authentication through Amazon Cognito. Use `-a cognito`.
- **SAML** – Authentication between an identity provider and a service provider. Use `-a saml`. Okta provides the SAML third-party authentication.
- **No auth** – No authentication. Use `-a none`. Authentication defaults to No auth if the `-a` flag is not specified.

To learn more about Amazon Cognito, see [What is Amazon Cognito?](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html).

<!--
### Bypass authentication option

The Reporting CLI tool allows you to integrate it into your own workflow or environment so that you can bypass authentication or potential security issues. For example, if you use the Reporting CLI tool within an AWS Lambda instance, no security issues would occur as long as you run the Reporting plugin in OpenSearch Dashboards. In this case, you would use "No auth" to bypass the authentication process. To specify "No Auth" use `--auth none` in your request. Lambda users should test to make sure they can bypass access to Dashboards without credentials using No Auth.  

To get a list of all options, see [Reporting CLI options](#reporting-cli-options).
-->