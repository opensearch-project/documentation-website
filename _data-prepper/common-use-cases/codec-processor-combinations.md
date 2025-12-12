---
layout: default
title: Codec processor combinations
parent: Common use cases
nav_order: 10
---

# Codec processor combinations

At ingestion time, data received by the [`s3` source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/) can be parsed by [codecs]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#codec). Codecs compresses and decompresses large data sets in a certain format before ingestion them through an OpenSearch Data Prepper pipeline [processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/).

While most codecs can be used with most processors, the following codec processor combinations can make your pipeline more efficient when used with the following input types.

## JSON array

A [JSON array](https://json-schema.org/understanding-json-schema/reference/array) is used to order elements of different types. Because an array is required in JSON, the data contained within the array must be tabular.

The JSON array does not require a processor. 

## NDJSON

Unlike a JSON array, [NDJSON](https://www.npmjs.com/package/ndjson) allows for each row of data to be delimited by a newline, meaning data is processed per line instead of an array.

The NDJSON input type is parsed using the [newline]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#newline-codec) codec, which parses each single line as a single log event. The [parse_json]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/parse-json/) processor then outputs each line as a single event.

## CSV

The CSV data type inputs data as a table. It can used without a codec or processor, but it does require one or the other, for example, either just the `csv` processor or the `csv` codec.

The CSV input type is most effective when used with the following codec processor combinations.

### `csv` codec

When the [`csv` codec]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#csv-codec) is used without a processor, it automatically detects headers from the CSV and uses them for index mapping.

### `newline` codec 

The [`newline` codec]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#newline-codec) parses each row as a single log event. The codec will only detect a header when `header_destination` is configured. The [csv]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/csv/) processor then outputs the event into columns. The header detected in `header_destination` from the `newline` codec can be used in the `csv` processor under `column_names_source_key.`

## Parquet

[Apache Parquet](https://parquet.apache.org/docs/overview/) is a columnar storage format built for Hadoop. Pipeline authors can use the parquet codec to read Parquet data directly from the S3 object. This will retrieve all data from Parquet. An alternative is to use [S3 Select]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#using-s3_select-with-the-s3-source) instead of the codec. In this case, [S3 Select]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#using-s3_select-with-the-s3-source) will parse the Parquet file directly. This can be more efficient if you are filtering or loading a subset of data.

Additional S3 charges apply when using [S3 Select]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#using-s3_select-with-the-s3-source).
{: .note}

## Avro

[Apache Avro](https://avro.apache.org/docs) is a columnar storage format built for Hadoop. It is most efficient without the use of a codec, however, great results can be achieved when it is configured with [S3 Select]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#using-s3_select-with-the-s3-source).

## `event_json`

The `event_json` output codec converts event data and metadata into JSON format to send to a sink, such as an S3 sink. The `event_json` input codec reads the event and its metadata to create an event in Data Prepper.
