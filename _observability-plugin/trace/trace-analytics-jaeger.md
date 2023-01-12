---
layout: default
title: Analyze Jaeger trace data 
parent: Trace analytics
nav_order: 55
---

# Analyze Jaeger trace data

Introduced 2.5
{: .label .label-purple }

The Trace analytics functionality in the OpenSearch Observability plugin now supports Jaeger trace data. If you use OpenSearch as the backend for Jaeger trace data, you can use the Trace analytics built-in analysis capabilities. This provides support for OpenTelemetry (OTEL) formatted trace data.

When you perform trace analytics, you can select from two data sources:

- **Data Prepper** – Data ingested into OpenSearch through Data Prepper. <!--This data source requires OpenTelemetry (OTEL) index type.-->
- **Jaeger** – Trace data stored within OpenSearch as its backend. <!--This data source requires the Jaeger index type.-->

If you currently store your Jaeger trace data in OpenSearch, you can now use the capabilities built into Trace Analytics to analyze the error rates and latencies You can also filter the traces and look into the span details of a trace to pinpoint any service issues.

When you ingest Jaeger data into OpenSearch, it gets stored in a different index than the OTA-generated index that gets created when you run data through the Data Prepper. You can indicate which data source on which you want to perform trace analytics with the data source selector in the Dashboards.

Jaeger trace data that you can analyze includes span data, as well as service and operation endpoint data. Jaeger span data analysis requires some configuration.

Each time you ingest data for Jaeger, it creates a separate index for that day. The Dashboards will show the current index that has a mapping.

To learn more about Jaeger data tracing, see the [Jaeger](https://www.jaegertracing.io/) open source documentation.

## Data Ingestion Requirements

If you want to see errors in your trace data, you need to set the following ElasticSearch flag to true prior to data ingestion: `--es.tags-as-fields.all=true`.

Jaeger data that is ingested for OpenSearch needs to have the  flag set for errors. If data is not ingested in this format it will not work for trace analytics with OpenSearch.

### About Data ingestion with Jaeger indexes

Trace analytics for non-Jaeger data use OTEL indexes with the naming conventions `otel-v1-apm-span-*` or `otel-v1-apm-service-map*`.

Jaeger indexes follow the naming conventions `jaeger-span-*` or `jaeger-service-*`.

## How to set up OpenSearch to use Jaeger data

To use trace analytics with Jaeger data, you need to configure error capability for use with trace analytics. We provide a sample Docker compose file that contains the required configurations.

### Step 1: Run the Docker compose file

Use the following Docker compose file to enable Jaeger data for trace analytics. Copy the following Docker compose file contents and save it as `docker-compose.yml`.

```
version: '3'
services:
  opensearch-node1: # This is also the hostname of the container within the Docker network (i.e. https://opensearch-node1/)
    image: opensearchproject/opensearch:latest # Specifying the latest available image - modify if you want a specific version
    container_name: opensearch-node1
    environment:
      - cluster.name=opensearch-cluster # Name the cluster
      - node.name=opensearch-node1 # Name the node that will run in this container
      - discovery.seed_hosts=opensearch-node1,opensearch-node2 # Nodes to look for when discovering the cluster
      - cluster.initial_cluster_manager_nodes=opensearch-node1,opensearch-node2 # Nodes eligibile to serve as cluster manager
      - bootstrap.memory_lock=true # Disable JVM heap memory swapping
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" # Set min and max JVM heap sizes to at least 50% of system RAM
      - "DISABLE_SECURITY_PLUGIN=true"
    ulimits:
      memlock:
        soft: -1 # Set memlock to unlimited (no soft or hard limit)
        hard: -1
      nofile:
        soft: 65536 # Maximum number of open files for the opensearch user - set to at least 65536
        hard: 65536
    volumes:
      - opensearch-data1:/usr/share/opensearch/data # Creates volume called opensearch-data1 and mounts it to the container
    ports:
      - "9200:9200"
      - "9600:9600"
    networks:
      - opensearch-net # All of the containers will join the same Docker bridge network
  opensearch-node2:
    image: opensearchproject/opensearch:latest # This should be the same image used for opensearch-node1 to avoid issues
    container_name: opensearch-node2
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node2
      - discovery.seed_hosts=opensearch-node1,opensearch-node2
      - cluster.initial_cluster_manager_nodes=opensearch-node1,opensearch-node2
      - bootstrap.memory_lock=true
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m"
      - "DISABLE_SECURITY_PLUGIN=true"
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - opensearch-data2:/usr/share/opensearch/data
    networks:
      - opensearch-net
  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:latest # Make sure the version of opensearch-dashboards matches the version of opensearch installed on other nodes
    container_name: opensearch-dashboards
    ports:
      - 5601:5601 # Map host port 5601 to container port 5601
    expose:
      - "5601" # Expose port 5601 for web access to OpenSearch Dashboards
    environment:
      OPENSEARCH_HOSTS: '["http://opensearch-node1:9200","http://opensearch-node2:9200"]' # Define the OpenSearch nodes that OpenSearch Dashboards will query
      DISABLE_SECURITY_DASHBOARDS_PLUGIN: true
    networks:
      - opensearch-net
  jaeger-collector:
    image: jaegertracing/jaeger-collector:latest
    ports:
      - "14269:14269"
      - "14268:14268"
      - "14267:14267"
      - "14250:14250"
      - "9411:9411"
    networks:
      - opensearch-net
    restart: on-failure
    environment:
      - SPAN_STORAGE_TYPE=opensearch
      - ES_TAGS_AS_FIELDS_ALL=true
    command: [
      "--es.server-urls=http://opensearch-node1:9200",
    ]
    depends_on:
      - opensearch-node1

  jaeger-agent:
    image: jaegertracing/jaeger-agent:latest
    hostname: jaeger-agent
    command: ["--reporter.grpc.host-port=jaeger-collector:14250"]
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
    networks:
      - opensearch-net
    restart: on-failure
    environment:
      - SPAN_STORAGE_TYPE=opensearch
    depends_on:
      - jaeger-collector

  hotrod:
    image: jaegertracing/example-hotrod:latest
    ports: 
      - "8080:8080"
    command: ["all"]
    environment:
      - JAEGER_AGENT_HOST=jaeger-agent
      - JAEGER_AGENT_PORT=6831
    networks:
      - opensearch-net
    depends_on:
      - jaeger-agent

volumes:
  opensearch-data1:
  opensearch-data2:

networks:
  opensearch-net:
```

### Step 2: Start the cluster

Run the following command to deploy the Docker compose YAML file.

```
docker compose up -d
```
To stop the cluster, run the following command:

``` 
docker compose down
```

## Step 2: View trace data in OpenSearch Dashboards

After you generate Jaeger trace data you can go to OpenSearch Dashboards to view your trace data.

Go to OpenSearch Dashboards Trace Analytics at [Trace Analytics](http://localhost:5601/app/observability-dashboards#/trace_analytics/home).


<!-- saving these instructions. using entire docker compose file instead of individual commands. 
### Step 1: Set up OpenSearch and OpenSearch Dashboards

You need to set up a local instance with Docker.

Run the following command to set up OpenSearch with Docker:

```
docker run --rm -it --name=opensearch -e "ES_JAVA_OPTS=-Xms2g -Xmx2g" -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "DISABLE_SECURITY_PLUGIN=true" opensearchproject/opensearch:latest
```

Run the following command to set up OpenSearch Dashboards with Docker:

```
Need info here 
```
 from the step 1 - need the opensearch-dashboards version of the kibana 6.8.0 command here 

### Step 2: Set up Jaeger

To deploy Jaeger to run all the backend components in the same process, you need to get either the Jaeger binary or the Docker image from [Download Jaeger](https://www.jaegertracing.io/download/).

The required flags are:

- `--link=opensearch` – Link to the OpenSearch container.
- `SPAN_STORAGE_TYPE=elasticsearch` – Defines the ElasticSearch storage type to store the Jaeger traces.
- `ES_TAGS_AS_FIELDS_ALL=true` – Sets OpenSearch mapping to ElasticSearch tags in Jaeger traces.

Jaeger currently provides ElasticSearch as the storage type. 
{:.note}

Run the following command to deploy Jaeger.

```
docker run --rm -it --link=opensearch --name=jaeger -e SPAN_STORAGE_TYPE=elasticsearch -e ES_SERVER_URLS=http://172.17.0.2:9200 -e ES_TAGS_AS_FIELDS_ALL=true -e ES_VERSION=7 -p 16686:16686 jaegertracing/all-in-one:1.38
```

Upon success, you should be able to get to the Jaeger UI from http://localhost:16686.


### Step 3: Simulate trace data

With Jaeger running, now you can create traces to verify they are stored with the OpenSearch instance.

To verify trace storage with OpenSearch, run the following command.

```
docker run --rm --link jaeger -e JAEGER_AGENT_HOST=jaeger -e JAEGER_AGENT_PORT=6831 -p 8080-8083:8080-8083 jaegertracing/example-hotrod:latest all
```
-->
## Use trace analytics in OpenSearch Dashboards

To analyze your Jaeger trace data in the Dashboards, you need to set up Trace Analytics first. To get started, see [Get started with Trace Analytics]({{site.url}}{{site.baseurl}}/observability-plugin/trace/get-started/).

### Data sources

You can specify either Data Prepper or Jaeger as your data source when you perform trace analytics.
From the OpenSearch Dashboards, go to **Observability > Trace Analytics** and select Jaeger.

![Select data source]({{site.url}}{{site.baseurl}}/images/trace-analytics/select-data.png)

## Dashboards views

After you select Jaeger for the data source, you can view all of your indexed data in **Dashboard** view including **Error rate** and **Throughput**.

### Error rate

You can view the Trace error count over time in the Dashboard, and also view the top five combinations of services and operations that have a non-zero error rate.

![Error rate]({{site.url}}{{site.baseurl}}/images/trace-analytics/error-rate.png)

### Throughput

With **Throughput** selected, you can see the throughput of traces on Jaeger indexes that are coming in over time.

You can select an individual Trace from **Top 5 Service and Operation Latency** list and view the detailed trace data.

![Throughput]({{site.url}}{{site.baseurl}}/images/trace-analytics/throughput.png)

You can also see the combinations of services and operations that have the highest latency.

If you select one of the entries for Service and Operation Name and go to the **Traces** column to select a trace, it will add the service and operation as filters for you.

In **Traces**, you can see the latency and errors for the filtered service and operation for each individual Trace ID in the list.

![Select data source]({{site.url}}{{site.baseurl}}/images/trace-analytics/service-trace-data.png)

If you select an individual Trace ID, you can see more detailed information about the trace, such as time spent by the service and each span for the service and operation. You can also view the payload that you get from the index in JSON format.

![Select data source]({{site.url}}{{site.baseurl}}/images/trace-analytics/trace-details.png)

### Services

You can also look at individual error rates and latency for each individual service. Go to **Observability > Trace Analytics > Services**. In **Services**, you can see the average latency, error rate, throughput and trace for each service in the list.

![Services list]({{site.url}}{{site.baseurl}}/images/trace-analytics/services-jaeger.png)
