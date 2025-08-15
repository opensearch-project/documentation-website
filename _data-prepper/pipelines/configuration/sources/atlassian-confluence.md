---
layout: default
title: Atlassian Confluence
parent: Sources
grand_parent: Pipelines
nav_order: 5
---

# Atlassian Confluence source

You can use the OpenSearch Data Prepper `confluence` source to ingest records from one or more [Atlassian Confluence](https://www.atlassian.com/software/confluence) spaces.

## Usage

Set up Confluence project access credentials by choosing one of the following options:

- **Basic authentication** (API key authentication): Follow [these instructions](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/).
- **OAuth2 authentication**: Follow [these instructions](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#faq-rrt-config).

As an additional optional step, store the credentials in an AWS secret store. If you don't store the credentials in the secret store, then you must provide plain-text credentials directly in the pipeline configuration.

The following example pipeline specifies `confluence` as a source. The pipeline ingests data from multiple Confluence spaces named `space1` and `space2` and applies filters to select wiki content (pages and blog posts) from these projects as a source:

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
          username: {% raw %} ${{aws_secrets:confluence-account-credentials:username}} {% endraw %} 
          password: {% raw %} ${{aws_secrets:confluence-account-credentials:password}} {% endraw %} 
          # For OAuth2 based authentication, we require the following 4 key values stored in the secret
          # Follow atlassian instructions at the following link to generate these keys
          # https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/
          # If you are using OAuth2 authentication, we also require, write permission to your aws secret to
          # be able to write the renewed tokens back into the secret
          # oauth2:
          # client_id: {% raw %} ${{aws_secrets:confluence-account-credentials:clientId}} {% endraw %} 
          # client_secret: {% raw %} ${{aws_secrets:confluence-account-credentials:clientSecret}} {% endraw %} 
          # access_token: {% raw %} ${{aws_secrets:confluence-account-credentials:accessToken}} {% endraw %} 
          # refresh_token: {% raw %} ${{aws_secrets:confluence-account-credentials:refreshToken}} {% endraw %} 
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
{% include copy.html %}

## Configuration options

The `confluence` source supports the following configuration options.

| Option            | Required | Type                              | Description                                                                                                                                                                                                                         |
|:------------------|:---------|:----------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hosts`           | Yes      | List                              | The Atlassian Confluence hostname. Currently, only one host is supported, so this list is expected to be of size 1.                                                                                                                        |
| `acknowledgments` | No       | Boolean                           | When set to `true`, enables the `confluence` source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) when events are received by OpenSearch sinks. |
| `authentication`  | Yes      | [authentication](#Authentication) | Configures the authentication method used to access `confluence` source records from the specified host.                                                                                                                                         |
| `filter`          | No       | [filter](#Filter)                 | Applies specific filter criteria while extracting Confluence content.                                                                                                                                                     |

### Authentication

You can use one of the following authentication methods to access a Confluence host. You must provide one of the following parameters.

| Option   | Required | Type              | Description                                                  |
|:---------|:---------|:------------------|:-------------------------------------------------------------|
| `basic`  | Yes      | [basic](#Basic)   | Basic authentication credentials used to access a Confluence host.  |
| `oauth2` | Yes      | [oauth2](#Oauth2) | OAuth2 authentication credentials used to access a Confluence host. |

#### Basic authentication

Either basic or OAuth2 credentials are required to access the Confluence site. If you use `basic` authentication, the following fields are required.

| Option     | Required | Type   | Description                                                                                     |
|:-----------|:---------|:-------|:------------------------------------------------------------------------------------------------|
| `username` | Yes      | String | A username or reference to the secret key storing the username.           |
| `password` | Yes      | String | A password (API key) or reference to the secret key storing the password. |

#### OAuth2 authentication

Either basic or OAuth2 credentials are required to access the Confluence site. If you use OAuth2, the following fields are required.

| Option          | Required | Type   | Description                                                                                     |
|:----------------|:---------|:-------|:------------------------------------------------------------------------------------------------|
| `client_id`     | Yes      | String | A `client_id` or reference to the secret key storing the `client_id`.         |
| `client_secret` | Yes      | String | A `client_secret` or reference to the secret key storing the `client_secret`. |
| `access_token`  | Yes      | String | An `access_token` or reference to the secret key storing the `access_token`.   |
| `refresh_token` | Yes      | String | A `refresh_token` or reference to the secret key storing the `refresh_token`. |

### Filter

Optionally, you can specify filters to select specific content. If no filters are specified, all the spaces and content visible for the specified credentials are extracted and sent to the specified sink in the pipeline.

| Option      | Required | Type   | Description                                   |
|:------------|:---------|:-------|:----------------------------------------------|
| `space`     | No       | String | A list of space keys to include or exclude.         |
| `page_type` | No       | String | A list of page type filters to include or exclude. |

### AWS secrets

You can use the following options in the `aws` secrets configuration if you plan to store the credentials in a secret. Storing secrets in AWS secrets store is optional. If secret store is not used, credentials must be specified in the pipeline YAML itself, in plain text.

If OAuth2 authentication is used in combination with `aws` secrets, this source requires write permissions to the secret to be able to write back the updated (or renewed) access token once the current token expires.

| Option         | Required | Type   | Description                                                                                                                                                                                                                                                                                    |
|:---------------|:---------|:-------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `region`       | Yes      | String | The AWS Region to use for credentials. Defaults to the [standard SDK behavior for determining the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).                                                                                         |
| `sts_role_arn` | Yes      | String | The AWS Security Token Service (AWS STS) role to assume for requests to Atlassian Confluence. Defaults to `null`, which uses the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html). |
| `secret_id`    | Yes      | Map    | The Amazon Resource Name (ARN) of the secret where the credentials are stored.                                                                                                                                                                                                                            |

## Metrics

The `confluence` source includes the following metrics (counters):

* `crawlingTime`: The amount of time taken to crawl through all the new changes in Confluence.
* `pageFetchLatency`: The page fetch API operation latency.
* `searchCallLatency`: The search API operation latency.
* `searchResultsFound`: The number of pages found in a specified search API call.
