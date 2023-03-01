---
layout: default
title: Root Cause Analysis
nav_order: 50
parent: Performance Analyzer
has_children: true
redirect_from:
  - /monitoring-plugins/pa/rca/index/
---

# Root Cause Analysis

The OpenSearch Performance Analyzer plugin (PA) captures OpenSearch and JVM activity, plus their lower-level resource usage (e.g. disk, network, CPU, and memory). Based on this instrumentation, Performance Analyzer computes and exposes diagnostic metrics so that administrators can measure and understand the bottlenecks in their OpenSearch clusters.

The Root Cause Analysis framework (RCA) uses the information from PA to alert administrators about the root cause of performance and availability issues that their clusters might be experiencing.

In broad strokes, the framework helps you access data streams from OpenSearch nodes running Performance Analyzer. You write snippets of Java to choose the streams that matter to you and evaluate the streams' PA metrics against certain thresholds. As RCA runs, you can access the state of each analysis using the REST API.

To learn more about Root Cause Analysis, see [its repository on GitHub](https://github.com/opensearch-project/performance-analyzer-rca).
