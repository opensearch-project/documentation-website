There is no *one-size-fits-most* migration strategy, this guide seeks to describe possible sample scenario(s) with the goal of helping customers plan their own migration strategy and estimate costs accordingly.

## 15 Day Historical and Live Migration

Key phases:

1. Setup, Planning, and Verification (Days 1-5)
1. Historical backfill, Catchup, and Validation (Days 6-10)
1. Final Validation, Traffic Switchover, and Teardown (Days 11-15)

### Timeline

```mermaid
%%{
  init: {
    "gantt": {
        "fontSize": 20,
        "barHeight": 40,
        "sectionFontSize": 24,
        "leftPadding": 175
    }
  }
}%%
gantt
    dateFormat D HH
    axisFormat Day %d
    todayMarker off
    tickInterval 1day

    section Steps
    Setup and Verification : prep, 1 00, 5d
    Clear Test Environment : milestone, clear, after prep, 0d
    Traffic Capture : traffic_capture, after clear, 6d
    Snapshot : snapshot, after clear, 1d
    Scale Up Target Cluster for Backfill : backfill_scale, 6 22, 2h
    Metadata Migration : metadata, after snapshot, 1h
    Reindex from Snapshot : rfs, after metadata, 71h
    Scale Down Target Cluster for Replay : replay_scale, after rfs, 2h
    Traffic Replay: replay, after replay_scale, 46h
    Traffic Switchover : milestone, switchover, after replay, 0d
    Validation : validation, after snapshot, 7d
    Scale Down Target Cluster : 11 00, 2h
    Teardown   : teardown, 14 00, 2d
```

#### Explanation of Scaling Operations

This section assumes a customer chooses to deliberatly scale their target cluster for backfill and/or replay to enable a faster and/or cheaper overall migration. In the absence of this, backfill and replay steps may take much longer (likely increasing overall cost).

This plan assumes we can replay 6 days of captured data in under 2 days in order for the source and target clusters to be in sync. Take an example of a source cluster operating at avg. 90% CPU utilization to handle reads/writes from application code, it's improbable that a target cluster with the same scale and configuration will be able to support a request throughput of at least 3x in order to catchup in the given time. The same holds for backfill for write-heavy clusters or clusters where data has accumulated for a long time period, to follow this plan, the target cluster should be scaled such that it can ingest/index all the source data in under 3 days.


1. **Scale Up Target Cluster for Backfill**: Occurs after metadata migration and before reindexing. The target cluster is scaled up to handle the resource-intensive reindexing process faster.


2. **Scale Down Target Cluster for Replay**: Once the reindexing is complete, the target cluster is scaled down to a more appropriate size for the traffic replay phase. While still provisioned higher than normal production workloads, given replayer has a >1 speedup factor.

3. **Scale Down Target Cluster**: After the validation phase, the target cluster is scaled down to its final operational size. This step ensures that the cluster is rightsized for normal production workloads, balancing performance needs with cost-efficiency.

### Component Durations

This component duration breakdown is useful for identifying the cost of resources deployed during the migration process. It provides a clear overview of how long each component is active or retained, which directly impacts resource utilization and associated costs.

Note: Duration excludes weekends. If actual timeline extends over weekends, duration (and potentially costs) will increase.

```mermaid
%%{
  init: {
    "gantt": {
        "fontSize": 20,
        "barHeight": 40,
        "sectionFontSize": 24,
        "leftPadding": 175
    }
  }
}%%
gantt
    dateFormat D HH
    axisFormat Day %d
    todayMarker off
    tickInterval 1day

    section Services
    Core Services Runtime (15d) : active, 1 00, 15d
    Capture Proxy Runtime (6d) : active, capture_active, 6 00, 6d
    Capture Data Retention (4d) : after capture_active, 4d
    Snapshot Runtime (1d) : active, snapshot_active, 6 00, 1d
    Snapshot Retention (9d) : after snapshot_active, 9d
    Reindex from Snapshot Runtime (3d) : active, historic_active, 7 01, 71h
    Replayer Runtime (2d) : active, replayer_active, after historic_active, 2d
    Replayer Data Retention (4d) : after replayer_active, 4d
    Target Proxy Runtime (4d) : active, after replayer_active, 4d
```

| Component                         | Duration |
|-----------------------------------|----------|
| Core Services Runtime             | 15d      |
| Capture Proxy Runtime             | 6d       |
| Capture Data Retention            | 4d       |
| Snapshot Runtime                  | 1d       |
| Snapshot Retention                | 9d       |
| Reindex from Snapshot Runtime     | 3d       |
| Replayer Runtime                  | 2d       |
| Replayer Data Retention           | 4d       |
| Target Proxy Runtime              | 4d       |
