---
layout: default
title: Agents and ingestion tools
nav_order: 100
has_children: false
has_toc: false
redirect_from:
  - /clients/agents-and-ingestion-tools/
canonical_url: https://docs.opensearch.org/latest/tools/
---

# Agents and ingestion tools

Historically, many multiple popular agents and ingestion tools have worked with Elasticsearch OSS, such as Beats, Logstash, Fluentd, FluentBit, and OpenTelemetry. OpenSearch aims to continue to support a broad set of agents and ingestion tools, but not all have been tested or have explicitly added OpenSearch compatibility.

As an intermediate compatibility solution, OpenSearch has a setting that instructs the cluster to return version 7.10.2 rather than its actual version.

If you use clients that include a version check, such as recent versions of Logstash OSS or Filebeat OSS, enable the setting:

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


## Downloads

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

| | Logstash OSS 7.x to 7.11.x | Logstash OSS 7.12.x\* | Logstash 7.13.x without OpenSearch output plugin | Logstash 7.13.x with OpenSearch output plugin |
| :---| :--- | :--- | :--- | :--- |
| Elasticsearch OSS 7.x to 7.9.x | *Yes* | *Yes* | *No* | *Yes* |
| Elasticsearch OSS 7.10.2 | *Yes* | *Yes* | *No* | *Yes* |
| ODFE 1.x to 1.12 | *Yes* | *Yes* | *No* | *Yes* |
| ODFE 1.13 | *Yes* | *Yes* | *No* | *Yes* |
| OpenSearch 1.0 | Yes via version setting | Yes via version setting | *No* | *Yes* |

\* Most current compatible version with Elasticsearch OSS.


### Compatibility Matrix for Beats

| | Beats OSS 7.x to 7.11.x\*\* | Beats OSS 7.12.x\* | Beats 7.13.x |
| :--- | :--- | :--- | :--- |
| Elasticsearch OSS 7.x to 7.9.x | *Yes* | *Yes* | No |
| Elasticsearch OSS 7.10.2 | *Yes* | *Yes* | No |
| ODFE 1.x to 1.12 | *Yes* | *Yes* | No |
| ODFE 1.13 | *Yes* | *Yes* | No |
| OpenSearch 1.0 | Yes via version setting | Yes via version setting | No |
| Logstash OSS 7.x to 7.11.x | *Yes* | *Yes* | *Yes* |
| Logstash OSS 7.12.x\* | *Yes* | *Yes* | *Yes* |
| Logstash 7.13.x with OpenSearch output plugin | *Yes* | *Yes* | *Yes* |

\* Most current compatible version with Elasticsearch OSS.

\*\* Beats OSS includes all Apache 2.0 Beats agents (i.e. Filebeat, Metricbeat, Auditbeat, Heartbeat, Winlogbeat, Packetbeat).
