---
layout: default
title: Codec processor combinations
parent: Common use cases
nav_order: 25
---

# Codec processor combinations

At ingestion time, data received by the [`s3` source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/) can be parsed by [codecs]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#codec). which will compress and decompress large sets of data in a certain format before ingestion through a Data Prepper pipelines [processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/).

While most codecs can be used with most processors, the following codec processor combinations can help make your pipeline more efficient when using the following input types.

## JSON Array

A [JSON array](https://json-schema.org/understanding-json-schema/reference/array) is used to order elements of different types. Because an array is required in JSON, the data contained within the array must be tabular.

The JSON array does not require a processor. 

## NDJSON

Unlike a JSON array, [NDJSON](https://www.npmjs.com/package/ndjson), each row of data can be delimited by a newline, which means data is processed per-line as opposed to an array.

The NDJSON input type requires is parsed using the [newline]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#newline-codec) codec, which parses each single line as a single log event. The [parse_json]({{site.url}}{{site.baseurl}}data-prepper/pipelines/configuration/processors/parse-json/) processor then outputs each line as a single event.



## CSV

The CSV data type inputs data as a table. It can used without a codec or processor, but it does require one or the other, for example, either just the `csv` processors or the `csv` codec.

The CSV input type is most effective with the following codec/processor combinations.


### csv codec

The [csv]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#csv-codec) codec without a processor. When used without a processor, the `csv` codec automatically detects headers from the CSV and uses them for index mapping.

### newline codec 

The [newline]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#newline-codec) codec parses each row as a single log event. However, the codec will only detect a header when `header_destination` is configured. Then, the [csv]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/csv/) processor outputs the event into columns. The header detected in `header_destination` from the newline codec can be used in the `csv` processor under `column_names_source_key.`


## Parquet

[Apache Parquet](https://parquet.apache.org/docs/overview/) is columnar storage format built for Hadoop. It is most efficient without the use of a codec, however positive results can be achieved when paired with the following processors depending on the compression type.


- [Parquet]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/s3#parquet-codec) |
- [S3 Select]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3#using-s3_select-with-the-s3-source) |

## Avro

[Apace Avro] helps streamline streaming data pipelines. It is most efficient when used with the [Avro]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/s3#avro-codec) inside an `s3` sink.

