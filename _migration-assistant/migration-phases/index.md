---
layout: default
title: Migration phases
parent: Migration Assistant for OpenSearch
nav_order: 40
nav_exclude: false
has_children: true
has_toc: false
permalink: /migration-assistant/migration-phases/
redirect_from:
  - /migration-assistant/overview/migration-phases/
  - /migration-phases/
---

# Migration phases

This page outlines the core phases of migrating with Migration Assistant. There are three migration scenarios, each consisting of a sequence of common steps.

<style>
.scenario-container {
  border: 1px solid #aaa;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
}
.scenario-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2c5aa0;
  border-bottom: 2px solid #e1e4e8;
  padding-bottom: 0.5rem;
}
.scenario-container ol {
  margin-top: 0.5rem;
}
</style>

<div class="scenario-container" id="scenario-1">
<div class="scenario-title">Scenario 1 – Backfill Only</div>

<ol>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/">Assessment</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/">Deploy</a>
    <ul>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/verifying-backfill-components/">Verify Backfill Components</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/configuration-options/">Configuration Options</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/iam-and-security-groups-for-existing-clusters/">IAM and Security Groups for Existing Clusters</a></li>
    </ul>
  </li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/create-snapshot/">Create Snapshot</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/">Migrate Metadata</a>
    <ul>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/">Managing type mapping deprecation</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/">Handling breaking changes in field types</a></li>
    </ul>
  </li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/">Backfill</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/">Teardown</a></li>
</ol>

</div>

<div class="scenario-container" id="scenario-2">
<div class="scenario-title">Scenario 2 – Live Capture Only</div>

<ol>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/">Assessment</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/">Deploy</a>
    <ul>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/iam-and-security-groups-for-existing-clusters/">IAM and Security Groups for Existing Clusters</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/configuration-options/">Configuration Options</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/verifying-live-capture-components/">Verify Live Capture Components</a></li>
    </ul>
  </li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-source-to-proxy/">Reroute traffic from source to Capture Proxy</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/">Migrate Metadata</a>
    <ul>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/">Managing type mapping deprecation</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/">Handling breaking changes in field types</a></li>
    </ul>
  </li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/">Replay Captured Traffic</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-traffic-from-capture-proxy-to-target/">Reroute traffic from Capture Proxy to Target</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/">Teardown</a></li>
</ol>

</div>

<div class="scenario-container" id="scenario-3">
<div class="scenario-title">Scenario 3 – Live Capture with Backfill</div>

<ol>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/">Assessment</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/">Deploy</a>
    <ul>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/iam-and-security-groups-for-existing-clusters/">IAM and Security Groups for Existing Clusters</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/configuration-options/">Configuration Options</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/verifying-backfill-components/">Verify Backfill Components</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/verifying-live-capture-components/">Verify Live Capture Components</a></li>
    </ul>
  </li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-source-to-proxy/">Reroute traffic from source to Capture Proxy</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/create-snapshot/">Create Snapshot</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/">Migrate Metadata</a>
    <ul>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/">Managing type mapping deprecation</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/">Handling breaking changes in field types</a></li>
    </ul>
  </li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/">Backfill</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/">Replay Captured Traffic</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-traffic-from-capture-proxy-to-target/">Reroute traffic from Capture Proxy to Target</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/">Teardown</a></li>
</ol>

</div>
