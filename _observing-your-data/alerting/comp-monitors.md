---
layout: default
title: Composite monitors
nav_order: 3
parent: Alerting
has_children: false
redirect_from:
---

# Composite monitors

Basic [monitor types]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/#monitor-types) for the Alerting plugin are limited by their capacity to define only one trigger type. For example, a document level monitor can only send a trigger based on documents and a bucket level monitor can only send a trigger based on aggregations. The composite monitor extends the usefulness of the individual monitor types by providing functionality that can chain the execution of multiple basic monitor types into a single workflow that includes as many triggers for the different monitor types contained in the chain.

## Key terms

| Term | Definition |
| :--- | :--- |
| Delegate monitor | A job that runs on a defined schedule and queries OpenSearch indexes. The results of these queries are then used as input for one or more *triggers*. |
| Alert chain | Conditions that, if met, generate *alerts*. |