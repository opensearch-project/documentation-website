---
layout: default
title: Kinesis
parent: Sources
grand_parent: Pipelines
nav_order: 45
---

# Atlassian Confluence source

You can use the OpenSearch Data Prepper `confluence` source to ingest records from one or more [Atlassian Confluence](https://www.atlassian.com/software/confluence) spaces.

## Usage
Setup Confluence project access credentials by choosing one of the below options and as an additional optional step, store those credentials in an aws secret store. If secrets store is not used to store the credentials, then plain text credentials have to provided directly in the pipeline configuration.
- Basic Authentication (aka API key based authentication) by following the instructions [here](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)
- OAuth2 authentication by following the instructions [here](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#faq-rrt-config)

The following example pipeline specifies Confluence as a source. The pipeline ingests data from multiple Confluence spaces named `space1` and `space` and apply filters to choose interested wiki content (pages and blogs) from these projects as source:

```yaml
version: "2"
extension:
  aws:
    secrets:
      confluence-account-credentials:
        secret_id: "arn:aws:secretsmanager:us-east-1:123456789012:secret:confluence-credentials-secret"
        region: "us-east-1"
        sts_role_arn: "arn:aws:iam::123456789012:role/Example-Role"
atlassian-confluence-pipeline:
  source:
    confluence:
      hosts: ["https://example.atlassian.net/"]
      acknowledgments: true
      authentication:
        # Provide one of the authentication method to use. Supported methods are 'basic' and 'oauth2'.
        # For basic authentication, password is the API key that you generate using your confluence account
        basic:
          username: ${{aws_secrets:confluence-account-credentials:username}}
          password: ${{aws_secrets:confluence-account-credentials:password}}
          # For OAuth2 based authentication, we require the following 4 key values stored in the secret
          # Follow atlassian instructions at the below link to generate these keys
          # https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/
          # If you are using OAuth2 authentication, we also require, write permission to your aws secret to
          # be able to write the renewed tokens back into the secret
          # oauth2:
          # client_id: ${{aws_secrets:confluence-account-credentials:clientId}}
          # client_secret: ${{aws_secrets:confluence-account-credentials:clientSecret}}
          # access_token: ${{aws_secrets:confluence-account-credentials:accessToken}}
          # refresh_token: ${{aws_secrets:confluence-account-credentials:refreshToken}}
      filter:
        space:
          key:
            include:
              # This is not space name.
              # It is an alphanumeric space key that you can find under space details in confluence
              - "space1"
              - "space2"
              # exclude:
              # - "<<space key>>"
              # - "<<space key>>"
        page_type:
          include:
            - "page"
              # - "blogpost"
              # - "comment"
              # exclude:
            # - "attachment"
```

## Configuration options

The `Confluence` source supports the following configuration options.

| Option            | Required | Type                              | Description                                                                                                                                                                                                                         |
|:------------------|:---------|:----------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hosts`           | Yes      | List                              | Atlassian Confluence host name. As of now, it only supports one host, so list is expected to be of size one.                                                                                                                        |
| `acknowledgments` | No       | Boolean                           | When set to `true`, enables the `confluence` source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) when events are received by OpenSearch sinks. |
| `authentication`  | Yes      | [authentication](#Authentication) | Configures authentication method to access `confluence` source records from the given host.                                                                                                                                         |
| `filter`          | No       | [filter](#Filter)                 | Describe specific filter criteria to apply while extracting Confluence content.                                                                                                                                                     |

### Authentication

You can use one the following authentication methods to access the given confluence host. Either one of them is required.

| Option   | Required | Type              | Description                                                  |
|:---------|:---------|:------------------|:-------------------------------------------------------------|
| `basic`  | Yes      | [basic](#Basic)   | Basic Authentication credentials to access Confluence host.  |
| `oauth2` | Yes      | [oauth2](#Oauth2) | OAuth2 Authentication credentials to access Confluence host. |

## Basic

Either basic or OAuth2 credentials are required to access the confluence site. If Basic is used, the following fields are mandatory.

| Option     | Required | Type   | Description                                                                                     |
|:-----------|:---------|:-------|:------------------------------------------------------------------------------------------------|
| `username` | Yes      | String | It can be a String value of username or reference to secret key storing the username.           |
| `password` | Yes      | String | It can be a String value of password (API Key) or reference to secret key storing the password. |

### OAuth2

Either basic or OAuth2 credentials are required to access the confluence site. If OAuth2 is used, the following fields are mandatory.

| Option          | Required | Type   | Description                                                                                     |
|:----------------|:---------|:-------|:------------------------------------------------------------------------------------------------|
| `client_id`     | Yes      | String | It can be a String value of client_id or reference to secret key storing the client_id.         |
| `client_secret` | Yes      | String | It can be a String value of client_secret or reference to secret key storing the client_secret. |
| `access_token`  | Yes      | String | It can be a String value of access_token or reference to secret key storing the access_token.   |
| `refresh_token` | Yes      | String | It can be a String value of refresh_token or reference to secret key storing the refresh_token. |

### Filter

Specifying filters is optional. If no filters are given, all the spaces and content visible for the given credentials will be extracted and sent to the given sink in the pipeline.

| Option      | Required | Type   | Description                                   |
|:------------|:---------|:-------|:----------------------------------------------|
| `space`     | No       | String | include or exclude list of space key.         |
| `page_type` | No       | String | include or exclude list of page type filters. |

### aws secrets

You can use the following options in the `aws` secrets configuration if you plan to store the credentials in a secret. Storing secrets in AWS secrets store is optional. If secret store is not used, credentials have to be given in the pipeline yaml itself, in plain text.
If OAuth2 authentication is used in combination with aws secrets, this source requires write permission to the secret to be able to write back the updated (or renewed) access token once it is expired.

| Option         | Required | Type   | Description                                                                                                                                                                                                                                                                                    |
|:---------------|:---------|:-------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `region`       | yes      | String | Sets the AWS Region to use for credentials. Defaults to the [standard SDK behavior for determining the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).                                                                                         |
| `sts_role_arn` | yes      | String | Defines the AWS Security Token Service (AWS STS) role to assume for requests to Amazon Kinesis Data Streams and Amazon DynamoDB. Defaults to `null`, which uses the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html). |
| `secret_id`    | yes      | Map    | AWS Secret ARN of the secret that where the credentials are stored.                                                                                                                                                                                                                            |

## Metrics

The `confluence` source includes the following metrics.

### Counters

* `crawlingTime`: The time it took to crawl through all the new changes in the Confluence.
* `pageFetchLatency`: Page fetching API latency time.
* `searchCallLatency`: Search API latency time.
* `searchResultsFound`: Number of pages found in a given search API call.
