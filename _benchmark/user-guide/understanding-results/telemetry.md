---
layout: default
title: Enabling telemetry devices
nav_order: 30
grand_parent: User guide
parent: Understanding results
redirect_from: 
  - /benchmark/user-guide/telemetry
canonical_url: https://docs.opensearch.org/latest/benchmark/user-guide/understanding-results/telemetry/
---

# Enabling telemetry devices

Telemetry results will not appear in the summary report. To visualize telemetry results, ingest the data into OpenSearch and visualize the data in OpenSearch Dashboards. 

To view a list of the available telemetry devices, use the command `opensearch-benchmark list telemetry`. After you've selected a [supported telemetry device]({{site.url}}{{site.baseurl}}/benchmark/reference/telemetry/), you can activate the device when running a tests with the `--telemetry` command flag. For example, if you want to use the `jfr` device with the `geonames` workload, enter the following command:

```json
opensearch-benchmark workload --workload=geonames --telemetry=jfr
```
{% include copy-curl.html %}

