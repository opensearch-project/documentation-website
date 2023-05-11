---
layout: default
title: csv 
parent: Processors
grand_parent: Pipelines
nav_order: 49
---

# csv

The `csv` processor parses comma-separated values (CSVs) from the event into columns.

## Configuration

The following table describes the options you can use to configure the `csv` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The field in the event that will be parsed. Default value is `message`.
quote_character | No | String | The character used as a text qualifier for a single column of data. Default value is `"`.
delimiter | No | String | The character separating each column. Default value is `,`.
delete_header | No | Boolean | If specified, the event header (`column_names_source_key`) is deleted after the event is parsed. If there is no event header, no action is taken. Default value is true.
column_names_source_key | No | String | The field in the event that specifies the CSV column names, which will be automatically detected. If there need to be extra column names, the column names are automatically generated according to their index. If `column_names` is also defined, the header in `column_names_source_key` can also be used to generate the event fields. If too few columns are specified in this field, the remaining column names are automatically generated. If too many column names are specified in this field, the CSV processor omits the extra column names.
column_names | No | List | User-specified names for the CSV columns. Default value is `[column1, column2, ..., columnN]` if there are no columns of data in the CSV record and `column_names_source_key` is not defined. If `column_names_source_key` is defined, the header in `column_names_source_key` generates the event fields. If too few columns are specified in this field, the remaining column names are automatically generated. If too many column names are specified in this field, the CSV processor omits the extra column names.

<!---## Configuration

Content will be added to this section.--->

## Metrics

The following table describes common [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. |

The `csv` processor includes the following custom metrics.

**Counter**

* `csvInvalidEvents`: The number of invalid events. An exception is thrown when an invalid event is parsed. An unclosed quote usually causes this exception. 