---
layout: default
title: Agents and Ingestion Tools
nav_order: 100
has_children: false
has_toc: false
---

# Agents and Ingestion Tools

Historically there have been multiple popular agents and ingestion tools that work with Elasticsearch. Some of which are Beats, Logstash, Fluentd, FluentBit, and Open Telemetry. OpenSearch aims to continue to support a broad set of agents and ingestion tools, but not all have been tested or have explicitly added OpenSearch compatibility. To make getting started with OpenSearch easier a [set version YML configuration](https://github.com/opensearch-project/OpenSearch/issues/693) is being added so that you can set OpenSearch 1.x clusters to report open source Elasticsearch 7.10.2. This will enable it to connect with tools that do version checking while need OpenSource compatibilities are added to your tools.


## Compatibility Matrices

So far we have built compatibility matrices for OpenSearch, Elasticsearch OSS 7.x, Open Distro for Elasticsearch (ODFE) 1.x, Logstash OSS 7.x, and Beats OSS 7.x. **This page is a living document. If there are other versions or software you would like to add to the page please [submit a PR](https://github.com/opensearch-project/documentation-website/edit/main/docs/agents-and-ingestion-tools/index.md) that includes them and feel free to add yourself to the Credits and Thanks you at the bottom of the page. We greatly appreciate the help!** 

Note that if a cell in any of the matrices is *italicized* that means the value is theoretically what it should be based on other documentation or release notes, but it is still pending testing. Also note that for Logstash we have included a column for version 7.13.x with the [planned OpenSearch output plugin](https://github.com/opensearch-project/OpenSearch/issues/820).

### Compatibility Matrix for Logstash

|	|Logstash OSS 7.x to 7.11.x*	|Logstash OSS 7.12.x**	|Logstash 7.13.x without OpenSearch output plugin^	|Logstash 7.13.x with OpenSearch output plugin***^	|
|---	|---	|---	|---	|---	|
|Elasticsearch OSS v7.x to v7.9.x	|*Yes*	|*Yes*	|*No*	|*Yes*	|
|Elasticsearch OSS v7.10.2^	|*Yes*	|*Yes*	|*No*	|*Yes*	|
|ODFE OSS v1.x to 1.12	|*Yes*	|*Yes*	|*No*	|*Yes*	|
|ODFE 1.13^	|*Yes*	|*Yes*	|*No*	|*Yes*	|
|Amazon Elasticsearch Service 7.x to 7.9	|Yes	|Yes	|*No*	|*Yes*	|
|Amazon Elasticsearch Service 7.10^	|Yes	|Yes	|*No*	|*Yes*	|
|Amazon Elasticsearch Service 7.x to 7.9 with IAM	|[Yes with Amazon ES output plugin](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-managedomains-logstash.html)	|[Yes with Amazon ES output plugin](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-managedomains-logstash.html)	|No	|*Yes*	|
|Amazon Elasticsearch Service 7.10 with IAM^	|[Yes with Amazon ES output plugin](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-managedomains-logstash.html)	|[Yes with Amazon ES output plugin](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-managedomains-logstash.html)	|No	|*Yes*	|
|OpenSearch 1.0^	|[Yes via version setting](https://github.com/opensearch-project/OpenSearch/issues/693)	|[Yes via version setting](https://github.com/opensearch-project/OpenSearch/issues/693)	|*No*	|*Yes*	|

\*Beats OSS includes all Apache 2.0 Beats agents (Filebeat, Metricbeat, Auditbeat, Heartbeat, Winlogbeat, Packetbeat)\
\*\*Most current compatible version with Elasticsearch OSS\
\*\*\*Planning to build\
^ Most current version of software\
*Italicized cells are based on documentation or release notes but are still pending testing to validate*

### Compatibility Matrix for Beats

|	|Beats OSS 7.x to 7.11.x*	|Beats OSS 7.12.x**	|Beats 7.13.x^	|
|---	|---	|---	|---	|
|Elasticsearch OSS v7.x to v7.9.x	|*Yes*	|*Yes*	|No	|
|Elasticsearch OSS v7.10.2^	|*Yes*	|*Yes*	|No	|
|ODFE OSS v1.x to 1.12	|*Yes*	|*Yes*	|No	|
|ODFE 1.13^	|*Yes*	|*Yes*	|No	|
|Amazon Elasticsearch Service 7.x to 7.9	|*Yes*	|*Yes*	|No	|
|Amazon Elasticsearch Service 7.10^	|*Yes*	|*Yes*	|No	|
|OpenSearch 1.0^	|[Yes via version setting](https://github.com/opensearch-project/OpenSearch/issues/693)	|[Yes via version setting](https://github.com/opensearch-project/OpenSearch/issues/693)	|No	|
|Logstash OSS 7.x to 7.11.x*	|*Yes*	|*Yes*	|*Yes*	|
|Logstash OSS 7.12.x**	|*Yes*	|*Yes*	|*Yes*	|
|Logstash 7.13.x with OpenSearch output plugin	|*Yes*	|*Yes*	|*Yes*	|

\*Beats OSS includes all Apache 2.0 Beats agents (Filebeat, Metricbeat, Auditbeat, Heartbeat, Winlogbeat, Packetbeat)\
\*\*Most current compatible version with Elasticsearch OSS\
^ Most current version of software\
*Italicized cells are based on documentation or release notes but are still pending testing to validate*

### Credits and Thank You for Contributing and Testing

* [VijayanB](https://github.com/VijayanB)
* [vamshin](https://github.com/vamshin)
* [anirudha](https://github.com/anirudha)
