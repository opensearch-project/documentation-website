---
layout: default
title: Shipping events to OpenSearch
parent: Logstash
nav_order: 220
redirect_from:
 - /clients/logstash/ship-to-opensearch/
---

# Shipping events to OpenSearch

Use the [OpenSearch output plugin](https://github.com/opensearch-project/logstash-output-opensearch) to send Logstash events to an OpenSearch cluster. You can then search the events in OpenSearch and visualize them in OpenSearch Dashboards.

Before you start, install [Logstash and the OpenSearch output plugin]({{site.url}}{{site.baseurl}}/tools/logstash/index/#installing-logstash), [OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/), and, optionally, [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).

## Configuring the OpenSearch output plugin

To send events to OpenSearch, add the `opensearch` plugin to the `output` section of your pipeline configuration file. Replace `<admin-password>` with the password for the `admin` user and `<path-to-root-ca>` with the path to the certificate authority file that signed the OpenSearch node certificates:

```ruby
output {
  opensearch {
    hosts    => ["https://localhost:9200"]
    user     => "admin"
    password => "<admin-password>"
    index    => "logstash-logs-%{+YYYY.MM.dd}"
    ssl      => true
    cacert   => "<path-to-root-ca>"
  }
}
```
{% include copy.html %}

The `index` setting uses the `%{+YYYY.MM.dd}` date pattern, so Logstash writes events to a separate index for each day, for example, `logstash-logs-2026.10.16`. The date comes from the `@timestamp` field of each event.

If you're testing against a cluster that uses the demo security configuration, which uses self-signed certificates, you can replace the `cacert` setting with `ssl_certificate_verification => false`. Don't disable certificate verification in production.
{: .warning }

## Configuring TLS

When `hosts` contains an `https://` URL, the plugin connects to OpenSearch over TLS and verifies the OpenSearch node certificates. Provide the certificate authority (CA) that signed the node certificates in one of the following ways:

- Set `cacert` to the path of the CA certificate in PEM format, as shown in the preceding example.
- Set `truststore` to the path of a Java KeyStore (JKS) file that contains the CA certificate, and set `truststore_password` to the truststore password.

You can't specify both `cacert` and `truststore`.

### Authenticating using a client certificate

If OpenSearch is configured for [client certificate authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/client-auth/), Logstash can present a client certificate to OpenSearch. Set `tls_certificate` to the path of the client certificate in PEM format and `tls_key` to the path of its private key. You must specify both settings:

```ruby
output {
  opensearch {
    hosts           => ["https://localhost:9200"]
    index           => "logstash-logs-%{+YYYY.MM.dd}"
    ssl             => true
    cacert          => "<path-to-root-ca>"
    tls_certificate => "<path-to-client-cert>"
    tls_key         => "<path-to-client-key>"
  }
}
```
{% include copy.html %}

The private key must be an unencrypted PEM file in PKCS #8 format, which begins with `-----BEGIN PRIVATE KEY-----`. A key in the PKCS #1 format, which begins with `-----BEGIN RSA PRIVATE KEY-----`, is rejected. To convert a PKCS #1 key, run the following command:

```bash
openssl pkcs8 -topk8 -nocrypt -in <client-key> -out <client-key-pkcs8>
```
{% include copy.html %}

Alternatively, store the client certificate and private key in a keystore. Set `keystore` to the path of a JKS or PKCS #12 (`.p12`) file and `keystore_password` to the keystore password.

The Security plugin maps the client certificate to a user based on the certificate's distinguished name (DN). This example omits the `user` and `password` settings, so OpenSearch authenticates Logstash using only the certificate.

## Example: Send JSON events to OpenSearch

To send events that you enter in the terminal to OpenSearch, follow these steps:

1. Create a file named `config/pipeline.conf` in the Logstash directory with the following configuration:

    ```ruby
    input {
      stdin {
        codec => json
      }
    }

    output {
      opensearch {
        hosts    => ["https://localhost:9200"]
        user     => "admin"
        password => "<admin-password>"
        index    => "logstash-logs-%{+YYYY.MM.dd}"
        ssl      => true
        ssl_certificate_verification => false
      }
    }
    ```
    {% include copy.html %}

    This pipeline accepts JSON input from the terminal and writes the events to the `logstash-logs-%{+YYYY.MM.dd}` index in an OpenSearch cluster running on `localhost`.

1. Start Logstash:

    ```bash
    bin/logstash -f config/pipeline.conf
    ```
    {% include copy.html %}

1. When Logstash logs `Pipeline started`, enter a JSON object on a single line in the terminal:

    ```json
    { "amount": 10, "quantity": 2 }
    ```
    {% include copy.html %}

1. Verify that Logstash created the index. In OpenSearch Dashboards, go to **Dev Tools** and send the following request:

    ```json
    GET _cat/indices/logstash-logs-*?v
    ```
    {% include copy-curl.html %}

    The response lists the index and its document count:

    ```
    health status index                    uuid                   pri rep docs.count docs.deleted store.size pri.store.size
    yellow open   logstash-logs-2026.10.16 iuh648LYSnmQrkGf70pplA   1   1          1            0      5.2kb          5.2kb
    ```

## Authentication

The OpenSearch output plugin supports basic authentication and AWS Identity and Access Management (IAM) authentication.

### Basic authentication

For basic authentication, provide the `user` and `password` settings, as shown in the preceding examples. Alternatively, specify the credentials in the `auth_type` setting:

```ruby
output {
  opensearch {
    hosts => ["https://<hostname>:<port>"]
    auth_type => {
      type => "basic"
      user => "admin"
      password => "<admin-password>"
    }
    index => "logstash-logs-%{+YYYY.MM.dd}"
  }
}
```
{% include copy.html %}

The following table lists the `auth_type` settings for basic authentication.

Setting | Data type | Description
:--- | :--- | :---
`type` | String | The authentication type. Set to `basic`.
`user` | String | The user name.
`password` | String | The password.

### AWS IAM authentication

To send events to an Amazon OpenSearch Service domain using AWS IAM authentication, set `type` to `aws_iam` in the `auth_type` setting. The plugin signs each request using AWS Signature Version 4:

```ruby
output {
  opensearch {
    hosts => ["https://<domain-endpoint>:443"]
    auth_type => {
      type => "aws_iam"
      region => "us-west-2"
      service_name => "es"
    }
    index => "logstash-logs-%{+YYYY.MM.dd}"
  }
}
```
{% include copy.html %}

Replace `<domain-endpoint>` with the domain endpoint, without the `https://` prefix. Amazon OpenSearch Service domains accept requests over HTTPS on port 443. The domain's access policy must allow the IAM identity that Logstash uses to send HTTP requests to the domain.

The following table lists the `auth_type` settings for AWS IAM authentication.

Setting | Data type | Description
:--- | :--- | :---
`type` | String | The authentication type. Set to `aws_iam`. Required.
`region` | String | The AWS Region in which the domain is located. Default is `us-east-1`. If the domain is in a different Region, you must set this value.
`service_name` | String | The service name used to sign requests. Default is `es`.
`aws_access_key_id` | String | The AWS access key ID. If not specified, the plugin resolves credentials as described in [Credential resolution](#credential-resolution).
`aws_secret_access_key` | String | The AWS secret access key.
`session_token` | String | The session token. Required when `aws_access_key_id` and `aws_secret_access_key` contain temporary credentials, such as credentials obtained from AWS Security Token Service (AWS STS).
`profile` | String | The profile in the AWS credentials file to use. Default is `default`.

#### Credential resolution

If you don't specify credentials in the `auth_type` setting, the plugin uses the first credentials that it finds in the following locations, in order:

1. The `aws_access_key_id` and `aws_secret_access_key` settings in the `auth_type` setting.
1. The `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` environment variables. The plugin also recognizes the `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` environment variables.
1. The credentials file in the default location (`~/.aws/credentials`).
1. The instance profile credentials provided by the Amazon EC2 instance metadata service.

To avoid storing credentials in the pipeline configuration file, use environment variables or, if Logstash runs on Amazon EC2, an instance profile.

## Optional settings

The following table lists optional settings for the OpenSearch output plugin.

Setting | Data type | Description
:--- | :--- | :---
`cacert` | String | The path to the certificate authority file used to verify the OpenSearch node certificates.
`ssl_certificate_verification` | Boolean | Whether to verify the OpenSearch node certificates. Default is `true`.
`truststore` | String | The path to a JKS truststore that contains the certificate authority used to verify the OpenSearch node certificates. Can't be used together with `cacert`.
`truststore_password` | String | The truststore password.
`tls_certificate` | String | The path to the client certificate in PEM format. Requires `tls_key`. See [Authenticating using a client certificate](#authenticating-using-a-client-certificate).
`tls_key` | String | The path to the private key of the client certificate, as an unencrypted PEM file in PKCS #8 format. Requires `tls_certificate`.
`keystore` | String | The path to a JKS or PKCS #12 keystore that contains the client certificate and its private key.
`keystore_password` | String | The keystore password.
`template` | String | The path to a custom index template file. If not specified, the plugin uses its default template.
`template_name` | String | The name of the index template in OpenSearch.
`legacy_template` | Boolean | Whether to install the index template using the legacy `_template` API. If `false`, the plugin uses the `_index_template` API. Default is `true`.
`manage_template` | Boolean | Whether the plugin installs an index template in OpenSearch. Default is `true`.
`default_server_major_version` | Integer | The OpenSearch major version to use when the plugin can't retrieve the version from the cluster's root endpoint. If not specified and the version can't be retrieved, the plugin fails.
`target_bulk_bytes` | Integer | The maximum size, in bytes, of a bulk request. When the buffered events reach this size, Logstash sends them to OpenSearch. Decrease this value if OpenSearch rejects bulk requests with a `429` status code because they are too large.

## Data streams

Data streams are recommended for append-only time-series data, such as logs, events, and metrics. For more information, see [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/).

To send events to a data stream, first create the data stream in OpenSearch. Then set `index` to the data stream name and `action` to `create`:

```ruby
output {
  opensearch {
    hosts => ["https://<hostname>:<port>"]
    auth_type => {
      type => "basic"
      user => "admin"
      password => "<admin-password>"
    }
    index => "my-data-stream"
    action => "create"
  }
}
```
{% include copy.html %}

Data streams accept only `create` operations. If you don't set `action` to `create`, OpenSearch rejects the events with a `400` status code.
