---
layout: default
title: Forecasting
nav_order: 81
has_children: true
---

# Forecasting

Forecasting in OpenSearch transforms any time-series field into a self-updating signal using the Random Cut Forest (RCF) model. RCF is an online learning model that updates incrementally with each new data point. Because RCF refreshes in real time, it adapts instantly to changes in technical conditions without requiring costly batch retraining. Each model uses only a small amount of storage—-typically a few hundred kilobytes—-so both compute and storage overhead remain low.

Pair forecasting with the [Alerting plugin]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/) to receive a notification the moment a forecasted value is predicted to breach your threshold.
{: .note}

## Benefits

Forecasting with OpenSearch offers the following benefits:

- **Robust against non-linear regime shifts and benign spikes** – Traditional models such as ARIMA, Holt-Winters, and SARIMA assume fixed parametric forms (linear or piecewise linear equations). These models require frequent re-fitting or full retraining when the underlying data distribution changes, such as during holiday surges, flash sales, or sensor drift. In contrast, RCF is non-parametric and distribution-agnostic. It incrementally updates its random-cut trees with each new data point, instantly reshaping forecasts without retraining. Short-lived anomalies (such as social media spikes) and persistent shifts are naturally distinguished. The following image demonstrates RCF's ability to recalibrate rapidly after a sudden level shift, as demonstrated by spikes at Index (time) 65 recalibrating to normal by index (time) 100:

  <img src="{{site.url}}{{site.baseurl}}/images/forecast/no_rcf_calibration.png" alt="Forecast from old date" width="1600" height="1600">

- **Streaming-first and inference-efficient compared to large language model (LLM) approaches** – Foundation-model forecasters retain fixed weights after pretraining. At prediction time, they must ingest the entire—or at least a long—history window for every series, which requires large GPU memory and results in higher latency and cost. In contrast, RCF maintains only a small state per series, updates in `O(log n)` time on a CPU, and produces forecasts in milliseconds—no GPUs or large context windows required.

- **Scales to millions of series** – High-cardinality mode can manage up to 1 million lightweight RCF models across a cluster. This enables operations teams to monitor large sets of entities and trigger alerts as soon as any individual metric deviates from expected behavior.

- **Cold-start friendly (minimal history required)** – Seasonal models such as SARIMA require multiple complete cycles of data (for example, weeks of daily data) before detecting seasonality. RCF can generate meaningful forecasts using only a small number of points—often a single shingle window—allowing new sensors or entities to benefit from forecasts on day one.

- **Incremental learning without retraining** – Many time-series models require periodic full retraining to remain accurate. RCF avoids this overhead by performing lightweight tree updates with each new data point. The model stays current, delivering real-time accuracy without the latency or compute costs of scheduled retraining.


<!----This feels like blog content---->

## Typical use-case

Forecasting can be used in the following use cases, separated by their technical domains:

| Domain | What you forecast | Operational benefit |
|--------|-------------------|---------------|
| Predictive maintenance | Future temperature, vibration, or error counts per machine | Replace parts before failure to avoid unplanned downtime. |
| Network forecasting | Future throughput, latency, or connection counts per node | Allocate bandwidth early to meet service-level agreement (SLA) targets. |
| Capacity and cost optimization | Future CPU, RAM, or disk usage per microservice | Rightsize hardware and autoscale efficiently. |
| Financial and operational planning | Future order volume, revenue, or ad spend efficiency | Align staffing and budgets with demand signals. |





