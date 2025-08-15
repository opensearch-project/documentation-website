---
layout: default
title: Kinesis
parent: Sources
grand_parent: Pipelines
nav_order: 45
---

# Atlassian `jira` source

You can use the OpenSearch Data Prepper `jira` source to ingest records from one or more [Atlassian Jira](https://www.atlassian.com/software/jira) projects.

## Usage
Setup Jira project access credentials by choosing one of the following options and as an additional optional step, store those credentials in an aws secret store. If secrets store is not used to store the credentials, then plain text credentials have to provided directly in the pipeline configuration.
- Basic Authentication (aka API key based authentication) by following the instructions [here](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)
- OAuth2 authentication by following the instructions [here](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#faq-rrt-config)

The following example pipeline specifies Jira as a source. The pipeline ingests data from multiple Jira projects named `project1` and `project2` and apply filters to choose interested tickets from these projects as source:

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
          username: ${{aws_secrets:jira-account-credentials:username}}
          password: ${{aws_secrets:jira-account-credentials:password}}
          # For OAuth2 based authentication, we require the following 4 key values stored in the secret
          # Follow atlassian instructions at the following link to generate these keys
          # https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/
          # If you are using OAuth2 authentication, we also require, write permission to your aws secret to
          # be able to write the renewed tokens back into the secret
          # oauth2:
          # client_id: ${{aws_secrets:jira-account-credentials:clientId}}
          # client_secret: ${{aws_secrets:jira-account-credentials:clientSecret}}
          # access_token: ${{aws_secrets:jira-account-credentials:accessToken}}
          # refresh_token: ${{aws_secrets:jira-account-credentials:refreshToken}}
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

## Configuration options

The `Jira` source supports the following configuration options.

| Option            | Required | Type                              | Description                                                                                                                                                                                                                   |
|:------------------|:---------|:----------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hosts`           | Yes      | List                              | Atlassian Jira host name. As of now, it only supports one host, so list is expected to be of size one.                                                                                                                        |
| `acknowledgments` | No       | Boolean                           | When set to `true`, enables the `jira` source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) when events are received by OpenSearch sinks. |
| `authentication`  | Yes      | [authentication](#Authentication) | Configures authentication method to access `jira` source records from the given host.                                                                                                                                         |
| `filter`          | No       | [filter](#Filter)                 | Describe specific filter criteria to apply while extracting jira tickets.                                                                                                                                                     |

### Authentication

You can use one the following authentication methods to access the given jira host. Either one of them is required.

| Option   | Required | Type              | Description                                            |
|:---------|:---------|:------------------|:-------------------------------------------------------|
| `basic`  | Yes      | [basic](#Basic)   | Basic Authentication credentials to access Jira host.  |
| `oauth2` | Yes      | [oauth2](#Oauth2) | OAuth2 Authentication credentials to access Jira host. |

## Basic

Either basic or OAuth2 credentials are required to access the jira site. If Basic is used, the following fields are mandatory.

| Option     | Required | Type   | Description                                                                                     |
|:-----------|:---------|:-------|:------------------------------------------------------------------------------------------------|
| `username` | Yes      | String | It can be a String value of username or reference to secret key storing the username.           |
| `password` | Yes      | String | It can be a String value of password (API Key) or reference to secret key storing the password. |

### OAuth2

Either basic or OAuth2 credentials are required to access the jira site. If OAuth2 is used, the following fields are mandatory.

| Option          | Required | Type   | Description                                                                                     |
|:----------------|:---------|:-------|:------------------------------------------------------------------------------------------------|
| `client_id`     | Yes      | String | It can be a String value of client_id or reference to secret key storing the client_id.         |
| `client_secret` | Yes      | String | It can be a String value of client_secret or reference to secret key storing the client_secret. |
| `access_token`  | Yes      | String | It can be a String value of access_token or reference to secret key storing the access_token.   |
| `refresh_token` | Yes      | String | It can be a String value of refresh_token or reference to secret key storing the refresh_token. |

### Filter

Specifying filters is optional. If no filters are given, all the projects and tickets visible for the given credentials will be extracted and sent to the given sink in the pipeline.

| Option       | Required | Type   | Description                                    |
|:-------------|:---------|:-------|:-----------------------------------------------|
| `project`    | No       | String | include or exclude list of project key.        |
| `issue_type` | No       | String | include or exclude list of issue type filters. |
| `status`     | No       | String | include or exclude list of status filters.     |

### aws secrets

You can use the following options in the `aws` secrets configuration if you plan to store the credentials in a secret. Storing secrets in AWS secrets store is optional. If secret store is not used, credentials have to be given in the pipeline yaml itself, in plain text.
If OAuth2 authentication is used in combination with aws secrets, this source requires write permission to the secret to be able to write back the updated (or renewed) access token once it is expired.

| Option         | Required | Type   | Description                                                                                                                                                                                                                                                                                    |
|:---------------|:---------|:-------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `region`       | yes      | String | Sets the AWS Region to use for credentials. Defaults to the [standard SDK behavior for determining the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).                                                                                         |
| `sts_role_arn` | yes      | String | Defines the AWS Security Token Service (AWS STS) role to assume for requests to Amazon Kinesis Data Streams and Amazon DynamoDB. Defaults to `null`, which uses the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html). |
| `secret_id`    | yes      | Map    | AWS Secret ARN of the secret that where the credentials are stored.                                                                                                                                                                                                                            |

## Metrics

The `jira` source includes the following metrics.

### Counters

* `crawlingTime`: The time it took to crawl through all the new changes in the Jira.
* `ticketFetchLatency`: Ticket fetching API latency time.
* `searchCallLatency`: Search API latency time.
* `searchResultsFound`: Number of tickets found in a given search API call.
