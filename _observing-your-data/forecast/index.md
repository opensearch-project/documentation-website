---
layout: default
title: Forecasting
nav_order: 81
has_children: true
redirect_from:
  - /observing-your-data/forecast/
---

# Forecasting

Forecasting in OpenSearch transforms any time-series field into a self-updating signal using the Random Cut Forest (RCF) model. RCF is an online learning model that updates incrementally with each new data point. Because RCF refreshes in real time, it adapts instantly to changes in technical conditions without requiring costly batch retraining. Each model uses only a small amount of storage—typically a few hundred kilobytes—so both compute and storage overhead remain low.

Pair forecasting with the [Alerting plugin]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/) to receive a notification the moment a forecasted value is predicted to breach your threshold.
{: .note}

## Typical use case

Forecasting can be used for the following use cases.

| Domain | What you forecast | Operational benefit |
|--------|-------------------|---------------|
| Predictive maintenance | Future temperature, vibration, or error counts per machine | Replace parts before failure to avoid unplanned downtime. |
| Network forecasting | Future throughput, latency, or connection counts per node | Allocate bandwidth early to meet service-level agreement (SLA) targets. |
| Capacity and cost optimization | Future CPU, RAM, or disk usage per microservice | Rightsize hardware and autoscale efficiently. |
| Financial and operational planning | Future order volume, revenue, or ad spend efficiency | Align staffing and budgets with demand signals. |





