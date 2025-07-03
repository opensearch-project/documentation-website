---
layout: default
title: Migration phases
parent: Migration Assistant
nav_order: 30
has_children: false
has_toc: false
permalink: /migration-assistant/migration-phases/
redirect-from: /migration-assistant/migration-phases/index/
---

# Migration phases

This page outlines the core phases of migrating with Migration Assistant. Each scenario below consists of a sequence of common steps. Expand a scenario to explore the detailed flow.

---

<style>
details {
  border: 1px solid #aaa;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
}
summary {
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1rem;
}
details[open] {
  background-color: #eef6ff;
}
</style>

<details>
<summary>Scenario 1 – Backfill Only</summary>

<ol>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/">Assessment</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deployment/">Deployment</a></li>

  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/create-snapshot/">Create Snapshot</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/">Migrate Metadata</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/">Migrate Data</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/teardown/">Teardown</a></li>
</ol>

</details>

<details>
<summary>Scenario 2 – Live Capture Only</summary>

<ol>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/">Assessment</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deployment/">Deployment</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/verify-backfill-components/">Verify Backfill Components</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-source-to-proxy/">Reroute Traffic from Source to Capture Proxy</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/">Migrate Metadata</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/verify-live-capture-components/">Verify Live Capture Components</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/">Replay Captured Traffic</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/switching-traffic-from-the-source-cluster/">Reroute Traffic from Capture Proxy to Target</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/teardown/">Teardown</a></li>
</ol>

</details>

<details>
<summary>Scenario 3 –  Live Capture with Backfill</summary>

<ol>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/">Assessment</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deployment/">Deployment</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-source-to-proxy/">Reroute Traffic from Source to Capture Proxy</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/create-snapshot/">Create Snapshot</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrating-metadata/">Migrate Metadata</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/">Migrate Data</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/using-traffic-replayer/">Replay Traffic</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/switching-traffic-from-the-source-cluster/">Reroute Traffic from Capture Proxy to Target</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/teardown/">Teardown</a></li>
</ol>

</details>

---

💡 *Need help getting started? Begin with [Planning your migration]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/planning-your-migration/index/).*
