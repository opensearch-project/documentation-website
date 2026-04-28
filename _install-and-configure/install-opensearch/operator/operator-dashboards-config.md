---
layout: default
title: OpenSearch Dashboards configuration
parent: OpenSearch Kubernetes Operator
grand_parent: Installing OpenSearch
nav_order: 30
---

# OpenSearch Dashboards configuration

The operator can automatically deploy and manage an OpenSearch Dashboards instance. To enable it, add the following section to your cluster `spec`:

```yaml
# ...
spec:
  dashboards:
    enable: true # Set to true to enable the OpenSearch Dashboards deployment
    version: 3.0.0 # The OpenSearch Dashboards version to deploy. This should match the OpenSearch cluster version
    replicas: 1 # The number of replicas to deploy
```
{% include copy.html %}

## Configuring opensearch_dashboards.yml

You can customize the OpenSearch Dashboards configuration (`opensearch_dashboards.yml`) using the `additionalConfig` field in the dashboards section of the `OpenSearchCluster` custom resource:

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchCluster
#...
spec:
  dashboards:
    additionalConfig:
      opensearch_security.auth.type: "proxy"
      opensearch.requestHeadersWhitelist: |
        ["securitytenant","Authorization","x-forwarded-for","x-auth-request-access-token", "x-auth-request-email", "x-auth-request-groups"]
      opensearch_security.multitenancy.enabled: "true"
```
{% include copy.html %}

You can use this to configure any of the [backend authentication types]({{site.url}}{{site.baseurl}}/security-plugin/configuration/configuration/) for OpenSearch Dashboards.

The configuration must be valid. If the configuration is invalid, the OpenSearch Dashboards instance will fail to start.
{: .note}

## Storing sensitive information in the dashboards configuration

You may need to store sensitive information in the OpenSearch Dashboards configuration file (for example, a client secret for OpenID Connect). To do this safely, use OpenSearch Dashboards variable substitution.

Create a secret with the sensitive information (for example, `dashboards-oidc-config`) and mount it as an environment variable in the OpenSearch Dashboards pod. For instructions, see [Adding environment variables to pods]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-kubernetes-custom/#adding-environment-variables-to-pods). You can then reference any keys from that secret in your OpenSearch Dashboards configuration.

The following example shows a portion of a cluster `spec`:

```yaml
spec:
  dashboards:
    env:
      - name: OPENID_CLIENT_SECRET
        valueFrom:
          secretKeyRef:
            name: dashboards-oidc-config
            key: client_secret
    additionalConfig:
      opensearch_security.openid.client_secret: "${OPENID_CLIENT_SECRET}"
```
{% include copy.html %}

Changing the value in the secret does not directly affect the OpenSearch Dashboards configuration. To apply the changes, restart the OpenSearch Dashboards pods.
{: .note}

## Configuring a base path

When using OpenSearch Dashboards behind a reverse proxy on a subpath (for example, `/logs`), configure a base path by setting the `basePath` field. The operator automatically adds the correct configuration options to the OpenSearch Dashboards configuration:

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchCluster
metadata:
  name: my-cluster
spec:
  dashboards:
    enable: true
    basePath: "/logs"
```
{% include copy.html %}

This also sets the `server.rewriteBasePath` option to `true`. If you expose OpenSearch Dashboards using an ingress controller, configure it to match this setting.

## OpenSearch Dashboards HTTP

OpenSearch Dashboards can expose its API and UI using HTTP or HTTPS. By default, the connection is unencrypted (HTTP). To secure the connection, you can either let the operator generate and sign a certificate or provide your own. The following fields in the `OpenSearchCluster` custom resource configure TLS for OpenSearch Dashboards:

```yaml
# ...
spec:
  dashboards:
    enable: true # Deploy OpenSearch Dashboards component
    tls:
      enable: true # Configure TLS
      generate: true # Have the operator generate and sign a certificate
      # How long generated certificates are valid (default: 8760h = 1 year)
      duration: "8760h"
      secret:
        name: # Name of the secret that contains the provided certificate
      caSecret:
        name: # Name of the secret that contains a CA the operator should use
# ...
```
{% include copy.html %}

To let the operator generate the certificate, set `tls.enable: true` and `tls.generate: true` (you can omit the other fields under `tls`). As with the node certificates, you can supply your own CA using `caSecret.name` for the operator to use.

To use your own certificate, provide it as a Kubernetes TLS secret (with fields `tls.key` and `tls.crt`) and specify the secret name in `secret.name`.

When exposing OpenSearch Dashboards outside the cluster, use operator-generated certificates internally and let an ingress controller present a valid certificate from an accredited CA (for example, Let's Encrypt).
