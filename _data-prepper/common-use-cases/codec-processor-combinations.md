---
layout: default
title: Codec processor combinations
parent: Common use cases
nav_order: 25
---

# Codec processor combinations

At ingestion time, data received by the [`s3 source`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/) can be parsed by codecs, such as [Apache Avro](https://avro.apache.org/docs/1.11.1/specification/). which will compress and decompress large sets of data in a certain format before ingestion through a Data Prepper pipelines [processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/).

While most codecs can be used with most processors, the following codec processor combinations can help make your pipeline more efficient when using the following input types.

## JSON Array

A [JSON array](https://json-schema.org/understanding-json-schema/reference/array) is used to order elements of different types. Because an array is required in JSON, the data contained within the array must be tabular.

The JSON array is most effective with the following codec processor combination. 

| **Compression type** | **Codec** | **Processor** |
|---|---|---|
| None /gzip/ Automatic |[JSON]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#json-codec) | [parse_json]({{site.url}}{{site.baseurl}}/pipelines/configuration/processors/parse-json/) | 

## NDJSON

Unlike a JSON array, [NDJSON](https://www.npmjs.com/package/ndjson), each row of data can be delimited by a newline, which means data is processed per-line as opposed to an array.

The NDJSON input type is most effective with the following codec processor combination.

| **Compression type** | **Codec** | **Processor** |
|---|---|---|---|
| None /gzip/ Automatic | [Newline]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#newline-codec) | [parse_json]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/parse-json/)  | 

## CSV

The CSV data type inputs data as a table. It can used without a codec or processor, but it does require the one or the other. 

The CSV input type is most effective with the following codec processor combinations.

| **Compression type** | **Codec** | **Processor** | **Limitations**
|---|---|---|---|---|
| None /gzip/ Automatic | [CSV]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#csv-codec) | None | Header is automatically detected and used for index mapping with the CSV codec. |
| None /gzip/ Automatic | [Newline](({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#newline-codec)) | [CSV]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/csv/) | Header is detected if `header_destination` is configured in the `newline` codec. <br>The header can be used in the CSV processor under `column_names_source_key`. |
| None /gzip/ Automatic | None | [CSV]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/csv/) | N/A |


## Parquet

[Apache Parquet](https://parquet.apache.org/docs/overview/) is columnar storage format built for Hadoop. It is most efficient without the use of a codec, however positive results can be achieved when paired with the following processors depending on the compression type.

| **Compression type** | **Processor** |
|---|---|
| None /gzip/ Automatic | [Parquet]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/s3#parquet-codec) |
| Snappy / Automatic | [S3 Select]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#using-s3_select-with-the-s3-source) |

## Avro

[Apace Avro] helps streamline streaming data pipelines. It is most efficient when used with the [Avro]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/s3#avro-codec) inside an `s3` sink.

