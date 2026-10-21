---
layout: default
title: Running Data Prepper
parent: Getting started
nav_order: 20
---

# Running Data Prepper

OpenSearch Data Prepper requires at least one pipeline to start. If Data Prepper finds no pipeline configuration file, it logs the following error and exits:

```text
ERROR org.opensearch.dataprepper.pipeline.parser.PipelineConfigurationFileReader - Pipelines configuration file not found at /usr/share/data-prepper/pipelines
```

On this page, you'll define a minimal pipeline, start Data Prepper, and send it a test event. If you haven't installed Data Prepper, see [Installing Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/installing/). For more information about pipeline configuration, see [Configuring pipelines]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/configuring-pipelines/).

## Step 1: Define a pipeline

Create a file named `pipelines.yaml` containing the following pipeline configuration:

```yaml
test-pipeline:
  source:
    http:
      ssl: false
  sink:
    - stdout:
```
{% include copy.html %}

This pipeline, named `test-pipeline`, receives events using the [`http`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/http/) source on port `2021` and prints each event to the Data Prepper log using the [`stdout`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/stdout/) sink. The pipeline contains no processors, so events are not modified.

## Step 2: Start Data Prepper

Start Data Prepper using the Docker image or a Linux archive.

### Docker

From the directory containing `pipelines.yaml`, run the following command:

```bash
docker run --name data-prepper \
  -p 2021:2021 -p 4900:4900 \
  -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml \
  opensearchproject/data-prepper:latest
```
{% include copy.html %}

The `-v` option mounts `pipelines.yaml` into the `pipelines` directory of the container. `${PWD}` is your current directory, so `${PWD}/pipelines.yaml` is the absolute path to the file, which Docker requires for mounts. The `-p` options publish port `2021` for the `http` source and port `4900` for the [core APIs]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/core-apis/).

To use your own server configuration file, mount it as `/usr/share/data-prepper/config/data-prepper-config.yaml`:

```bash
docker run --name data-prepper \
  -p 2021:2021 -p 4900:4900 \
  -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml \
  -v ${PWD}/data-prepper-config.yaml:/usr/share/data-prepper/config/data-prepper-config.yaml \
  opensearchproject/data-prepper:latest
```
{% include copy.html %}

### Linux archive

Copy `pipelines.yaml` into the `pipelines` directory of the Data Prepper home directory. Then run the following command from the home directory:

```bash
bin/data-prepper
```
{% include copy.html %}

Alternatively, provide the pipeline configuration file and the server configuration file as arguments, in that order:

```bash
bin/data-prepper /path/to/pipelines.yaml /path/to/data-prepper-config.yaml
```
{% include copy.html %}

## Step 3: Send a test event

When the pipeline is ready, the Data Prepper log contains the following line:

```text
INFO  org.opensearch.dataprepper.plugins.source.loghttp.HTTPSource - Started http source on port 2021...
```

In a new terminal window, send an event to the `http` source. The source accepts a JSON array in which each object becomes one event:

```bash
curl -X POST http://localhost:2021/log/ingest \
  -H "Content-Type: application/json" \
  -d '[{"message": "Hello, Data Prepper!"}]'
```
{% include copy.html %}

Data Prepper responds with `200 OK`, and the `stdout` sink prints the event to the Data Prepper log:

```json
{"message":"Hello, Data Prepper!"}
```

## Step 4: List the running pipelines

To list the running pipelines, send a request to the core APIs. The request depends on the [default server configuration]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/installing/#server-configuration) of your installation.

For the Docker image, use `https` and the default credentials. The `-k` option skips certificate verification because the image uses a self-signed certificate:

```bash
curl -k -u admin:admin https://localhost:4900/list
```
{% include copy.html %}

For a Linux archive, use `http`:

```bash
curl http://localhost:4900/list
```
{% include copy.html %}

The response contains the pipeline that you defined:

```json
{"pipelines":[{"name":"test-pipeline"}]}
```

## Step 5: Stop Data Prepper

To stop Data Prepper, press `Ctrl+C` in the terminal in which Data Prepper is running. If you started the Docker container in the background, run `docker stop data-prepper`.

Alternatively, send a shutdown request to the core APIs. For the Docker image, send the following request:

```bash
curl -k -u admin:admin -X POST https://localhost:4900/shutdown
```
{% include copy.html %}

For a Linux archive, send the following request:

```bash
curl -X POST http://localhost:4900/shutdown
```
{% include copy.html %}

To remove the stopped Docker container so that you can reuse the `data-prepper` container name, run `docker rm data-prepper`.

## Running pipelines that read and write files

The file-based examples in [Configuring pipelines]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/configuring-pipelines/) read from and write to the `/usr/share/data-prepper/data` directory. To run these examples, create a `data` directory containing an `input.txt` file.

In Docker, mount the `data` directory into the container along with the pipeline file:

```bash
docker run --name data-prepper \
  -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml \
  -v ${PWD}/data:/usr/share/data-prepper/data \
  opensearchproject/data-prepper:latest
```
{% include copy.html %}

Data Prepper writes the processed events to `data/output.txt`.

For a Linux archive, replace the `path` values in the pipeline with the absolute paths to the input and output files on your host.

## Running multiple pipelines

Data Prepper loads every YAML file in the `pipelines` directory, and each file can define one or more pipelines. For more information, see [Multiple pipelines]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/configuring-pipelines/#multiple-pipelines). To run pipelines from multiple files in Docker, mount a directory instead of a single file:

```bash
docker run --name data-prepper \
  -p 2021:2021 -p 4900:4900 \
  -v ${PWD}/pipelines:/usr/share/data-prepper/pipelines \
  opensearchproject/data-prepper:latest
```
{% include copy.html %}

## Updating pipelines

Data Prepper reads pipeline configuration files only at startup. After you edit, add, or delete a pipeline configuration file, restart Data Prepper to apply the change.

## Next steps

- [Ingest log data into OpenSearch]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/ingesting-log-data/) by building a pipeline that parses raw Apache access logs and writes them to OpenSearch.
