This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/10141).    
{: .warning}



The current OpenSearch stats APIs offer valuable insights into the inner workings of each node and the cluster as a whole. However, they lack certain details such as percentiles and do not provide the semantics of richer metric types like histograms. Consequently, identifying outliers becomes challenging. OpenSearch with Metrics Framework feature adds comprehensive metric support to effectively monitor the cluster.

Developers can easily add new metrics using the Metrics Framework and some of them are already added to visualize the query shaping, see the associated PR [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/10141). OpenTelemetry offers decent support for metrics, and we are leveraging the existing telemetry-otel plugin to provide the implementation for metrics as well. OpenSearch users can easily consume these metrics thorugh opensource OpenTelemetry sinks.


## Get started

The Metrics Framework feature is experimental as of OpenSearch 2.11. To begin using the metrics framework feature, you need to first enable the `telemetry feature` using the `opensearch.experimental.feature.telemetry.enabled` feature flag and subsiquenty using the meatrics framework feature flag. It's important to exercise caution when enabling this feature because it can consume system resources. Detailed information on enabling and configuring metrics framework is described in the following sections.

### Enabling the flag on a node using tarball

The enable flag is toggled using a new Java Virtual Machine (JVM) parameter that is set either in `OPENSEARCH_JAVA_OPTS` or in `config/jvm.options`.

#### Option 1: Enable the experimental feature flag in the `opensearch.yml` file

1. Change to the top directory of your OpenSearch installation:

```bash
cd \path\to\opensearch
```

2. Open your OpenSearch configuration folder, and then open the `opensearch.yml` file with a text editor.
3. Add the following line:

```bash
opensearch.experimental.feature.telemetry.enabled=true
```
{% include copy.html %}

4. Save your changes and close the file.

#### Option 2: Modify jvm.options

Add the following lines to `config/jvm.options` before starting the OpenSearch process to enable the feature and its dependency:

```bash
-Dopensearch.experimental.feature.telemetry.enabled=true
```
{% include copy.html %}

Run OpenSearch:

```bash
./bin/opensearch
```
{% include copy.html %}

#### Option 3: Enable from an environment variable

As an alternative to directly modifying `config/jvm.options`, you can define the properties by using an environment variable. You can enable this feature in a single command when you start OpenSearch or by setting an environment variable.

To add these flags inline when starting OpenSearch, run the following command:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true" ./opensearch-2.9.0/bin/opensearch
```
{% include copy.html %}

To define the environment variable separately, prior to running OpenSearch, run the following command:

```bash
export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true"
 ./bin/opensearch
```
{% include copy.html %}

### Enable with Docker containers

If you’re running Docker, add the following line to `docker-compose.yml` under `environment`:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true"
```
{% include copy.html %}

### Enable for OpenSearch development

To enable the metrics feature, you must first add the correct properties to `run.gradle` before building OpenSearch. See the [Developer Guide](https://github.com/opensearch-project/OpenSearch/blob/main/DEVELOPER_GUIDE.md#gradle-build) for information about how to use Gradle to build OpenSearch.

Add the following properties to `run.gradle` to enable the feature:

```json
testClusters {
  runTask {
    testDistribution = 'archive'
 if (numZones > 1) numberOfZones = numZones
    if (numNodes > 1) numberOfNodes = numNodes
    systemProperty 'opensearch.experimental.feature.telemetry.enabled', 'true'
    }
 }
 ```
 {% include copy.html %}

 ### Enable Metrics Freamework

Once you've enabled the feature flag, you can enable the metrics framework (which is disabled by default) by using the following setting that enables metrics in the opensearch.yaml:

```bash
telemetry.feature.metrics.enabled=true
```

The OpenSearch metrics framework aims to support various telemetry solutions through plugins. The OpenSearch OpenTelemetry plugin `telemetry-otel` is available and must be installed to enable metrics. The following guide provides you with the installation instructions.


### Exporters

1. **Publish Interval:** Metrics framework can locally aggregate the metrics for the unique dimensions for the configured publish interval and then export. By default this is configured for 1 minute but can be changed usin this cluster setting `tlemetry.otel.metrics.publish.interval`
2. **Exporters:** Exporters are responsible for persisting the data. OpenTelemetry provides several out-of-the-box exporters, and OpenSearch supports the following:
    - `LoggingMetricExporter`: Exports metrics to a log file, generating a separate file in the logs directory `_otel_metrics.log`. Default is `telemetry.otel.metrics.exporter.class=io.opentelemetry.exporter.logging.LoggingMetricExporter`.
    - `OtlpGrpcMetricExporter`: Exports spans through gRPC. To use this exporter, you need to install the `otel-collector` on the node. By default, it writes to the http://localhost:4317/ endpoint. To use this exporter, set the following static setting: `telemetry.otel.metrics.exporter.class=io.opentelemetry.exporter.otlp.metrics.OtlpGrpcMetricExporter`.
