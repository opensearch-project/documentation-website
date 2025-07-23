---
layout: default
title: Migration phases
parent: Migration Assistant for OpenSearch
grand_parent: Migrate or upgrade
nav_order: 40
nav_exclude: false
has_children: true
has_toc: false
permalink: /migration-assistant/migration-phases/
---

# Migration phases

This page outlines the core phases of migrating with Migration Assistant. Each scenario below consists of a sequence of common steps. Expand a scenario to explore the detailed flow.

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

<details id="scenario-1">
<summary>Scenario 1 – Backfill Only</summary>

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

</details>

<details id="scenario-2">
<summary>Scenario 2 – Live Capture Only</summary>

<ol>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/">Assessment</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/">Deploy</a>
    <ul>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/iam-and-security-groups-for-existing-clusters/">IAM and Security Groups for Existing Clusters</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/configuration-options/">Configuration Options</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/verifying-live-capture-components/">Verify Live Capture Components</a></li>
    </ul>
  </li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-source-to-proxy/">Reroute Traffic from Source to Capture Proxy</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/">Migrate Metadata</a>
    <ul>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/">Managing type mapping deprecation</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/">Handling breaking changes in field types</a></li>
    </ul>
  </li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/">Replay Captured Traffic</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-traffic-from-capture-proxy-to-target/">Reroute Traffic from Capture Proxy to Target</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/">Teardown</a></li>
</ol>

</details>

<details id="scenario-3">
<summary>Scenario 3 –  Live Capture with Backfill</summary>

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
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-source-to-proxy/">Reroute Traffic from Source to Capture Proxy</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/create-snapshot/">Create Snapshot</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/">Migrate Metadata</a>
    <ul>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/">Managing type mapping deprecation</a></li>
      <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/">Handling breaking changes in field types</a></li>
    </ul>
  </li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/">Backfill</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/">Replay Captured Traffic</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-traffic-from-capture-proxy-to-target/">Reroute Traffic from Capture Proxy to Target</a></li>
  <li><a href="{{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/">Teardown</a></li>
</ol>

</details>

<script>
(function() {
  // Function to save details state to localStorage
  function saveDetailsState() {
    const details = document.querySelectorAll('details[id]');
    const state = {};
    details.forEach(detail => {
      state[detail.id] = detail.open;
    });
    localStorage.setItem('migration-phases-details-state', JSON.stringify(state));
  }

  // Function to restore details state from localStorage
  function restoreDetailsState() {
    const savedState = localStorage.getItem('migration-phases-details-state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        Object.keys(state).forEach(id => {
          const detail = document.getElementById(id);
          if (detail && state[id]) {
            detail.open = true;
          }
        });
      } catch (e) {
        console.warn('Failed to restore details state:', e);
      }
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      restoreDetailsState();
      
      // Add event listeners to save state when details are toggled
      const details = document.querySelectorAll('details[id]');
      details.forEach(detail => {
        detail.addEventListener('toggle', saveDetailsState);
      });
    });
  } else {
    restoreDetailsState();
    
    // Add event listeners to save state when details are toggled
    const details = document.querySelectorAll('details[id]');
    details.forEach(detail => {
      detail.addEventListener('toggle', saveDetailsState);
    });
  }
})();
</script>
