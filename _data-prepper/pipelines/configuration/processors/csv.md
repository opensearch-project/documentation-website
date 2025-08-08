---
layout: default
title: CSV 
parent: Processors
grand_parent: Pipelines
nav_order: 70
---

# CSV processor

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

## Usage

Add the following examples to your `pipelines.yaml` file, depending on how you your CSV columns are formatted.

### User-specified column names

The following example `pipelines.yaml` configuration points to a file named `ingest.csv` as the source. Then, the `csv` processor parses the data from the `.csv` file using the column names specified in the `column_names` setting, as shown in the following example:

```yaml
csv-pipeline:
  source:
    file:
      path: "/full/path/to/ingest.csv"
      record_type: "event"
  processor:
    - csv:
        column_names: ["col1", "col2"]
  sink:
    - stdout:
```
{% include copy.html %}


When run, the processor will parse the message. Although only two column names are specified in processor settings, a third column name is automatically generated because the data contained in `ingest.csv` includes three columns, `1,2,3`:

```
{"message": "1,2,3", "col1": "1", "col2": "2", "column3": "3"}
```
### Automatically detect column names

The following configuration automatically detects the header of a CSV file ingested through an [`s3 source`]({{site.url}}{{site.baseurl}}//data-prepper/pipelines/configuration/sources/s3/):

```yaml
csv-s3-pipeline:
  source:
    s3:
      notification_type: "sqs"
      codec:
        newline:
          skip_lines: 1
          header_destination: "header"
      compression: none
      sqs:
        queue_url: "https://sqs.<region>.amazonaws.com/<account id>/<queue name>"
      aws:
        region: "<region>"
  processor:
    - csv:
        column_names_source_key: "header"
  sink:
    - stdout:
```
{% include copy.html %}


For example, if the `ingest.csv` file in the Amazon Simple Storage Service (Amazon S3) bucket that the Amazon Simple Queue Service (SQS) queue is attached to contains the following data:

```
Should,skip,this,line
a,b,c
1,2,3
```

Then the `csv` processor will take the following event:

```json
{"header": "a,b,c", "message": "1,2,3"}
```

Then, the processor parses the event into the following output. Because `delete_header` is `true` by default, the header `a,b,c` is deleted from the output:
```json
{"message": "1,2,3", "a": "1", "b": "2", "c": "3"}
```

## Metrics

The following table describes common [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. |

The `csv` processor includes the following custom metrics.

**Counter**

The `csv` processor includes the following counter metrics:

* `csvInvalidEvents`: The number of invalid events, usually caused by an unclosed quotation mark in the event itself. OpenSearch Data Prepper throws an exception when an invalid event is parsed. 
