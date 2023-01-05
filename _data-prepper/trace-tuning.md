---
layout: default
title: Trace tuning
nav_order: 12
---

# Trace tuning

Data Prepper for trace analytics in version 0.8.x supports both vertical and horizontal scaling. You can adjust the size of your single Data Prepper instance to meet your workload's demands and scale vertically. 

You can scale horizontally by deploying multiple Data Prepper instances to form a cluster by using the [Core Peer Forwarder](https://github.com/opensearch-project/data-prepper/blob/main/docs/peer_forwarder.md). This enables Data Prepper instances to communicate with instances in the cluster, and is required for horizontally-scaling deployments.

## Scaling tips

The following sections describe useful tips for scaling. We recommend that you modify parameters based on the requirements. We also recommend that you monitor the Data Prepper host metrics and OpenSearch metrics to ensure the configuration is working as expected.

### Buffer

The total number of trace requests that Data Prepper is processing is equal to sum of `buffer_size` in `otel-trace-pipeline` and `raw-trace-pipeline`. The total number of trace requests to OpenSearch is equal to the product of `batch_size` and `workers` in `raw-trace-pipeline`.

We recommend that you use the following parameters for buffer settings:
 * Have the same `buffer_size` value in `otel-trace-pipeline` and `raw-trace-pipeline`
 * That the values `buffer_size` >= `workers` * `batch_size` in the `raw-trace-pipeline`
 

### Workers 

The `workers` setting determines the number of threads that are used by Data Prepper to process requests from the buffer. We recommend that you set `workers` based on the CPU utilization. This value can be higher than available processors, as Data Prepper spends significant input/output time when sending data to OpenSearch.

### Heap

Configure the heap of Data Prepper by setting the `JVM_OPTS` environmental variable. We recommend that you set the heap value to a minimum of `4` * `batch_size` * `otel_send_batch_size` * `maximum size of indvidual span`.

As mentioned in the [setup setpes](trace_setup.md#opentelemetry-collector), set `otel_send_batch_size` to a value of `50` in your opentelemetry collector configuration.

<!--- This link doesn't work. Is there a current link we can use? --->

### Local disk

Data Prepper uses the local disk to store metadata required for service-map processing, so we recommend only storing the key fields `traceId`, `spanId`, `parentSpanId`, `spanKind`, `spanName` and `serviceName`. The service-map plugin ensures that it only stores two files, with each storing `window_duration` seconds of data. During testing we found that, for a throughput of `3000 spans/second`, the total disk usage was `4 MB`.

Data Prepper also uses the local disk to write logs. In the most recent version of Data Prepper, you can redirect the logs to the path of your preference.


## AWS

The [AWS EC2 Cloudformation](https://github.com/opensearch-project/data-prepper/blob/main/deployment-template/ec2/data-prepper-ec2-deployment-cfn.yaml) template provides a user-friendly mechanism to configure the above scaling attributes.

The [Kubernetes configuration files](https://github.com/opensearch-project/data-prepper/blob/main/examples/dev/k8s/README.md) and [EKS configuration files](https://github.com/opensearch-project/data-prepper/blob/main/deployment-template/eks/README.md) are available to configure these attributes in a cluster deployment.

## Benchmark

We ran tests in a `r5.xlarge` EC2 instance with the following configuration:

 
 * `buffer_size`: 4096
 * `batch_size`: 256
 * `workers`: 8
 * `Heap`: 10GB
 
The above setup was able to handle a throughput of `2100` spans/second at `20` percent CPU utilization.
 