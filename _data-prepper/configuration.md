---
layout: default
title: Configuration
nav_order: 12
---

# Configuration

A Data Prepper instance requires two configuration files to run, and allows an optional third Log4j2 configuration file.

1. A YAML file which describes the data pipelines to run (including sources, processors, and sinks)
2. A YAML file containing Data Prepper server settings, primarily for interacting with the exposed Data Prepper server APIs
3. An optional Log4j 2 configuration file (can be JSON, YAML, XML, or .properties)

For Data Prepper before version 2.0, the `.jar` file expects the pipeline configuration file path followed by the server configuration file path.

## Pipeline configuration and file path syntax example

```
java -jar data-prepper-core-$VERSION.jar pipelines.yaml data-prepper-config.yaml
```

Optionally add `"-Dlog4j.configurationFile=config/log4j2.properties"` to the command if you would like to pass a custom Log4j 2 configuration file. If the properties file is not provided, Data Prepper will default to the `log4j2.properties` file in the shared-config directory.


For Data Prepper 2.0 or above, Data Prepper is launched through `data-prepper` script with no additional command line arguments needed:
```
bin/data-prepper
```

Configuration files are read from specific subdirectories in the application's home directory:
1. `pipelines/`: for pipelines configurations; pipelines configurations can be written in one and more YAML files
2. `config/data-prepper-config.yaml`: for Data Prepper server configurations

You can continue to supply your own pipeline configuration file path followed by the server configuration file path, but the support for this method will be dropped in a future release. 

## Custom pipeline configuration and file path syntax example

```
bin/data-prepper pipelines.yaml data-prepper-config.yaml
```

Additionally, Log4j 2 configuration file is read from `config/log4j2.properties` in the application's home directory.

## Pipeline configuration

### Example Pipeline configuration file (pipelines.yaml)

```yaml
entry-pipeline:
  workers: 4
  delay: "100"
  source:
    otel_trace_source:
      ssl: false
  sink:
    - pipeline:
        name: "raw-pipeline"
    - pipeline:
        name: "service-map-pipeline"
raw-pipeline:
  workers: 4
  source:
    pipeline:
      name: "entry-pipeline"
  processor:
    - otel_trace_raw:
  sink:
    - stdout:
service-map-pipeline:
  workers: 4
  delay: "100"
  source:
    pipeline:
      name: "entry-pipeline"
  processor:
    - service_map_stateful:
  sink:
    - stdout:
```
This sample pipeline creates a source to receive trace data and outputs transformed data to stdout. 