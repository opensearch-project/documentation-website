---
layout: default
title: Forecasting
nav_order: 81
has_children: true
---

# Forecasting

Forecasting in OpenSearch turns any time-series field into a living, self-updating signal.  At its core is Random Cut Forest (RCF)—an online learning model that updates incrementally with every new data point. Because RCF refreshes on the fly, it adapts instantly to regime shifts
without costly batch retraining, and each model stays tiny—typically a few hundred KB—so compute and storage overhead remain low.

Pair forecasting with the [Alerting plugin]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/) to receive a notification the moment a forecasted value is predicted to breach your threshold.
{: .note}

---

## Why another forecasting product?

* **Robust to non-linear regime shifts and benign spikes** – Traditional models (ARIMA, Holt-Winters, SARIMA) assume a fixed parametric form (linear or piecewise linear equations), and therefore must incrementally re-fit or even entirely retrain when the underlying data distribution shifts significantly, such as during holiday surges, flash sales, or sensor drift. By contrast, RCF is inherently non-parametric and distribution-agnostic. It incrementally updates its random-cut trees with each new data point, immediately reshaping forecasts without costly retraining. Thus, short-lived anomalies (e.g., social-media spikes) and persistent data shifts ("new normals") are distinguished naturally and instantaneously. The figure below demonstrates RCF's rapid re-calibration after a sudden level shift:

  <img src="{{site.url}}{{site.baseurl}}/images/forecast/no_rcf_calibration.png" alt="forecast from old date" width="1600" height="1600">

* **Streaming-first and inference-cheap versus LLM approaches** – Foundation-model forecasters keep their weights frozen after pre-training; at prediction time they must ingest the entire—or at least a very long—history window for every series. That means GPU memory, high latency, and cost scale with history length and cardinality. RCF, by contrast, carries only a tiny state (a few hundred KB) per series, updates it in `O(log n)` time on a CPU, and produces forecasts in milliseconds—no massive context push, no GPUs.

* **Scales to millions of series** – High-cardinality mode spins up to **1 million** lightweight RCF models across a cluster. That lets Ops teams monitor vast entity sets and alert as soon as any individual metric drifts out of bounds.

* **Cold-start friendly (minimal history required)** – Seasonal models such as SARIMA must first witness several complete cycles (think weeks of daily data or years of annual patterns) before they can even guess at seasonality. RCF, in contrast, needs only a handful of points—often a single shingle window—to lock onto the signal. A brand-new sensor or customer therefore gains meaningful forecasts from its very first day.

* **Incremental learning instead of costly retraining** – Many time-series models hold accuracy for just a few predictions, forcing expensive full retrains every few minutes. RCF sidesteps that churn: each new data point triggers a lightweight O(log n) tree update, instantly folding the observation into the model. The forest is always current, delivering real-time accuracy without the compute and latency penalties of periodic bulk retraining.

---

## Typical use-case

| Domain | What you forecast | Why it matters |
|--------|-------------------|----------------|
| **Predictive Maintenance** | Future temperature, vibration, or error counts per machine | Swap parts before failure, avoiding unplanned downtime. |
| **Network Forecasting** | Future throughput, latency, or connection counts per node | Allocate bandwidth early and meet SLA targets. |
| **Capacity & Cost Optimization** | Future CPU/RAM/disk usage per microservice | Rightsize hardware and autoscale smoothly. |
| **Financial & Operational Planning** | Future order volume, revenue, or ad-spend efficiency | Align staffing and budgets with real demand signals. |

---

## Getting started with forecasting in OpenSearch Dashboards

To get started, go to OpenSearch Dashboards Side Panel, and click Forecasting.

## Step 1: Define a forecaster

A **forecaster** is a single forecasting task. You can create many forecasters and run them in parallel, each one analyzing a different data source. Follow these steps to define a new forecaster:

1. In the **forecaster list**, choose **Create forecaster**.

2. **Define data source**  
   * **Name** – Enter a unique, descriptive name, for example `requests-10min`.  
   * **Description** – Summarize the goal, for example `Forecast total request count every 10 minutes`.  
   * **Indexes** – Select one or more indexes, index patterns, or aliases. Remote indexes are supported through cross-cluster search (`cluster-name:index-pattern`). See [Cross-cluster search]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/) for details. If the Security plugin is enabled, see [Selecting remote indexes with fine-grained access control]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/security/#selecting-remote-indexes-with-fine-grained-access-control) in the **Forecasting security** documentation.

3. **Filter data** (optional)  
   * Choose **Add data filter** to set **Field**, **Operator**, and **Value**, **or** choose **Use query DSL** to supply a [a boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/).  
   * Example DSL filter that matches three URL paths:  

     ```json
     {
       "bool": {
         "should": [
           { "term": { "urlPath.keyword": "/domain/{id}/short" } },
           { "term": { "urlPath.keyword": "/sub_dir/{id}/short" } },
           { "term": { "urlPath.keyword": "/abcd/123/{id}/xyz" } }
         ]
       }
     }
     ```

4. **Timestamp field** – Pick the field that stores event time.

5. **Indicator (metric)** – Add one indicator (only one per forecaster is allowed for accuracy).  
   * Select an aggregation: `average()`, `count()`, `sum()`, `min()`, or `max()`.  
   * Alternatively, you can define a custom aggregation query using [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/). To use a custom query, select Custom expression under the **Forecast based on** option instead of Field value. Here's an example indicator query that forecasts the number of unique accounts matching a specific account type:

   ```json
   {
    "blah_unique_accounts": {
        "filter": {
            "bool": {
                "must": [
                    {
                        "wildcard": {
                            "accountType": {
                                "wildcard": "*blah*",
                                "boost": 1
                            }
                        }
                    }
                ],
                "adjust_pure_negative": true,
                "boost": 1
            }
        },
        "aggregations": {
            "uniqueAccounts": {
                "cardinality": {
                    "field": "account"
                }
            }
        }
    }
   }
   ```

6. **Categorical fields** (optional) – Enable **Split time series using categorical fields** to create entity-level forecasts (for example by IP address, product ID, or country code).  

   Only a limited number of unique entities can be cached in memory. Estimate the supported total with:

   ```
   (data nodes × heap size × plugins.forecast.model_max_size_percent)
   ──────────────────────────────────────────────────────────────────
                 entity-model size (MB)
   ```

   For the entity-model size, call the [Profile Forecaster API]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/#profile-forecaster). You can raise or lower the memory ceiling with the `plugins.forecast.model_max_size_percent` setting.

   **Example** – A cluster with three data nodes, each with 8 GB JVM heap and the default 10 % model memory:

   ```
   (8096 MB × 0.10 ÷ 1 MB) × 3 nodes ≈ 2429 entities
   ```

   Forecaster caches models for the most frequent and recently observed entities within available memory limits. Additional entity models are loaded from indexes at each interval on a best-effort basis, without a guaranteed SLA. Always validate your memory estimates using a representative workload. For detailed insights, see the blog post  *[Improving Anomaly Detection: One Million Entities in One Minute](https://opensearch.org/blog/one-million-enitities-in-one-minute/)*. Although focused on anomaly detection, the guidance applies equally to forecasting, as both share the same underlying RCF model architecture.

## Step 2: Add model parameters
The "Suggest parameters" button on the Dashboards suggests sensible defaults after it profiles recent history, but you can override:

* **Forecasting Interval** – Aggregation bucket (e.g., 10 m). Longer buckets smooth out noise and reduce compute cost but slow alerting. Shorter buckets surface shifts sooner but run more frequently, consume more resources, and are noisier. Pick the shortest interval that still yields a stable signal.
* **Window Delay** This value tells the forecaster that the data is not ingested into OpenSearch in real time but with a certain delay. Set the window delay to shift the forecaster interval to account for this delay. For example, the forecasting interval is 10 minutes and data is ingested into your cluster with a general delay of 1 minute. Assume the forecaster runs at 2:00. The forecaster attempts to get the last 10 minutes of data from 1:50 to 2:00, but because of the 1-minute delay, it only gets 9 minutes of data and misses the data from 1:59 to 2:00. Setting the window delay to 1 minute shifts the interval window to 1:49--1:59, so the forecaster accounts for all 10 minutes of the forecaster interval time.
    * To avoid missing any data, set the **Window delay** to the upper limit of the expected ingestion delay. This ensures that the forecaster captures all data during its interval, reducing the risk of missing relevant information. While a longer window delay helps capture all data, too long of a window delay can hinder real-time forecasting because the forecaster will look further back in time. Find a balance that maintains both data accuracy and timely forecasting.
* **Horizon** – Specifies the number of future buckets to predict. Forecast skill decays with lead time—the 100th step is considerably less reliable than the first. Therefore, request only the forecast window that is operationally necessary to avoid relying on low-confidence projections.
* **History** - Number of historical points used for the initial (cold-start) model, capped at 10,000. More history improves model accuracy up to that limit.

The **Advanced** panel stays tucked away until you click the little caret, and that is intentional: users do just fine with the defaults. If, however, you need finer control, expanding the panel reveals three related knobs—**Shingle size**, **Suggested seasonality**, and **Recency emphasis**—that let you tune how the forecaster balances short-term turbulence against long-term rhythm.

Start with **Shingle size**, which tells the model how many recent intervals should weigh heavily when it projects the next point. Think of it as the model's memory span. The forecaster accepts any integer between 4 and 128 and defaults to 8. A small shingle makes the model nimble—ideal when your signal spikes and dips without an obvious pattern. A large shingle slows the model down, stabilising it around strong, extended cycles. If you already know your series' seasonality, you can leave this field blank; the system will compute a sensible value for you based on the **Suggested seasonality** you supply.

**Suggested seasonality** itself is simply the length, in intervals, of one full cycle—say, 24 intervals for hourly data with a daily rhythm. The valid range is 8 to 256.

Finally, **Recency emphasis** governs how fast the model forgets. [Classic moving averages](https://en.wikipedia.org/wiki/Moving_average) drop each data point abruptly after a fixed window; by contrast, our Random Cut Forest lets every point fade out gradually, using an exponential decay curve. The recency-emphasis value is the mean "lifetime" of that curve, measured in intervals. At the default of 2560, older observations linger a long time—great for steady signals. Dial the number down to make the model more reactive, but beware of chasing noise. Any value ≥ 1 is valid.

Unless your data or business case demands otherwise, the defaults—Shingle size 8, no explicit seasonality, and Recency emphasis 2560—provide a balanced, well-tested starting point. Feel free to experiment, but know that leaving the panel untouched is safe.

### How the system chooses a shingle size for you  

Leave the **Shingle size** box empty and the forecaster runs a quick three-step check:

1. **Start at the factory default (8).**  
2. **Bump up if you provided a seasonality.**  
   Half of the season length replaces the default if it is larger.  
3. **Bump up again if you set a horizon.**  
   One-third of the forecast horizon replaces the current candidate if it is larger.

The final choice is simply the greatest of these three numbers:  
`max(8, seasonality ÷ 2, horizon ÷ 3)`  

If you later enter a shingle size of your own, it overrides the automatic selection.  
In practice, this heuristic means each forecast leans on about half a seasonal cycle—or, failing that, a third of the horizon—giving the model enough context without drowning it in stale history.

### Storage

By default, every forecaster writes its output to the index alias **`opensearch-forecast-results`**. Because this is a normal user index you can:

* build visualizations and dashboards on top of it,
* wire it into the Alerting plugin for threshold breaches, and
* query it just as you would any other index.

To keep result shards from growing without bound, the plugin enforces an automatic **rollover** policy:

* **Rollover trigger** – when a primary shard grows to roughly **65 GB**, the plugin creates a fresh backing index and shifts the alias.  
* **Retention** – rolled-over indices are retained for at least **30 days** before they are deleted.

You can fine-tune these behaviours with two configuration settings:

| Purpose | Setting | Default | Notes |
|---------|---------|---------|-------|
| Rollover threshold | `plugins.forecast.forecast_result_history_max_docs_per_shard` | `1_350_000_000` | Value is a Lucene-document count, not a byte size. One forecast result is stored as ~4 Lucene docs, each averaging 46.8 bytes, so 1.35 B docs ≈ 65 GB. Increase or decrease this number to change the rollover size. |
| Retention period | `plugins.forecast.forecast_result_history_retention_period` | `30d` | Adjust to keep historical forecast data for a shorter or longer window. Uses the time syntax such as `7d` and `90d`. |

Feel free to adjust these values to suit your workload—just remember that smaller shards lead to more frequent rollovers, while longer retention increases storage consumption.

#### Specifying a custom results index

We allow you to store forecasting results in a custom index of your choice. Select **Custom  index** in the storage section and provide a name for your index alias, for example, `abc`. The plugin then creates an alias prefixed with `opensearch-forecast-result-` followed by your chosen name, for example, `opensearch-forecast-result-abc`. This alias points to an actual index with a name containing the date and a sequence number, such as `opensearch-forecast-result-abc-history-2024.06.12-000002`, where your results are stored.

You can use `-` to separate the namespace to manage custom results index permissions. For example, if you use `opensearch-forecast-result-financial-us-group1` as the results index, you can create a permission role based on the pattern `opensearch-forecast-result-financial-us-*` to represent the `financial` department at a granular level for the `us` group.
{: .note }. If security plugin is enabled, make sure you have [enough permissions]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/security/#custom-result-index-permissions).

#### Flattening nested fields

Custom results index mappings with nested fields pose aggregation and visualization challenges. The **Enable flattened custom result index** option flattens the nested fields in the custom results index. When selecting this option, the plugin creates a separate index prefixed with the custom results index name and forecaster name. For example, if the forecaster `Test` uses the custom results index `abc`, a separate index with the alias `opensearch-forecast-result-abc-flattened-test` will store the forecaster results with nested fields flattened. 

In addition to creating a separate index, the plugin also sets up an ingest pipeline with a script processor. This pipeline is bound to the separate index and uses [a Painless script](https://github.com/opensearch-project/anomaly-detection/blob/main/src/main/resources/scripts/flatten-custom-result-index-painless.txt) to flatten all nested fields in the custom results index.

Deactivating this option on a running forecaster removes its flattening ingest pipeline; it also ceases to be the default for the results index.

The plugin constructs the flattened custom index name based on the custom results index and forecaster name, and because the forecaster name is editable, conflicts can occur. If a conflict occurs, the plugin reuses the index name. You can use [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/) to roll over old flattened results indexes. You can also manually delete or archive any old flattened results indexes. 

#### Custom result index lifecyle management

The plugin rolls over an alias to a new index when the custom results index meets any of the conditions in the following table.

Parameter | Description | Type | Unit | Default in Dashboards | Required
:--- | :--- |:--- |:--- |:--- |:---
`result_index_min_size` | The minimum total primary shard size (excluding replicas) required for index rollover. When set to 100 GiB with an index that has 5 primary and 5 replica shards of 20 GiB each, the rollover runs. | `integer` | `MB` | `51200` | No
`result_index_min_age` |  The minimum index age required for the rollover, calculated from its creation time to the current time. | `integer` |`day` | `7` | No
`result_index_ttl` | The minimum age required in order to delete rolled-over indexes. | `integer` | `day` | `60` | No

### Test your forecaster

Back-testing is the fastest way to iterate on settings such as **Interval** and **Horizon**.  
It trains the model on historical data, plots the resulting forecasts beside the actual values, and visually reveals accuracy. If the results fall short, tweak the configuration and run the test again until the model meets your expectations.

#### How back-testing works

1. **Training window**  
   The job reads the amount of historical data you specified in **History** and trains a model.

2. **Rolling forecast**  
   As the back-test walks forward through the time series, it repeatedly:
   * ingests the next actual data point,
   * emits forecasts at each step.

   Because this is a retrospective simulation, the forecasted values are plotted at past time-stamps, so you can see how closely the model would have tracked reality.

#### Starting a back-test

At the bottom of the **Add model parameters** page, click **Create and test**.  If you prefer to skip back-testing and just create the forecaster, click **Create** instead.

#### Typical duration

Back-testing usually finishes in **one or two minutes**, but it can take longer when:

| Factor | Why it matters |
| ------ | -------------- |
| **History length** | More data means a longer training phase. |
| **Data density** | Dense data slows OpenSearch aggregations. |
| **Categorical field** | Each category value is modeled as a separate series. |
| **Horizon** | A larger horizon produces more forecasts per data point. |

If the chart is empty, verify your source index: at least one time-series must contain more than 40 data points at the selected interval before forecasts can be generated.

<img src="{{site.url}}{{site.baseurl}}/images/forecast/no_result.png" alt="test failed" width="800" height="800">

#### Reading the chart

When the test succeeds, hover any point to see its exact value and confidence bounds:

* **Actual data** – Solid line.
* **Median prediction (P50)** – Dotted line.
* **Confidence interval** – Shaded band defined by **P10** (lower) and **P90** (upper).

<img src="{{site.url}}{{site.baseurl}}/images/forecast/bound.png" alt="bound" width="800" height="800">

#### View forecasts from a specific date

The forecast chart shows predictions from the **final actual data point through the end of the configured horizon**.

Example  
* Last actual timestamp: **Mar 5 2025 19:23**  
* Interval: **1 minute**  
* Horizon: **24**

The forecast spans **Mar 5 2025 19:23 – 19:47**.

<img src="{{site.url}}{{site.baseurl}}/images/forecast/trend.png" alt="test success" width="800" height="800">

Use the **Forecast from** dropdown to jump back to any previously generated forecast.

<img src="{{site.url}}{{site.baseurl}}/images/forecast/forecast_from_1.png" alt="forecast from" width="800" height="800">

When you choose an earlier **Forecast from** time, the forecast line is drawn directly over the historical data that existed at that moment, so the two series overlap:

<img src="{{site.url}}{{site.baseurl}}/images/forecast/forecast_from_2.png" alt="forecast from old date" width="800" height="800">

Click **Show latest** at any time to jump back to the most recent forecast window.

#### Overlay Mode: side-by-side accuracy check

By default the chart displays forecasts that start from a single origin point. Toggle Overlay mode to lay a forecast curve directly on top of the actual series and inspect accuracy across the entire timeline.

Because the model emits one forecast per horizon step—e.g., 24 forecasts when the horizon is 24—a single timestamp can have many forecasts that were generated from different origins. Overlay mode lets you decide which lead time (k) to plot:

* Horizon index 0 = immediate next step
* Horizon index 1 = one step ahead
…
* Horizon index 23 = 23 steps ahead

The control defaults to index 3, but you can pick any value to focus on a different lead time.

<img src="{{site.url}}{{site.baseurl}}/images/forecast/overlay_3.png" alt="overlay config" width="800" height="800">

#### Viewing multiple forecast series

A high-cardinality forecaster can plot many time series at once. Use the **Time series per page** dropdown in the results panel to switch between:

* **Single‑series view** (default) renders one entity per page for maximum readability.
* **Multi‑series view** plots up to **five** entities side-by-side. Confidence bands are translucent by default; hover a line to highlight its band.

Actual and forecast lines overlap so you can judge accuracy point-by-point, but that overlap can become noisy—especially in **Multi‑series view**. In **Visualization options**, turn off **Show actual data at forecast** to hide the actual line and declutter the view.

Before:

<img src="{{site.url}}{{site.baseurl}}/images/forecast/toggle_overlay_before.png" alt="toggle overlay on" width="800" height="800">

After:

<img src="{{site.url}}{{site.baseurl}}/images/forecast/toggle_overlay_after.png" alt="toggle overlay off" width="800" height="800">

#### Exploring the timeline

Use the timeline controls below to navigate, magnify, and filter any span of your forecast history:

* **Zoom** – Click **+ / –** to zoom in on forecasts or broaden context.
* **Pan** – Arrow buttons to move to earlier or later data points if any.
* **Quick Select** – Choose common ranges such as "Last 24 hours" or supply custom dates for result range.

#### Sorting options in Multi-series view

When a forecaster tracks more than five entities, the chart can't show every line at once.  
In **Multi-series view** we therefore pick the five most informative series, and you decide what "informative" means by selecting a sort method:

| Sort method | What it shows | When to use it |
|-------------|--------------|----------------|
| **Minimum confidence-interval width** *(default)* | The five series whose prediction bands are narrowest. A tight band means the model is highly certain about its forecast. | Surface the most "trustworthy" forecasts. |
| **Maximum confidence-interval width** | The five series with the widest bands—forecasts the model is least sure about. | Spot risky or noisy series that may need review or more training data. |
| **Minimum value within the horizon** | The lowest predicted point across the forecast window for each entity, sorted ascending. | Identify entities expected to drop the furthest—useful for capacity planning or alerting on potential dips. |
| **Maximum value within the horizon** | The highest predicted point across the horizon for each entity, sorted descending. | Highlight series with the greatest expected peaks, such as traffic spikes or sales surges. |
| **Distance to threshold value** | Filters forecasts by a numeric threshold (>, <, ≥, ≤), then orders the remainder by how far they sit from that threshold. | Drill into entities that breach—or nearly breach—an SLA or business KPI (e.g., "show anything forecast to exceed 10,000 requests"). |

If the forecaster monitors fewer than five entities, **Multi-series view** shows them all; otherwise, it re-ranks on-the-fly each time you switch sort modes or adjust the threshold, ensuring the five most relevant series stay in focus.

Need to zero-in on a specific subset of entities? Switch **Filter by** to **Custom query** and write an OpenSearch DSL query that defines exactly which series should appear. For example, this query keeps only entities whose `host` equals `server_1`:

```json
{
  "nested": {
    "path": "entity",
    "query": {
      "bool": {
        "must": [
          { "term":     { "entity.name":  "host"     } },
          { "wildcard": { "entity.value": "server_1" } }
        ]
      }
    }
  }
}
```

Next, select a **Sort by** rule—​for example, aggregate by the **maximum forecast value** and order the results **descending**—​then click **Update visualization**.  
The chart refreshes to display only the series for `host:server_1`, ranked according to your chosen sort.

---

## Editing a forecaster

If the initial back-test reveals weak performance, you can tweak the configuration and run the test again:

1. Open the forecaster's **Details** page and click **Edit** to enter edit mode.  
2. Adjust any settings—for example, add a **Category field**, change the **Interval**, or increase the **History** window.  
3. Click **Update**. The validation panel immediately checks the new configuration and highlights any issues it finds.

   <img src="{{site.url}}{{site.baseurl}}/images/forecast/validation_loading.png" alt="validation" width="800" height="800">

4. Fix the flagged validation issues (if any). Once the panel shows green, click **Start test** in the upper-right corner to launch another back-test with the updated parameters.

---

## Real time forecasting

When you are sure of forecasting configuration, you can click **Start forecasting** on the detail page. This would start real time forecasting and generate new forecasts every interval.

A **Live** badge appears when the chart is synced to the most recent data. 

Unlike backtesting, during real-time initialization the forecaster continuously attempts to initialize itself using live data at each interval if historical data is insufficient. While doing this, the forecaster will display an initialization status.

---

## Managing forecasters

The **Forecasters** table offers an at-a-glance view of every forecaster you have configured:

| Column | What it means |
| :--- | :--- |
| **Name** | The identifier you entered when the forecaster was created. |
| **Status** | Current lifecycle state—​e.g. `Running`, `Initializing`, `Test complete`. Click the  <i class="euiIcon euiIcon--xs euiIcon--expand"></i> icon to see extra details such as the timestamp of the last state change and any failure message. |
| **Index** | The data source (index or alias) the forecaster reads from. |
| **Last updated** | Time of the most recent configuration change. |
| **Quick actions** | Context-aware controls—​for example **Start**, **Stop**, or **Delete**—​that change depending on the current state. |

### Execution states

A forecaster (the underlying **forecasting job**) can be in one of the following states. Transitions marked *automatic* happen without user action; the others require you to click **Start** or **Stop**.

| State | Description | Typical trigger |
| :--- | :--- | :--- |
| **Inactive** | Created but never started. | — |
| **Inactive: stopped** | Stopped manually after running. | User clicks **Stop forecasting**. |
| **Awaiting data to initialize forecast** | Trying to start, but there isn't enough historical data yet. | Automatic. |
| **Awaiting data to restart forecast** | Trying to resume after a gap, waiting for fresh data. | Automatic after data outage. |
| **Initializing test** | Building a model for the one-off back-test. | Automatic on **Create and test** or **Start test**. |
| **Test complete** | Back-test finished and the job stopped. | Automatic. |
| **Initializing forecast** | Training a model for continuous forecasting. | Automatic on **Start forecasting**. |
| **Running** | Streaming live data and generating forecasts. | Automatic when initialization succeeds. |
| **Initializing test failed** | Test failed (e.g. not enough data). | Automatic. |
| **Initializing forecast failed** | Continuous mode failed to initialize. | Automatic. |
| **Forecast failed** | Job started but later hit a runtime error (for example, shard failures). | Automatic; requires user attention. |

The diagram below shows how these states connect:

 <img src="{{site.url}}{{site.baseurl}}/images/forecast/state.png" alt="validation" width="1600" height="1600">

---

### Finding and filtering

If you have more forecasters than fit on one page, use the paginator at the bottom of the table. The search bar above the list lets you filter by **name**, **status**, or **index**—ideal when you're managing dozens or even hundreds of forecasters.

---

## Alerting on forecasted values

Because result indices are **not** system indices you can create an [Alerting monitor]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/) in the same way you would for any user index.

Below is one example monitor for a high-cardinality forecaster.  Feel free to adapt the schedule, query, and aggregation to match your own use case.

{% raw %}
```json
{
   "name": "test",
   "type": "monitor",
   "monitor_type": "query_level_monitor",
   "enabled": true,
   "schedule": {
      "period": {
         "unit": "MINUTES",
         "interval": 1
      }
   },
   "inputs": [
      {
         "search": {
            "indices": [
               "opensearch-forecast-results*"
            ],
            "query": {
               "size": 1,
               "query": {
                  "bool": {
                     "filter": [
                        {
                           "range": {
                              "execution_end_time": {
                                 "from": "{{period_end}}||-15m",
                                 "to": "{{period_end}}",
                                 "include_lower": true,
                                 "include_upper": true,
                                 "format": "epoch_millis",
                                 "boost": 1
                              }
                           }
                        }
                     ],
                     "adjust_pure_negative": true,
                     "boost": 1
                  }
               },
               "aggregations": {
                  "metric": {
                     "max": {
                        "field": "forecast_upper_bound"
                     }
                  }
               }
            }
         }
      }
   ],
   "triggers": [
      {
         "query_level_trigger": {
            "id": "29oAl5cB5QuI4WJQ3hnx",
            "name": "breach",
            "severity": "1",
            "condition": {
               "script": {
                  "source": "return ctx.results[0].aggregations.metric.value == null ? false : ctx.results[0].aggregations.metric.value > 10000",
                  "lang": "painless"
               }
            },
            "actions": [
               {
                  "id": "notification378084",
                  "name": "email",
                  "destination_id": "2uzIlpcBMf-0-aT5HOtn",
                  "message_template": {
                     "source": "Monitor **{{ctx.monitor.name}}** entered **ALERT** state — please investigate.\n\nTrigger    : {{ctx.trigger.name}}\nSeverity   : {{ctx.trigger.severity}}\nTime range : {{ctx.periodStart}} → {{ctx.periodEnd}} UTC\n\nEntity\n{{#ctx.results.0.hits.hits.0._source.entity}}\n  • {{name}} = {{value}}\n{{/ctx.results.0.hits.hits.0._source.entity}}\n",
                     "lang": "mustache"
                  },
                  "throttle_enabled": true,
                  "subject_template": {
                     "source": "Alerting Notification action",
                     "lang": "mustache"
                  },
                  "throttle": {
                     "value": 15,
                     "unit": "MINUTES"
                  }
               }
            ]
         }
      }
   ],
   "ui_metadata": {
      "schedule": {
         "timezone": null,
         "frequency": "interval",
         "period": {
            "unit": "MINUTES",
            "interval": 1
         },
         "daily": 0,
         "weekly": {
            "tue": false,
            "wed": false,
            "thur": false,
            "sat": false,
            "fri": false,
            "mon": false,
            "sun": false
         },
         "monthly": {
            "type": "day",
            "day": 1
         },
         "cronExpression": "0 */1 * * *"
      },
      "monitor_type": "query_level_monitor",
      "search": {
         "searchType": "query",
         "timeField": "execution_end_time",
         "aggregations": [
            {
               "aggregationType": "max",
               "fieldName": "forecast_upper_bound"
            }
         ],
         "groupBy": [],
         "bucketValue": 15,
         "bucketUnitOfTime": "m",
         "filters": []
      }
   }
}
```
{% endraw %}
{% include copy-curl.html %}

Example alert email:

```
Monitor **test** entered **ALERT** state — please investigate.

Trigger    : breach
Severity   : 1
Time range : 2025-06-22T09:56:14.490Z → 2025-06-22T09:57:14.490Z UTC

Entity
  • host = server_3
```

The table below explains each design choice and why it matters.

| Design choice | Rationale |
| --- | --- |
| `size: 1` in the search input | Pulls a **single hit** so you can embed `ctx.results.0.hits.hits.0` in the notification and see which entity (host, service, …) breached. |
| `execution_end_time` range `"now-15m"` → `now` | Uses the **result-creation timestamp**, which is never delayed by data ingestion. Don't filter on `data_end_time` if your source index lags (e.g., backfills old log files). |
| `max(forecast_upper_bound)` as the metric | We alert on an upper-bound spike.<br>Common alternates: <br>• `min(forecast_lower_bound)` for drops <br>• `avg(forecast_value)` for trend shifts. <br>See the full result schema for more fields <sup>[GitHub link](https://github.com/opensearch-project/anomaly-detection/blob/main/src/main/resources/mappings/forecast-results.json)</sup>. |
| Index pattern `opensearch-forecast-results*` | Works out-of-the-box. Change it if you write results to a custom alias, e.g. `opensearch-forecast-result-abc*`. |
| Optional term filter on `forecaster_id` | Add it to *further* narrow the search to one forecaster. |
| Monitor every 1 min, query window 15 min | Quickly identifies unusual forecasts by checking every minute. Although the same forecasts might be queried multiple times due to the 15-minute lookback window, the 15-minute throttle ensures you only receive one alert per event until acknowledged. |
| Mustache block prints all entity dimensions | Handles single-dimension (`host=server_3`) and multi-dimension (`host=server_3`, `service=auth`) entities. You can also include a link to a pre-filtered Dashboard so responders can investigate the offending logs quickly. |
| Threshold | Use Dashboards visual editor to explore recent values and pick a cutoff that really signals an anomaly. |


