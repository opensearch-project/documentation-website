---
layout: default
title: OpenSearch cluster configuration
parent: OpenSearch Kubernetes Operator
grand_parent: Installing OpenSearch
nav_order: 20
---

# OpenSearch cluster configuration

The operator deploys and manages OpenSearch clusters. You can configure node pools, TLS certificates, plugins, keystore secrets, and other cluster-specific settings.

## Node pools and scaling

OpenSearch clusters consist of one or more node pools. Each node pool is a logical group of nodes with the same [role]({{site.url}}{{site.baseurl}}/tuning-your-cluster/) and can have its own resources. For each configured node pool, the operator creates a Kubernetes `StatefulSet` and `Service`, allowing you to communicate with specific node pools:

```yaml
spec:
  nodePools:
    - component: masters
      replicas: 3 # The number of replicas
      diskSize: "30Gi" # The disk size to use
      resources: # The resource requests and limits for that nodepool
        requests:
          memory: "2Gi"
          cpu: "500m"
        limits:
          memory: "2Gi"
          cpu: "500m"
      roles: # The roles the nodes should have
        - "cluster_manager"
        - "data"
    - component: nodes
      replicas: 3
      diskSize: "10Gi"
      nodeSelector:
      resources:
        requests:
          memory: "2Gi"
          cpu: "500m"
        limits:
          memory: "2Gi"
          cpu: "500m"
      roles:
        - "data"
```
{% include copy.html %}

For additional node pool configuration options, such as storage, security context, labels, and affinity rules, see [Kubernetes deployment customization]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-kubernetes-custom/).

## Configuring opensearch.yml

The operator automatically generates an `opensearch.yml` configuration file based on the parameters in the cluster `spec` you provide (for example, Transport Layer Security (TLS) configuration). To add custom settings, use the `additionalConfig` field in the cluster `spec`:

```yaml
spec:
  general:
    # ...
    additionalConfig:
      some.config.option: somevalue
  # ...
nodePools:
  - component: masters
    # ...
    additionalConfig:
      some.other.config: foobar
```
{% include copy.html %}

Use `spec.general.additionalConfig` to add settings applied to all cluster nodes. The operator stores these settings in a shared `ConfigMap` and mounts it to all node pools.

For node-pool-specific configuration, use `nodePools[].additionalConfig`. The operator merges these settings with `spec.general.additionalConfig` for that node pool, with node pool settings taking precedence. When a node pool has `additionalConfig` defined, it receives its own `ConfigMap` containing the merged configuration.

Provide all settings as a map of strings using the flat form. For non-string values (for example, booleans or numbers), enclose them in quotes: `"true"` or `"1234"`.

The operator merges its generated settings with the custom settings you provide. You cannot override basic settings such as `node.name`, `node.roles`, `cluster.name`, and network and discovery settings using `additionalConfig`.

Changing any `additionalConfig` triggers a rolling restart of the cluster. To avoid a restart, use the [Cluster Settings API]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/) to change settings at runtime.
{: .note}

## TLS

For security reasons, encryption is required for communication with the OpenSearch cluster and between cluster nodes. If you do not configure any encryption, OpenSearch uses the included demo TLS certificates, which are not suitable for active deployments.

Depending on your requirements, the operator offers the following ways of managing TLS certificates:

- **Operator-generated certificates (Recommended)**: The operator generates its own Certificate Authority (CA) and signs certificates for all nodes using that CA. Use this option unless you want to directly expose your OpenSearch cluster outside your Kubernetes cluster or your organization has rules about using self-signed certificates for internal communication.
- **Your own certificates**: Supply your own certificates.

When the operator generates certificates, you can control certificate validity using the `duration` field (for example, `"720h"`, `"17520h"`). If omitted, it defaults to one year (`"8760h"`).
{: .note}

TLS certificates are used for the following endpoints (each can be configured independently):

- [Node transport](#node-transport)
- [Node HTTP REST API](#node-http-rest-api)
- [OpenSearch Dashboards HTTP]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-dashboards-config/#opensearch-dashboards-http)

### Node transport

OpenSearch cluster nodes communicate with each other using the OpenSearch transport protocol (port 9300 by default). This endpoint is not exposed externally, so in almost all cases, operator-generated certificates are adequate.

To configure node transport security, you can use the following fields in the `OpenSearchCluster` custom resource:

```yaml
# ...
spec:
  security:
    tls: # Everything related to TLS configuration
      transport: # Configuration of the transport endpoint
        enabled: true # Enable TLS for transport (default: true if transport config exists)
        generate: true # Have the operator generate and sign certificates
        perNode: true # Separate certificate per node
        # How long generated certificates are valid (default: 8760h = 1 year)
        duration: "8760h"
        secret:
          name: # Name of the secret that contains the provided certificate
        caSecret:
          name: # Name of the secret that contains a CA the operator should use
        nodesDn: [] # List of certificate DNs allowed to connect
# ...
```
{% include copy.html %}

To have the operator generate the certificates, set `generate` and `perNode` to `true` (you can omit the other fields). The operator generates a CA certificate, issues one certificate per node, and signs them. Certificates default to one year validity, which you can configure using `duration`. The operator supports rotation by reissuing certificates when near expiry if `rotateDaysBeforeExpiry` is set.

Alternatively, you can provide the certificates yourself (for example, if your organization has an internal CA). You can either provide one certificate to be used by all nodes or provide a certificate for each node (recommended). In this mode, set `generate: false` and `perNode` to `true` or `false` depending on whether you're providing per-node certificates.

If you provide only one certificate, place it in a Kubernetes TLS secret (with the fields `ca.crt`, `tls.key`, and `tls.crt`, all PEM-encoded) and provide the name of the secret as `secret.name`. To keep the CA certificate separate, place it in a separate secret and supply that as `caSecret.name`. If you provide one certificate per node, place all certificates into one secret (including the `ca.crt`) with a `<hostname>.key` and `<hostname>.crt` for each node. The hostname is defined as `<cluster-name>-<nodepool-component>-<index>` (for example, `my-first-cluster-masters-0`).

If you provide the certificates yourself, you must also provide the list of certificate Distinguished Names (DNs) in `nodesDn`. Wildcards can be used (for example, `"CN=my-first-cluster-*,OU=my-org"`).

### Node HTTP REST API

Each OpenSearch cluster node exposes the REST API using HTTPS (by default, at port 9200).

To configure HTTP API security, the following fields in the `OpenSearchCluster` custom resource are available:

```yaml
# ...
spec:
  security:
    tls: # Everything related to TLS configuration
      http: # Configuration of the HTTP endpoint
        enabled: true # Enable TLS for HTTP (default: true if http config exists, false to disable)
        generate: true # Have the operator generate and sign certificates
        customFQDN: "opensearch.example.com" # Optional: Custom FQDN for the certificate
        # How long generated certificates are valid (default: 8760h = 1 year)
        duration: "8760h"
        secret:
          name: # Name of the secret that contains the provided certificate
        caSecret:
          name: # Name of the secret that contains a CA the operator should use
# ...
```
{% include copy.html %}

You can either let the operator generate and sign the certificates or provide your own. The only difference between node transport certificates and node HTTP REST API certificates is that per-node certificates are not supported for HTTP REST API. Otherwise, the two work the same way.

The `enabled` field controls whether TLS is enabled for the HTTP endpoint. If `enabled` is set to `false`, the cluster uses HTTP instead of HTTPS. If `enabled` is `nil` (not set), TLS is enabled by default when the HTTP config exists. To explicitly disable TLS, set `enabled: false`.
{: .note}

When using generated certificates, you can optionally specify a `customFQDN` field to include a custom domain in the certificate's Subject Alternative Names (SAN) alongside the default cluster DNS names.

If you provide your own certificates, add the following names as SAN: `<cluster-name>`, `<cluster-name>.<namespace>`, `<cluster-name>.<namespace>.svc`, `<cluster-name>.<namespace>.svc.cluster.local`.

Directly exposing the node HTTP port outside the Kubernetes cluster is not recommended. Instead, configure an ingress. The ingress can then present a certificate from an accredited CA (for example, Let's Encrypt) and hide self-signed certificates used internally. In this configuration, supply the nodes internally with properly signed certificates.

If you provide your own node certificates, you must also provide an admin cert that the operator can use for managing the cluster:

```yaml
spec:
  security:
    config:
      adminSecret:
        name: my-first-cluster-admin-cert # The secret must have keys tls.crt and tls.key
```
{% include copy.html %}

Make sure the DN of the certificate is set in the `adminDn` field.

## Adding plugins

You can extend the OpenSearch functionality using [plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/plugins/#available-plugins). Commonly used ones are snapshot repository plugins for external backups (for example, to Amazon S3 or Microsoft Azure Blob Storage). The operator supports automatically installing plugins during setup.

To install a plugin for OpenSearch, add it to the `general.pluginsList`:

```yaml
general:
  version: 3.0.0
  httpPort: 9200
  vendor: opensearch
  serviceName: my-cluster
  pluginsList:
    [
      "repository-s3",
      "https://github.com/opensearch-project/opensearch-prometheus-exporter/releases/download/3.0.0.0/prometheus-exporter-3.0.0.0.zip",
    ]
```
{% include copy.html %}

To install a plugin for OpenSearch Dashboards, add it to the `dashboards.pluginsList`:

```yaml
dashboards:
  enable: true
  version: 3.0.0
  pluginsList:
    - sample-plugin-name
```
{% include copy.html %}

To install a plugin for the bootstrap pod, add it to the `bootstrap.pluginsList`:

```yaml
bootstrap:
  pluginsList: ["repository-s3"]
```
{% include copy.html %}

Note the following considerations:

- [Bundled plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/plugins/#bundled-plugins) are installed automatically and do not need to be added to the list.
- You can provide either a plugin name or a complete URL to the plugin ZIP file. The items you provide are passed to the `bin/opensearch-plugin install <plugin-name>` command.
- Updating the plugin list for an already installed cluster triggers a rolling restart of all OpenSearch nodes.
- If your plugin requires additional configuration, provide it in either `additionalConfig` (see [Configuring opensearch.yml](#configuring-opensearchyml)) or as secrets in the OpenSearch keystore (see [Add secrets to keystore](#add-secrets-to-keystore)).

## Add secrets to keystore

Some OpenSearch features (for example, snapshot repository plugins) require sensitive configuration. OpenSearch handles this using the OpenSearch keystore. You can populate this keystore using Kubernetes secrets.

Add the secrets under the `general.keystore` section:

```yaml
general:
  # ...
  keystore:
    - secret:
        name: credentials
    - secret:
        name: some-other-secret
```
{% include copy.html %}

With this configuration, all keys of the secrets become keys in the keystore.

If you only want to load some keys from a secret or rename the existing keys, you can add key mappings as a map:

```yaml
general:
  # ...
  keystore:
    - secret:
        name: many-secret-values
      keyMappings:
        # Only read "sensitive-value" from the secret, keep its name.
        sensitive-value: sensitive-value
    - secret:
        name: credentials
      keyMappings:
        # Renames key accessKey in secret to s3.client.default.access_key in keystore
        accessKey: s3.client.default.access_key
        password: s3.client.default.secret_key
```
{% include copy.html %}

Only provided keys are loaded from the secret. Any keys not specified are ignored.
{: .note}

To populate the keystore of the bootstrap pod, add the secrets under the `bootstrap.keystore` section:

```yaml
bootstrap:
  # ...
  keystore:
    - secret:
        name: credentials
    - secret:
        name: some-other-secret
```
{% include copy.html %}

## SmartScaler

SmartScaler is a mechanism built into the operator that enables nodes to be safely removed from the cluster. When a node is being removed from a cluster, the safe drain process ensures that all of its data is transferred to other nodes in the cluster before the node is taken offline. This prevents any data loss or corruption that could occur if the node were shut down or disconnected without first transferring its data to other nodes.

During the safe drain process, the node being removed is marked as "draining", which means that it no longer receives new requests. Instead, it only processes outstanding requests until its workload is completed. Once all requests are processed, the node begins transferring its data to other nodes in the cluster. The safe drain process continues until all data is transferred and the node is no longer part of the cluster. Only after that does the operator turn down the node.

## Set the Java heap size

To configure the amount of memory allocated to the OpenSearch nodes, set the heap size using the `jvm` field. This operation has no downtime, and the cluster remains operational.

Set the heap size to half of the memory request.
{: .note}

```yaml
spec:
  nodePools:
    - component: nodes
      replicas: 3
      diskSize: "10Gi"
      jvm: -Xmx1024M -Xms1024M
      resources:
        requests:
          memory: "2Gi"
          cpu: "500m"
        limits:
          memory: "2Gi"
          cpu: "500m"
      roles:
        - "data"
```
{% include copy.html %}

If `jvm` is not provided, the Java heap size is set to half of `resources.requests.memory`, which is the recommended value for data nodes.

If `jvm` is not provided and `resources.requests.memory` does not exist, the value is `-Xmx512M -Xms512M`.

## Configure `vm.max_map_count`

OpenSearch requires the Linux kernel `vm.max_map_count` option [to be set to at least 262144]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings). The operator sets this option to `262144` by default using an init container for each OpenSearch pod. If you already set this option on the Kubernetes hosts using `sysctl` and don't want the operator to change it, disable it by adding the following option to your cluster `spec`:

```yaml
spec:
  general:
    setVMMaxMapCount: false
```
{% include copy.html %}

By default, the init container uses a `busybox` image. To change this (for example, to use an image from a private registry), see [Custom init helper]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-kubernetes-custom/#custom-init-helper).

## Configuring snapshot repositories

You can configure snapshot repositories for the OpenSearch cluster using the operator. The `general.snapshotRepositories` field supports multiple snapshot repositories. After configuring a snapshot repository, users can create custom ISM policies in OpenSearch Dashboards to back up indexes.

```yaml
spec:
  general:
    snapshotRepositories:
      - name: my_s3_repository_1
        type: s3
        settings:
          bucket: opensearch-s3-snapshot
          region: us-east-1
          base_path: os-snapshot
      - name: my_s3_repository_3
        type: s3
        settings:
          bucket: opensearch-s3-snapshot
          region: us-east-1
          base_path: os-snapshot_1
```
{% include copy.html %}

### Prerequisites for configuring snapshot repositories

Before configuring `snapshotRepositories` for a cluster, ensure the following prerequisites are met:

1. The appropriate cloud provider native plugins are installed. For example:

   ```yaml
   spec:
     general:
       pluginsList: ["repository-s3"]
   ```
   {% include copy.html %}

2. The required roles/permissions for the backend cloud are pre-created. The following example shows an Amazon Web Services (AWS) Identity and Access Management (IAM) role added for Kubernetes nodes so that snapshots can be published to the `opensearch-s3-snapshot` S3 bucket:

   ```json
   {
     "Statement": [
       {
         "Action": [
           "s3:ListBucket",
           "s3:GetBucketLocation",
           "s3:ListBucketMultipartUploads",
           "s3:ListBucketVersions"
         ],
         "Effect": "Allow",
         "Resource": ["arn:aws:s3:::opensearch-s3-snapshot"]
       },
       {
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:AbortMultipartUpload",
           "s3:ListMultipartUploadParts"
         ],
         "Effect": "Allow",
         "Resource": ["arn:aws:s3:::opensearch-s3-snapshot/*"]
       }
     ],
     "Version": "2012-10-17"
   }
   ```
   {% include copy.html %}
