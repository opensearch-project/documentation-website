---
layout: default
title: Convert
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 10
---

# Convert

The convert ingest processor converts a field in a document to a different type. The supported types are `integer`, `long`, `float`, `double`, `string`, `boolean`, `ip`, and `auto`.

Specifying `boolean` will set the field to `true` if its string value is equal to `true` (ignore case), to false if its string value is equal to `false` (ignore case), or it will throw an exception otherwise.

## Configuration parameters

The byte processor supports the following parameter options. The parameters `field` and `type` are required. All others are optional. 

Following is an example of a convert ingest processor configuration.

#### Example: Convert processor configuration

```json

```