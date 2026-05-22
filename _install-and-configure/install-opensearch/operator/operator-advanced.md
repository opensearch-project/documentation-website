---
layout: default
title: Advanced management
parent: OpenSearch Kubernetes Operator
grand_parent: Installing OpenSearch
nav_order: 70
---

# Advanced management

This page covers advanced cluster management features including monitoring, Index State Management (ISM) policies, index and component templates, and snapshot policies.

## OpenSearch monitoring

You can install and enable the [Prometheus exporter plugin for OpenSearch](https://github.com/opensearch-project/opensearch-prometheus-exporter) on your cluster. When enabled, the operator installs the plugin into the OpenSearch pods and generates a Prometheus `ServiceMonitor` object to configure the plugin for scraping.

By default, the admin user is used to access the monitoring API. To use a separate user with limited permissions, create that user using one of the following options:

- Create a user using the OpenSearch API or Dashboards, create a Kubernetes secret with `username` and `password` keys, and provide that secret name in the `monitoringUserSecret` field.
- Use the `OpenSearchUser` CRD to create the user and provide the secret in the `monitoringUserSecret` field. For more information, see [User and role management]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-security/).

To configure monitoring, add the following fields to your cluster `spec`:

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchCluster
metadata:
  name: my-first-cluster
  namespace: default
spec:
  general:
    version: <YOUR_CLUSTER_VERSION>
    monitoring:
      enable: true # Enable or disable the monitoring plugin
      labels: # The labels added to the ServiceMonitor
        someLabelKey: someLabelValue
      scrapeInterval: 30s # The scrape interval for Prometheus
      monitoringUserSecret: monitoring-user-secret # Optional, name of a secret with username/password for Prometheus to access the plugin metrics endpoint with, defaults to the admin user
      pluginUrl: https://github.com/opensearch-project/opensearch-prometheus-exporter/releases/download/<YOUR_CLUSTER_VERSION>.0/prometheus-exporter-<YOUR_CLUSTER_VERSION>.0.zip # Optional, custom URL for the monitoring plugin
      tlsConfig: # Optional, use this to override the tlsConfig of the generated ServiceMonitor, only the following provided options can be set currently
        serverName: "testserver.test.local"
        insecureSkipVerify: true # The operator currently does not allow configuring the ServiceMonitor with certificates, so this needs to be set
  # ...
```
{% include copy.html %}

## Managing ISM policies with Kubernetes resources

The operator provides a custom Kubernetes resource that lets you create, update, or manage ISM policies using Kubernetes objects.

Fields in the CRD directly map to the OpenSearch ISM policy structure. The operator does not modify policies that already exist. You can create an example policy as follows:

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchISMPolicy
metadata:
  name: sample-policy
spec:
  opensearchCluster:
    name: my-first-cluster
  description: Hot-warm-delete lifecycle policy
  policyId: sample-policy
  defaultState: hot
  states:
    - name: hot
      actions:
        - replicaCount:
            numberOfReplicas: 4
      transitions:
        - stateName: warm
          conditions:
            minIndexAge: "10d"
    - name: warm
      actions:
        - replicaCount:
            numberOfReplicas: 2
      transitions:
        - stateName: delete
          conditions:
            minIndexAge: "30d"
    - name: delete
      actions:
        - delete: {}
```
{% include copy.html %}

The `OpenSearchISMPolicy` must be created in the same namespace as the OpenSearch cluster. The `policyId` field is optional; if not provided, the operator uses `metadata.name`.

## Managing index and component templates

The operator provides the `OpensearchIndexTemplate` and `OpensearchComponentTemplate` CRDs for managing index and component templates.

The two CRD specifications closely mirror the OpenSearch API structure with some field name changes from `snake_case` to `camelCase`:

- `index_patterns` → `indexPatterns` (`OpensearchIndexTemplate` only)
- `composed_of` → `composedOf` (`OpensearchIndexTemplate` only)
- `template.aliases.<alias>.is_write_index` → `template.aliases.<alias>.isWriteIndex`

The following example creates a component template that sets the number of shards and replicas and specifies a time format for documents:

```yaml
apiVersion: opensearch.org/v1
kind: OpensearchComponentTemplate
metadata:
  name: sample-component-template
spec:
  opensearchCluster:
    name: my-first-cluster

  template: # required
    aliases: # optional
      my_alias: {}
    settings: # optional
      number_of_shards: 2
      number_of_replicas: 1
    mappings: # optional
      properties:
        timestamp:
          type: date
          format: yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis
        value:
          type: double
  version: 1 # optional
  _meta: # optional
    description: example description
```
{% include copy.html %}

The following index template uses the component template defined earlier (see `composedOf`) for all indexes matching the `logs-2020-01-*` pattern:

```yaml
apiVersion: opensearch.org/v1
kind: OpensearchIndexTemplate
metadata:
  name: sample-index-template
spec:
  opensearchCluster:
    name: my-first-cluster

  name: logs_template # name of the index template - defaults to metadata.name. Can't be updated in-place

  indexPatterns: # required index patterns
    - "logs-2020-01-*"
  composedOf: # optional
    - sample-component-template
  priority: 100 # optional

  template: {} # optional
  version: 1 # optional
  _meta: {} # optional
```
{% include copy.html %}

The `.spec.name` field of the index template is immutable and cannot be changed after deployment.
{: .note}

## Apply ISM policies to existing indexes

To apply an ISM policy to existing indexes in the OpenSearch cluster, set the `applyToExistingIndices` flag to `true` in the `OpenSearchISMPolicy` CRD:

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchISMPolicy
metadata:
  name: test-policy-apply
spec:
  opensearchCluster:
    name: opensearch-cluster
  applyToExistingIndices: true
  description: "ISM policy applied to existing indexes"
  defaultState: "hot"
  ismTemplate:
    indexPatterns:
      - "logs-*"
  states:
    - name: hot
      actions:
        - replicaCount:
            numberOfReplicas: 2
      transitions:
        - stateName: warm
          conditions:
            minIndexAge: "1d"
    - name: warm
      actions:
        - replicaCount:
            numberOfReplicas: 1
```
{% include copy.html %}

The `applyToExistingIndices` field defaults to `false` if omitted.
{: .note}

When set to `true`, the operator applies the ISM policy to all existing indexes matching the specified index pattern. If multiple ISM policies target the same index pattern with this flag enabled, each policy must have a different priority.

## Managing snapshot policies with Kubernetes resources

The operator provides a custom Kubernetes resource to create, update, and manage Snapshot Lifecycle Management (SLM) policies using Kubernetes manifests. This allows you to declaratively define and control snapshot policies alongside your cluster resources.

Fields in the CRD map directly to the OpenSearch snapshot policy structure. The operator does not modify policies that already exist. You can define a new policy using the following example:

```yaml
apiVersion: opensearch.org/v1
kind: OpensearchSnapshotPolicy
metadata:
  name: sample-policy
  namespace: default
spec:
  policyName: sample-policy
  enabled: true
  description: Daily snapshot policy with weekly retention
  opensearchCluster:
    name: my-first-cluster
  creation:
    schedule:
      cron:
        expression: "0 0 * * *"
        timezone: "UTC"
    timeLimit: "1h"
  deletion:
    schedule:
      cron:
        expression: "0 1 * * *"
        timezone: "UTC"
    timeLimit: "30m"
    deleteCondition:
      maxAge: "7d"
      maxCount: 10
      minCount: 3
  snapshotConfig:
    repository: sample-repository
    indices: "*"
    includeGlobalState: true
    ignoreUnavailable: false
    partial: false
    dateFormat: "yyyy-MM-dd-HH-mm"
    dateFormatTimezone: "UTC"
    metadata:
      createdBy: "sample-operator"
```
{% include copy.html %}

Note the following considerations:

- The `OpensearchSnapshotPolicy` must be created in the same namespace as the OpenSearch cluster it targets.
- `policyName` is optional. If not provided, the operator uses `metadata.name`.
- The `repository` field must reference an existing snapshot repository configured in the OpenSearch cluster. For information about configuring snapshot repositories, see [Configuring snapshot repositories]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-opensearch-config/#configuring-snapshot-repositories).
{: .note}
