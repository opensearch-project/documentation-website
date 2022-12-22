---
layout: default
title: aggregate
parent: Processors
grand_parent: Configuring Data Prepper
nav_order: 45
---

# aggregate

## Overview

Groups events together based on the keys provided and performs a action on each group.

Option | Required | Type | Description
:--- | :--- | :--- | :---
identification_keys | Yes | List | A unordered list by which to group Events. Events with the same values for these keys are put into the same group. If an event does not contain one of the `identification_keys`, then the value of that key is considered to be equal to `null`. At least one identification_key is required. (e.g. `["sourceIp", "destinationIp", "port"]`).
action | Yes | AggregateAction | The action to be performed for each group. One of the available aggregate actions must be provided or you can create custom aggregate actions. `remove_duplicates` and `put_all` are available actions. For more information, see [creating custom aggregate actions](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#creating-new-aggregate-actions).
group_duration | No | String | The amount of time that a group should exist before it is concluded automatically. Supports ISO_8601 notation strings ("PT20.345S", "PT15M", etc.) as well as simple notation for seconds (`"60s"`) and milliseconds (`"1500ms"`). Default value is `180s`.

## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.