---
layout: default
title: Tools
nav_order: 50
has_children: false
redirect_from:
  - /clients/agents-and-ingestion-tools/
canonical_url: https://docs.opensearch.org/latest/tools/
---

# OpenSearch tools

This section provides documentation for OpenSearch-supported tools, including:

- [Agents and ingestion tools](#agents-and-ingestion-tools)
- [OpenSearch CLI](#opensearch-cli)
- [OpenSearch Kubernetes operator](#opensearch-kubernetes-operator)

## Agents and ingestion tools

Historically, many multiple popular agents and ingestion tools have worked with Elasticsearch OSS, such as Beats, Logstash, Fluentd, FluentBit, and OpenTelemetry. OpenSearch aims to continue to support a broad set of agents and ingestion tools, but not all have been tested or have explicitly added OpenSearch compatibility.

As an intermediate compatibility solution, OpenSearch has a setting that instructs the cluster to return version 7.10.2 rather than its actual version.

If you use clients that include a version check, such as versions of Logstash OSS or Filebeat OSS between 7.x - 7.12.x, enable the setting:

```json
PUT _cluster/settings
{
  "persistent": {
    "compatibility": {
      "override_main_response_version": true
    }
  }
}
```

[Just like any other setting]({{site.url}}{{site.baseurl}}/opensearch/configuration/), the alternative is to add the following line to `opensearch.yml` on each node and then restart the node:

```yml
compatibility.override_main_response_version: true
```

Logstash OSS 8.0 introduces a breaking change where all plugins run in ECS compatibility mode by default. If you use a compatible [OSS client](#compatibility-matrices) you must override the default value to maintain legacy behavior:

```yml
ecs_compatibility => disabled
```

### Downloads

You can download the OpenSearch output plugin for Logstash from [OpenSearch downloads](https://opensearch.org/downloads.html). The Logstash output plugin is compatible with OpenSearch and Elasticsearch OSS (7.10.2 or lower).

These are the latest versions of Beats OSS with OpenSearch compatibility. For more information, see the [compatibility matrices](#compatibility-matrices).

- [Filebeat OSS 7.12.1](https://www.elastic.co/downloads/past-releases/filebeat-oss-7-12-1)
- [Metricbeat OSS 7.12.1](https://www.elastic.co/downloads/past-releases/metricbeat-oss-7-12-1)
- [Packetbeat OSS 7.12.1](https://www.elastic.co/downloads/past-releases/packetbeat-oss-7-12-1)
- [Heartbeat OSS 7.12.1](https://elastic.co/downloads/past-releases/heartbeat-oss-7-12-1)
- [Winlogbeat OSS 7.12.1](https://www.elastic.co/downloads/past-releases/winlogbeat-oss-7-12-1)
- [Auditbeat OSS 7.12.1](https://elastic.co/downloads/past-releases/auditbeat-oss-7-12-1)

Some users report compatibility issues with ingest pipelines on these versions of Beats. If you use ingest pipelines with OpenSearch, consider using the 7.10.2 versions of Beats instead.
{: .note }


## Compatibility Matrices

*Italicized* cells are untested, but indicate what a value theoretically should be based on existing information.


### Compatibility Matrix for Logstash

| | Logstash OSS 7.0.0 to 7.11.x | Logstash OSS 7.12.x\* | Logstash 7.13.x-7.16.x without OpenSearch output plugin | Logstash 7.13.x-7.16.x with OpenSearch output plugin | Logstash 8.x+ with OpenSearch output plugin 
| :---| :--- | :--- | :--- | :--- | :--- |
| Elasticsearch OSS 7.0.0 to 7.9.x | *Yes* | *Yes* | *No* | *Yes* | *Yes* |
| Elasticsearch OSS 7.10.2 | *Yes* | *Yes* | *No* | *Yes* | *Yes* |
| ODFE 1.0 to 1.12 | *Yes* | *Yes* | *No* | *Yes* | *Yes* |
| ODFE 1.13 | *Yes* | *Yes* | *No* | *Yes* | *Yes* |
| OpenSearch 1.x to 2.x | Yes via version setting | Yes via version setting | *No* | *Yes* | Yes, with Elastic Common Schema Setting |

\* Most current compatible version with Elasticsearch OSS.


### Compatibility Matrix for Beats

| | Beats OSS 7.0.0 to 7.11.x\*\* | Beats OSS 7.12.x\* | Beats 7.13.x |
| :--- | :--- | :--- | :--- |
| Elasticsearch OSS 7.0.0 to 7.9.x | *Yes* | *Yes* | No |
| Elasticsearch OSS 7.10.2 | *Yes* | *Yes* | No |
| ODFE 1.0 to 1.12 | *Yes* | *Yes* | No |
| ODFE 1.13 | *Yes* | *Yes* | No |
| OpenSearch 1.x to 2.x | Yes via version setting | Yes via version setting | No |
| Logstash OSS 7.0.0 to 7.11.x | *Yes* | *Yes* | *Yes* |
| Logstash OSS 7.12.x\* | *Yes* | *Yes* | *Yes* |
| Logstash 7.13.x with OpenSearch output plugin | *Yes* | *Yes* | *Yes* |

\* Most current compatible version with Elasticsearch OSS.

\*\* Beats OSS includes all Apache 2.0 Beats agents (i.e. Filebeat, Metricbeat, Auditbeat, Heartbeat, Winlogbeat, Packetbeat).

Beats versions newer than 7.12.x are not supported by OpenSearch. If you must update the Beats agent(s) in your environment to a newer version, you can work around the incompatibility by directing traffic from Beats to Logstash and using the Logstash Output plugin to ingest the data to OpenSearch.
{: .warning }

## OpenSearch CLI

The OpenSearch CLI command line interface (opensearch-cli) lets you manage your OpenSearch cluster from the command line and automate tasks. For more information on OpenSearch CLI, see [OpenSearch CLI]({{site.url}}{{site.baseurl}}/tools/cli/).

## OpenSearch Kubernetes operator

The OpenSearch Kubernetes (K8s) Operator is an open-source kubernetes operator that helps automate the deployment and provisioning of OpenSearch and OpenSearch Dashboards in a containerized environment. For information on how to use the K8s operator, see [OpenSearch Kubernetes operator]({{site.url}}{{site.baseurl}}/tools/k8s-operator/)