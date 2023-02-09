---
layout: default
title: json
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# json

<!--- Should we add "Parse" to the title? The original is "Parse JSON processor. --->

## Overview

Takes in an event and parses its JSON data, including any nested fields.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The field in the `Event` that will be parsed. Default is `message`.
destination | No | String | The destination field of the parsed JSON. Defaults to the root of the `Event`. Cannot be `""`, `/`, or any whitespace-only `String` because these are not valid `Event` fields.
pointer | No | String | A JSON Pointer to the field to be parsed. There is no `pointer` by default, meaning the entire `source` is parsed. The `pointer` can access JSON Array indices as well. If the JSON Pointer is invalid then the entire `source` data is parsed into the outgoing `Event`. If the pointed-to key already exists in the `Event` and the `destination` is the root, then the pointer uses the entire path of the key.

<!---## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.--->