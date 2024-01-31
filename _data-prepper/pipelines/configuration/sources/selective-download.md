---
layout: default
title: Selective download
parent: Sources
grand_parent: Pipelines
nav_order: 21
---

# Selective download

If your pipeline uses an S3 source, you can use SQL expressions to perform filtering and computations on the contents of S3 objects before ingesting them into a pipeline.

The `s3_select` option supports objects in the [Parquet File Format](https://parquet.apache.org/docs/). It also works with objects that are compressed with GZIP or BZIP2 (for CSV and JSON objects only) and supports columnar compression for the Parquet File Format using GZIP and Snappy.

The following pipeline example downloads data in incoming S3 objects, encoded in the Parquet File Format:

```json
pipeline:
  source:
    s3:
      s3_select:
        expression: "select * from s3object s"  
        input_serialization: parquet
      notification_type: "sqs"
...
```
{% include copy-curl.html %}

The following pipeline example downloads only the first 10,000 records in the objects:

```json
pipeline:
  source:
    s3:
      s3_select:
        expression: "select * from s3object s LIMIT 10000"
        input_serialization: parquet
      notification_type: "sqs"
...
```
{% include copy-curl.html %}

The following pipeline example checks for the minimum and maximum values of `data_value` before ingesting events into the pipeline:

```json
pipeline:
  source:
    s3:
      s3_select:
        expression: "select s.* from s3object s where s.data_value > 200 and s.data_value < 500 "
        input_serialization: parquet
      notification_type: "sqs"
...
```
{% include copy-curl.html %}
