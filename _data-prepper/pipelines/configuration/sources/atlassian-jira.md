---
layout: default
title: Atlassian Jira
parent: Sources
grand_parent: Pipelines
nav_order: 7
---

# Atlassian Jira source

You can use the OpenSearch Data Prepper `jira` source to ingest records from one or more [Atlassian Jira](https://www.atlassian.com/software/jira) projects.

## Usage

Set up Jira project access credentials by choosing one of the following options:

- **Basic authentication** (API key authentication): Follow [these instructions](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/).
- **OAuth2 authentication**: Follow [these instructions](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#faq-rrt-config).

As an additional optional step, store the credentials in AWS Secrets Manager. If you don't store the credentials in AWS Secrets Manager, then you must provide plain-text credentials directly in the pipeline configuration.

The following example pipeline specifies `jira` as a source. The pipeline ingests data from Jira projects named `project1` and `project2` and applies filters to select tickets from these projects as a source:

```yaml
version: "2"
extension:
  aws:
    secrets:
      jira-account-credentials:
        secret_id: "arn:aws:secretsmanager:us-east-1:123456789012:secret:jira-credentials-secret"
        region: "us-east-1"
        sts_role_arn: "arn:aws:iam::123456789012:role/Example-Role"
atlassian-jira-pipeline:
  source:
    jira:
      hosts: ["https://example.atlassian.net/"]
      acknowledgments: true
      authentication:
        # Provide one of the authentication method to use. Supported methods are 'basic' and 'oauth2'.
        # For basic authentication, password is the API key that you generate using your jira account
        basic:
          username: {% raw %}  ${{aws_secrets:jira-account-credentials:username}} {% endraw %} 
          password: {% raw %}  ${{aws_secrets:jira-account-credentials:password}} {% endraw %} 
          # For OAuth2 based authentication, we require the following 4 key values stored in the secret
          # Follow atlassian instructions at the following link to generate these keys
          # https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/
          # If you are using OAuth2 authentication, we also require, write permission to your aws secret to
          # be able to write the renewed tokens back into the secret
          # oauth2:
          # client_id: {% raw %} ${{aws_secrets:jira-account-credentials:clientId}} {% endraw %} 
          # client_secret: {% raw %} ${{aws_secrets:jira-account-credentials:clientSecret}} {% endraw %} 
          # access_token: {% raw %} ${{aws_secrets:jira-account-credentials:accessToken}} {% endraw %} 
          # refresh_token: {% raw %} ${{aws_secrets:jira-account-credentials:refreshToken}} {% endraw %} 
      filter:
        project:
          key:
            include:
              # This is not project name.
              # It is an alphanumeric project key that you can find under project details in jira
              - "project1"
              - "project2"
              # exclude:
              # - "<<project key>>"
              # - "<<project key>>"
        issue_type:
          include:
            - "Story"
              # - "Bug"
              # - "Task"
              # exclude:
            # - "Epic"
        status:
          include:
            - "To Do"
            # - "In Progress"
            # - "Done"
            # exclude:
            # - "Backlog"
```
{% include copy.html %}

## Configuration options

The `jira` source supports the following configuration options.

| Option            | Required | Type                              | Description                                                                                                                                                                                                                   |
|:------------------|:---------|:----------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hosts`           | Yes      | List                              | The Atlassian Confluence hostname. Currently, only one host is supported, so this list is expected to be of size 1.                                                                                                                        |
| `acknowledgments` | No       | Boolean                           | When set to `true`, enables the `jira` source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) when events are received by OpenSearch sinks. |
| `authentication`  | Yes      | [authentication](#Authentication) | Configures the authentication method used to access `jira` source records from the specified host.                                                                                                                                         |
| `filter`          | No       | [filter](#Filter)                 | Applies specific filter criteria while extracting Jira tickets.                                                                                                                                                     |

### Authentication

You can use one the following authentication methods to access the specified jira host. You must provide one of the following parameters.

| Option   | Required | Type              | Description                                            |
|:---------|:---------|:------------------|:-------------------------------------------------------|
| `basic`  | Yes      | [basic](#basic-authentication)   | Basic authentication credentials used to access a Jira host.  |
| `oauth2` | Yes      | [oauth2](#oauth2-authentication)| OAuth2 authentication credentials used to access a Jira host. |

#### Basic authentication

Either basic or OAuth2 credentials are required to access the Jira site. If you use `basic` authentication, the following fields are required.

| Option     | Required | Type   | Description                                                                                     |
|:-----------|:---------|:-------|:------------------------------------------------------------------------------------------------|
| `username` | Yes      | String | A username or reference to the secret key storing the username.           |
| `password` | Yes      | String | A password (API key) or reference to the secret key storing the password. |

#### OAuth2 authentication

Either basic or OAuth2 credentials are required to access the jira site. If OAuth2 is used, the following fields are mandatory.

Either basic or OAuth2 credentials are required to access the Confluence site. If you use OAuth2, the following fields are required.

| Option          | Required | Type   | Description                                                                                     |
|:----------------|:---------|:-------|:------------------------------------------------------------------------------------------------|
| `client_id`     | Yes      | String | A `client_id` or reference to the secret key storing the `client_id`.         |
| `client_secret` | Yes      | String | A `client_secret` or reference to the secret key storing the `client_secret`. |
| `access_token`  | Yes      | String | An `access_token` or reference to the secret key storing the `access_token`.   |
| `refresh_token` | Yes      | String | A `refresh_token` or reference to the secret key storing the `refresh_token`. |

### Filter

Optionally, you can specify filters to select specific content. If no filters are specified, all the projects and tickets visible for the specified credentials will be extracted and sent to the specified sink in the pipeline.

| Option       | Required | Type   | Description                                    |
|:-------------|:---------|:-------|:-----------------------------------------------|
| `project`    | No       | String | A list of project keys to include or exclude.        |
| `issue_type` | No       | String | A list of issue type filters to include or exclude. |
| `status`     | No       | String | A list of status filters to include or exclude.     |

### AWS secrets

You can use the following options in the `aws` secrets configuration if you plan to store the credentials in AWS Secrets Manager. Storing secrets in AWS Secrets Manager is optional. If AWS Secrets Manager is not used, credentials must be specified in the pipeline YAML itself, in plain text.

If OAuth2 authentication is used in combination with `aws` secrets, this source requires write permissions to the secret to be able to write back the updated (or renewed) access token once the current token expires.

| Option         | Required | Type   | Description                                                                                                                                                                                                                                                                                    |
|:---------------|:---------|:-------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `region`       | Yes      | String | The AWS Region to use for credentials. Defaults to the [standard SDK behavior for determining the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).                                                                                         |
| `sts_role_arn` | Yes      | String | The AWS Security Token Service (AWS STS) role to assume for requests to Atlassian Jira. Defaults to `null`, which uses the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html). |
| `secret_id`    | Yes      | Map    | The Amazon Resource Name (ARN) of the secret where the credentials are stored.                                                                                                                              

## Metrics

The `jira` source includes the following metrics (counters):

* `crawlingTime`: The amount of time taken to crawl through all the new changes in Jira.
* `ticketFetchLatency`: The ticket fetch API operation latency.
* `searchCallLatency`: The search API operation latency.
* `searchResultsFound`: The number of tickets found in a specified search API call.
