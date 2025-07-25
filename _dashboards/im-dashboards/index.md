---
layout: default
title: Index management in Dashboards
nav_order: 80
has_children: true
redirect_from:
  - /dashboards/admin-ui-index/
canonical_url: https://docs.opensearch.org/latest/dashboards/im-dashboards/index/
---

# Index management in Dashboards
Introduced 2.5
{: .label .label-purple }

Previously, users relied on REST APIs or YAML configurations for basic administrative operations and interventions. This release takes the first step toward a unified administration panel in OpenSearch Dashboards with the launch of several index management UI enhancements. The new interface provides a more user-friendly way to run common indexing and data stream operations. Now you can perform create, read, update, and delete (CRUD) and mapping operations for indexes, index templates, and aliases through the UI. Additionally, you can open, close, reindex, shrink, and split indexes. The UI runs index status and data validation before submitting requests and lets you compare changes with previously saved settings before making updates.

<img src="{{site.url}}{{site.baseurl}}/images/admin-ui-index/admin-UI-preview.gif" alt="Index management demo gif">{: .img-fluid}