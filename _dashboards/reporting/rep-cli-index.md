---
layout: default
title: Reporting using the CLI
nav_order: 20
parent: Reporting
has_children: true
redirect_from:
  - /reporting/rep-cli-index/
  - /dashboards/reporting-cli/rep-cli-index/
---

# Reporting using the CLI

Use the Reporting CLI to generate reports from a script or a scheduler without opening OpenSearch Dashboards in a browser. The Reporting CLI opens the URL of a dashboard, visualization, notebook, or saved search in a headless Chromium browser, captures the page, and either saves the report to the current directory or sends it as an email attachment using Amazon Simple Email Service (Amazon SES) or SMTP.

The Reporting CLI loads the page from a running OpenSearch Dashboards instance, so the instance must be reachable from the machine on which the Reporting CLI runs.

The Reporting CLI supports the following report formats:

- PDF and PNG reports of dashboards, visualizations, and notebooks. These reports do not require the Reporting plugin.
- CSV reports of saved searches. The Reporting CLI generates CSV reports using the **Reporting** menu in **Discover**, so CSV reports require the Reporting plugin to be installed in OpenSearch Dashboards.

To connect to OpenSearch Dashboards, the Reporting CLI supports the following authentication types:

- Basic HTTP authentication: Specify `-a basic` and provide credentials.
- Amazon Cognito authentication: Specify `-a cognito` and provide credentials. To learn more about Amazon Cognito, see [What is Amazon Cognito?](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html).
- SAML authentication using Okta as the identity provider: Specify `-a saml` and provide credentials.
- No authentication: Omit the `-a` option.

To get started, see [Download and install the Reporting CLI tool]({{site.url}}{{site.baseurl}}/dashboards/reporting/rep-cli-install/).
