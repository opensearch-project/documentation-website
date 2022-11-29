---
layout: default
title: Configuration reference
nav_order: 30
---

# Data Prepper configuration reference



## Data Prepper server options


### Peer forwarder options


#### General options for peer forwarder


#### TLS/SSL options for peer forwarder


#### Authentication options for peer forwarder

## General pipeline options

## Sources


### otel_trace_source

### http_source

### otel_metrics_source

### s3

#### sqs

#### aws

### file

### pipeline

### stdin

## Buffers

### bounded_blocking

## Processors

### otel_trace_raw

### service_map_stateful

### string_converter

### aggregate

### date

### drop_events

### grok

### key_value

### add_entries

### copy_values

### delete_entries

### rename_keys

### substitute_string

### split_string

### uppercase_string

### lowercase_string

### trim_string

### csv

### json

## Routes

## Sinks

### General options for all sink types

### opensearch

### file

### pipeline

### stdout
