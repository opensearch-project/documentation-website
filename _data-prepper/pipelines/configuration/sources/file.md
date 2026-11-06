---
layout: default
title: File
parent: Sources
grand_parent: Pipelines
nav_order: 24
---

# File source

The `file` plugin reads events from one or more local files. By default, the source reads each file once when the pipeline starts. This is useful for loading seed data, testing processors and sinks, or replaying a fixed dataset. To continuously read lines appended to files, such as application logs, set `tail` to `true`.

The source reads files in one of the following ways, depending on its configuration:

- If you specify `path` and none of the `paths`, `exclude_paths`, `codec`, or `tail` settings, the source reads the file once, line by line, and creates events according to the `format` and `record_type` settings.
- If you specify `paths`, `exclude_paths`, `codec`, or `tail`, the source ignores the `format` setting. When `codec` is configured, `record_type` must be set to `event`. It parses each file using the configured `codec` or, if no `codec` is configured, creates one event for each line. For the structure of these events, see [Event structure](#event-structure).

We recommend setting `record_type` to `event` and configuring a `codec`. The `format` setting and the `string` record type are legacy settings.

## Configuration

The following table lists the general settings for the `file` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`path` | Conditionally | String | An absolute path to the input file inside the Data Prepper container, for example, `/usr/share/data-prepper/data/input.jsonl`. Either `path` or `paths` is required.
`paths` | Conditionally | List | A list of absolute file paths or glob patterns that specify the files to read, for example, `/var/log/app/*.log` or `/var/log/**/*.log`. Either `path` or `paths` is required.
`exclude_paths` | No | List | A list of absolute file paths or glob patterns that specify files to skip among the files matched by `paths`.
`format` | No | String | Specifies how to interpret the file content. Valid values are `json` and `plain`. Use `json` when your file has one JSON object per line or a JSON array. Use `plain` for raw text lines. Applies only when `path` is used without `paths`, `exclude_paths`, `codec`, or `tail`. This is a legacy setting; use `codec` for new configurations. Default is `plain`.
`record_type` | No | String | The type of output record produced by the source. Valid values are `event` and `string`. Use `event` to produce structured events expected by downstream processors and the OpenSearch sink. Must be set to `event` when `codec` is configured. The `string` value is a legacy setting. Default is `string`.
`codec` | No | Object | The codec used to parse the file content, for example, `ndjson`, `json`, `csv`, or `newline`. When `codec` is set, the source creates one event for each record parsed by the codec, and `record_type` must be set to `event`. For codec settings, see [codec]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/#codec).
`compression` | No | String | The compression algorithm used to decompress the files. Valid values are `none`, `gzip`, `snappy`, and `zstd`. Applies only when `path` is used without `paths`, `exclude_paths`, `codec`, or `tail`, or when `codec` is set and `tail` is `false`. Default is `none`.
`encoding` | No | String | The character encoding of the files, for example, `UTF-8` or `ISO-8859-1`. Not applied when `codec` is set. Default is `UTF-8`.
`tail` | No | Boolean | When `true`, the source continuously monitors the files matched by `paths` and `path`, reads lines appended to them, and detects new, rotated, and removed files. When `false`, the source reads each file once. For more settings, see [Tail settings](#tail-settings). Default is `false`.

Duration settings accept ISO 8601 duration notation, such as `PT30S`, or simple notation for seconds and milliseconds, such as `30s` or `500ms`.

### File reading settings

The following settings apply only when `paths`, `exclude_paths`, `codec`, or `tail` is configured.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`include_file_metadata` | No | Boolean | When `true`, adds the `file` object and `offset` field to each event. For more information, see [Event structure](#event-structure). Not applied when `codec` is set. Default is `true`.
`max_line_length` | No | Integer | The maximum length of a line, in characters. The source truncates longer lines to this length. Not applied when `codec` is set. Default is `1048576`.
`read_buffer_size` | No | Integer | The size of the buffer used to read from a file, in bytes. Default is `65536`.
`max_active_files` | No | Integer | The maximum number of files that the source reads at the same time. Additional matching files wait in a queue until a reader becomes available. Default is `1000`.
`reader_threads` | No | Integer | The number of threads used to read files. Default is `4` when `tail` is `true` and `1` when `tail` is `false`.
`max_read_time_per_file` | No | Duration | The maximum amount of time that a reader spends reading a file in a single pass before releasing the thread to other files. This setting also limits how long the source retries writing an event to a full buffer. If the buffer remains full for longer than this time, the event is dropped. Default is `5s`.
`fingerprint_bytes` | No | Integer | The number of bytes at the start of a file used to compute a fingerprint that identifies the file. The source uses the fingerprint only when the file system does not provide a unique file key, such as an inode. Default is `1024`.

### Tail settings

The following settings apply when `tail` is `true`. In tail mode, the source detects two types of file rotation: a file that is renamed and replaced by a new file at the same path, and a file that is truncated after being copied.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`start_position` | No | String | The position from which the source starts reading a file that has no checkpoint entry. Valid values are `beginning` and `end`. When set to `end`, the source skips any content that a file contains when the source first opens it, including files discovered after the pipeline starts. The `end` value is valid only when `tail` is `true`. Default is `beginning`.
`poll_interval` | No | Duration | How often the source scans `paths` for new and removed files. When the file system provides change notifications, the source uses them to detect new and removed files and scans at 10 times this interval. Default is `1s`.
`rotate_wait` | No | Duration | The amount of time that the source waits after a monitored file disappears before treating the file as removed. Default is `5s`.
`rotation_drain_timeout` | No | Duration | The maximum amount of time that the source spends reading the remaining data from a file after detecting that the file was renamed. Default is `30s`.
`close_inactive` | No | Duration | The amount of time without new data after which the source closes the reader for a file. Default is `PT30M`.
`close_removed` | No | Boolean | When `true`, the source closes the reader for a file after the file is removed. Default is `true`.

### Checkpoint settings

The source records the read position of each file in a checkpoint so that it can resume from that position after a restart. The following settings apply only when `paths`, `exclude_paths`, `codec`, or `tail` is configured.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`checkpoint_file` | No | String | The path to the file in which the source stores checkpoints. If not set, the source does not persist checkpoints, and after a restart it reads files according to `start_position`.
`checkpoint_interval` | No | Duration | How often the source writes checkpoints to the `checkpoint_file`. Default is `5s`.
`checkpoint_cleanup_after` | No | Duration | The amount of time after which the source removes the checkpoint entry of a completed file. A file is completed when it is fully read and `tail` is `false` or when it is removed and `tail` is `true`. Default is `P7D` (7 days).

### Acknowledgment settings

The following settings apply only when `paths`, `exclude_paths`, `codec`, or `tail` is configured.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`acknowledgments` | No | Boolean | When `true`, enables [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/#end-to-end-acknowledgments). The source groups events from each file into batches and records the position up to which the sinks have acknowledged the events. Default is `false`.
`batch_size` | No | Integer | The maximum number of events in an acknowledgment batch. Default is `100`.
`batch_timeout` | No | Duration | The maximum amount of time that an acknowledgment batch remains open before the source completes it. Default is `5s`.
`acknowledgment_timeout` | No | Duration | The amount of time that the source waits for the sinks to acknowledge a batch. Default is `60s`.
`max_acknowledgment_retries` | No | Integer | The maximum number of consecutive negative acknowledgments for a file. After this number is exceeded, the source records the failed batch as acknowledged and continues. Default is `3`.

## Event structure

When `paths`, `exclude_paths`, or `tail` is configured and `codec` is not set, the source creates one event for each line. The event contains the following fields.

Field | Description
:--- | :---
`message` | The text of the line.
`file.path` | The absolute path of the file. Added when `include_file_metadata` is `true`.
`file.name` | The name of the file. Added when `include_file_metadata` is `true`.
`offset` | The position in the file, in bytes, at which the source started the read that contains the line. Lines read together share the same offset. Added when `include_file_metadata` is `true`.

The following is an example event:

```json
{
  "message": "2026-10-21T10:00:01Z [ERROR] order 1002 failed",
  "file": {
    "path": "/var/log/app/app.log",
    "name": "app.log"
  },
  "offset": 0
}
```

To parse structured lines, such as JSON, use a `codec` or a processor such as [`parse_json`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/parse-json/).

## Examples

The following examples demonstrate how different file types can be processed.

### JSON file

The following example processes a JSON file:

```yaml
file-to-opensearch:
  source:
    file:
      path: /usr/share/data-prepper/data/input.ndjson
      format: json
      record_type: event
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: file-demo
        username: admin
        password: "<custom-admin-password>"
        insecure: true
```
{% include copy.html %}

### Plain text file

A raw text file can be processed using the following pipeline:

```yaml
plain-file-to-opensearch:
  source:
    file:
      path: /usr/share/data-prepper/data/app.log
      format: plain
      record_type: event
  processor:
    - grok:
        match:
          message:
            - '%{TIMESTAMP_ISO8601:timestamp} \[%{LOGLEVEL:level}\] %{GREEDYDATA:msg}'
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: plain-file-demo
        username: admin
        password: "<custom-admin-password>"
        insecure: true
```
{% include copy.html %}

### CSV file

You can process a CSV file using the `csv` processor:

```yaml
csv-file-to-opensearch:
  source:
    file:
      path: /usr/share/data-prepper/data/ingest.csv
      format: plain  
      record_type: event     
  processor:
    - csv:
        column_names: ["time","level","message"]
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: csv-demo
        username: admin
        password: "<custom-admin-password>"
        insecure: true
```
{% include copy.html %}

### Tailing log files

The following example continuously reads lines appended to all `.log` files in a directory, skips the debug log, and stores read positions in a checkpoint file so that the pipeline resumes from the last position after a restart:

```yaml
tail-logs-to-opensearch:
  source:
    file:
      paths: ["/usr/share/data-prepper/logs/*.log"]
      exclude_paths: ["/usr/share/data-prepper/logs/debug.log"]
      tail: true
      checkpoint_file: /usr/share/data-prepper/data/file-checkpoints.json
  processor:
    - grok:
        match:
          message:
            - '%{TIMESTAMP_ISO8601:timestamp} \[%{LOGLEVEL:level}\] %{GREEDYDATA:msg}'
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: tail-logs-demo
        username: admin
        password: "<custom-admin-password>"
        insecure: true
```
{% include copy.html %}
