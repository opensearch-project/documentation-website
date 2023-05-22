---
layout: default
title: Composite monitors
nav_order: 3
parent: Alerting
has_children: false
redirect_from:
---

# Composite monitors

Basic [monitor types]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/#monitor-types) for the Alerting plugin are limited by their capacity to define only one trigger type. For example, a document level monitor can only send a trigger based on documents and a bucket level monitor can only send a trigger based on aggregations. The composite monitor extends the usefulness of the individual monitor types by providing functionality that can chain the execution of multiple monitor types into a single workflow that includes as many triggers as there are different monitor types contained in the chain. This creates the advantage of having multiple triggers that can focus on different aspects of a single data source without requiring you to manually coordinate the scheduling of the separate monitors in a predetermined order.

## Key terms

| Term | Definition |
| :--- | :--- |
| Delegate monitor | Any monitor of any monitor type used in the chained workflow of a compound monitor. |
| Alert chain | Conditions that, if met, generate *alerts*. |
| Execution schema | Conditions that, if met, generate *alerts*. |
| Execution Id | Conditions that, if met, generate *alerts*. |

## Simplified workflow

The following image shows the simplified workflow of a compound monitor.

![Simplified composite monitor workflow]({{site.url}}{{site.baseurl}}/images/alerting/chained-findings.gif)