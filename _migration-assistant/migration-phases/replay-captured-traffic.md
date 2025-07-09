---
layout: default
title: Replay
nav_order: 7
grand_parent: Migration phases
parent: Live traffic migration
redirect_from:
  - /migration-assistant/migration-phases/using-traffic-replayer/
---

# Using Traffic Replayer

This guide covers how to use Traffic Replayer to replay captured traffic from a source cluster to a target cluster during the migration process. Traffic Replayer allows you to verify that the target cluster can handle requests in the same way as the source cluster and catch up to real-time traffic for a smooth migration.

## When to run Traffic Replayer

After deploying Migration Assistant, Traffic Replayer does not run by default. It should be started only after all metadata and documents have been migrated to ensure that recent changes to the source cluster are properly reflected in the target cluster.

For example, if a document was deleted after a snapshot was taken, starting Traffic Replayer before the document migration is complete may cause the deletion request to execute before the document is added to the target. Running Traffic Replayer after all other migration processes ensures that the target cluster will be consistent with the source cluster.

## Configuration options

[Traffic Replayer settings]({{site.url}}{{site.baseurl}}/migration-assistant/deploying-migration-assistant/configuration-options/) are configured during the deployment of Migration Assistant. Make sure to set the authentication mode for Traffic Replayer so that it can properly communicate with the target cluster. 

## Using Traffic Replayer

To manage Traffic Replayer, use the `console replay` command. The following examples show the available commands.

### Start Traffic Replayer

The following command starts Traffic Replayer with the options specified at deployment:

```bash
console replay start
```

When starting Traffic Replayer, you should receive an output similar to the following:

```bash
root@ip-10-0-2-66:~# console replay start
Replayer started successfully.
Service migration-dev-traffic-replayer-default set to 1 desired count. Currently 0 running and 0 pending.
```

## Check the status of Traffic Replayer

Use the following command to show the status of Traffic Replayer: 

```bash
console replay status
```

Replay will return one of the following statuses:

- `Running` shows how many container instances are actively running. 
- `Pending` indicates how many instances are being provisione.d 
- `Desired` shows the total number of instances that should be running.

You should receive an output similar to the following:

```bash
root@ip-10-0-2-66:~# console replay status
(<ReplayStatus.STOPPED: 4>, 'Running=0\nPending=0\nDesired=0')
```

## Stop Traffic Replayer

The following command stops Traffic Replayer:

```bash
console replay stop
```

You should receive an output similar to the following:

```bash
root@ip-10-0-2-66:~# console replay stop
Replayer stopped successfully.
Service migration-dev-traffic-replayer-default set to 0 desired count. Currently 0 running and 0 pending.
```



### Delivery guarantees

Traffic Replayer retrieves traffic from Kafka and updates its commit cursor after sending requests to the target cluster. This provides an "at least once" delivery guarantee; however, success isn't always guaranteed. Therefore, you should monitor metrics and tuple outputs or perform external validation to ensure that the target cluster is functioning as expected.

## Time scaling

Traffic Replayer sends requests in the same order that they were received from each connection to the source. However, relative timing between different connections is not guaranteed. For example:

- **Scenario**: Two connections exist:one sends a PUT request every minute, and the other sends a GET request every second.
- **Behavior**: Traffic Replayer will maintain the sequence within each connection, but the relative timing between the connections (PUTs and GETs) is not preserved.

Assume that a source cluster responds to requests (GETs and PUTs) within 100 ms:

- With a **speedup factor of 1**, the target will experience the same request rates and idle periods as the source.
- With a **speedup factor of 2**, requests will be sent twice as fast, with GETs sent every 500 ms and PUTs every 30 seconds.
- With a **speedup factor of 10**, requests will be sent 10x faster, and as long as the target responds quickly, Traffic Replayer can maintain the pace.

If the target cannot respond fast enough, Traffic Replayer will wait for the previous request to complete before sending the next one. This may cause delays and affect global relative ordering.

## Transformations

During migrations, some requests may need to be transformed between versions. For example, Elasticsearch previously supported multiple type mappings in indexes, but this is no longer the case in OpenSearch. Clients may need to be adjusted accordingly by splitting documents into multiple indexes or transforming request data.

Traffic Replayer automatically rewrites host and authentication headers, but for more complex transformations, custom transformation rules can be specified using the `--transformer-config` option. For more information, see the [Traffic Replayer README](https://github.com/opensearch-project/opensearch-migrations/blob/c3d25958a44ec2e7505892b4ea30e5fbfad4c71b/TrafficCapture/trafficReplayer/README.md#transformations). 

### Example transformation

Suppose that a source request contains a `tagToExcise` element that needs to be removed and its children promoted and that the URI path includes `extraThingToRemove`, which should also be removed. The following Jolt script handles this transformation:

```json
[{ "JsonJoltTransformerProvider":
[
  {
    "script": {
      "operation": "shift",
      "spec": {
        "payload": {
          "inlinedJsonBody": {
            "top": {
              "tagToExcise": {
                "*": "payload.inlinedJsonBody.top.&" 
              },
              "*": "payload.inlinedJsonBody.top.&"
            },
            "*": "payload.inlinedJsonBody.&"
          },
          "*": "payload.&"
        },
        "*": "&"
      }
    }
  }, 
 {
   "script": {
     "operation": "modify-overwrite-beta",
     "spec": {
       "URI": "=split('/extraThingToRemove',@(1,&))"
     }
  }
 },
 {
   "script": {
     "operation": "modify-overwrite-beta",
     "spec": {
       "URI": "=join('',@(1,&))"
     }
  }
 }
]
}]
```

The resulting request sent to the target will appear similar to the following:

```bash
PUT /oldStyleIndex/moreStuff HTTP/1.0
host: testhostname

{"top":{"properties":{"field1":{"type":"text"},"field2":{"type":"keyword"}}}}
```
{% include copy.html %}

You can pass Base64-encoded transformation scripts using `--transformer-config-base64`.

## Result logs

HTTP transactions from the source capture and those resent to the target cluster are logged in files located at `/shared-logs-output/traffic-replayer-default/*/tuples/tuples.log`. The `/shared-logs-output` directory is shared across containers, including the migration console. You can access these files from the migration console using the same path. Previous runs are also available in a `gzipped` format. 

Each log entry is a newline-delimited JSON object, containing information about the source and target requests/responses along with other transaction details, such as response times. 

These logs contain the contents of all requests, including authorization headers and the contents of all HTTP messages. Ensure that access to the migration environment is restricted, as these logs serve as a source of truth for determining what happened in both the source and target clusters. Response times for the source refer to the amount of time between the proxy sending the end of a request and receiving the response. While response times for the target are recorded in the same manner, keep in mind that the locations of the capture proxy, Traffic Replayer, and target may differ and that these logs do not account for the client's location.
{: .note}


### Example log entry

The following example log entry shows a `/_cat/indices?v` request sent to both the source and target clusters:

```json
{
    "sourceRequest": {
        "Request-URI": "/_cat/indices?v",
        "Method": "GET",
        "HTTP-Version": "HTTP/1.1",
        "Host": "capture-proxy:9200",
        "Authorization": "Basic YWRtaW46YWRtaW4=",
        "User-Agent": "curl/8.5.0",
        "Accept": "*/*",
        "body": ""
    },
    "sourceResponse": {
        "HTTP-Version": {"keepAliveDefault": true},
        "Status-Code": 200,
        "Reason-Phrase": "OK",
        "response_time_ms": 59,
        "content-type": "text/plain; charset=UTF-8",
        "content-length": "214",
        "body": "aGVhbHRoIHN0YXR1cyBpbmRleCAgICAgICB..."
    },
    "targetRequest": {
        "Request-URI": "/_cat/indices?v",
        "Method": "GET",
        "HTTP-Version": "HTTP/1.1",
        "Host": "opensearchtarget",
        "Authorization": "Basic YWRtaW46bXlTdHJvbmdQYXNzd29yZDEyMyE=",
        "User-Agent": "curl/8.5.0",
        "Accept": "*/*",
        "body": ""
    },
    "targetResponses": [{
        "HTTP-Version": {"keepAliveDefault": true},
        "Status-Code": 200,
        "Reason-Phrase": "OK",
        "response_time_ms": 721,
        "content-type": "text/plain; charset=UTF-8",
        "content-length": "484",
        "body": "aGVhbHRoIHN0YXR1cyBpbmRleCAgICAgICB..."
    }],
    "connectionId": "0242acfffe13000a-0000000a-00000005-1eb087a9beb83f3e-a32794b4.0",
    "numRequests": 1,
    "numErrors": 0
}
```
{% include copy.html %}


### Decoding log content

The contents of HTTP message bodies are Base64 encoded in order to handle various types of traffic, including compressed data. To view the logs in a more human-readable format, use the console library `tuples show`. Running the script as follows will produce a `readable-tuples.log` in the home directory:

```shell
console tuples show --in /shared-logs-output/traffic-replayer-default/d3a4b31e1af4/tuples/tuples.log > readable-tuples.log
```

The `readable-tuples.log` should appear similar to the following:

```json
{
    "sourceRequest": {
        "Request-URI": "/_cat/indices?v",
        "Method": "GET",
        "HTTP-Version": "HTTP/1.1",
        "Host": "capture-proxy:9200",
        "Authorization": "Basic YWRtaW46YWRtaW4=",
        "User-Agent": "curl/8.5.0",
        "Accept": "*/*",
        "body": ""
    },
    "sourceResponse": {
        "HTTP-Version": {"keepAliveDefault": true},
        "Status-Code": 200,
        "Reason-Phrase": "OK",
        "response_time_ms": 59,
        "content-type": "text/plain; charset=UTF-8",
        "content-length": "214",
        "body": "health status index       uuid         ..."
    },
    "targetRequest": {
        "Request-URI": "/_cat/indices?v",
        "Method": "GET",
        "HTTP-Version": "HTTP/1.1",
        "Host": "opensearchtarget",
        "Authorization": "Basic YWRtaW46bXlTdHJvbmdQYXNzd29yZDEyMyE=",
        "User-Agent": "curl/8.5.0",
        "Accept": "*/*",
        "body": ""
    },
    "targetResponses": [{
        "HTTP-Version": {"keepAliveDefault": true},
        "Status-Code": 200,
        "Reason-Phrase": "OK",
        "response_time_ms": 721,
        "content-type": "text/plain; charset=UTF-8",
        "content-length": "484",
        "body": "health status index       uuid         ..."
    }],
    "connectionId": "0242acfffe13000a-0000000a-00000005-1eb087a9beb83f3e-a32794b4.0",
    "numRequests": 1,
    "numErrors": 0
}
```


## Amazon CloudWatch metrics and dashboard
Migration Assistant creates an Amazon CloudWatch dashboard named `MigrationAssistant_ReindexFromSnapshot_Dashboard` to visualize the health and performance of the backfill process. This dashboard combines metrics for the backfill workers and migration to Amazon OpenSearch Service, providing insights into the performance and health of the Capture Proxy and Traffic Replayer components, including metrics such as:

- The number of bytes read and written.
- The number of active connections.
- The replay speed multiplier. 

You can find the Capture and Replay dashboard in the AWS Management Console for CloudWatch Dashboards in the AWS Region where you deployed Migration Assistant.

Traffic Replayer emits various OpenTelemetry metrics to Amazon CloudWatch, and traces are sent through AWS X-Ray. The following are some useful metrics that can help evaluate migration performance.

### `sourceStatusCode`

This metric tracks the HTTP status codes for both the source and target clusters, with dimensions for the HTTP verb, such as `GET` or `POST`, and the status code families (200--299). These dimensions can help quickly identify discrepancies between the source and target, such as when `DELETE 200s` becomes `4xx` or `GET 4xx` errors turn into `5xx` errors.

### `lagBetweenSourceAndTargetRequests`

This metric shows the delay between requests hitting the source and target clusters. With a speedup factor greater than 1 and a target cluster that can handle requests efficiently, this value should decrease as the replay progresses, indicating a reduction in replay lag.

### Additional metrics

The following metrics are also reported:

- **Throughput**: `bytesWrittenToTarget` and `bytesReadFromTarget` indicate the throughput to and from the cluster.
- **Retries**: `numRetriedRequests` tracks the number of requests retried due to status code mismatches between the source and target.
- **Event counts**: Various `(*)Count` metrics track the number of completed events.
- **Durations**: `(*)Duration` metrics measure the duration of each step in the process.
- **Exceptions**: `(*)ExceptionCount` shows the number of exceptions encountered during each processing phase.


## CloudWatch considerations

Metrics and dashboards pushed to CloudWatch may experience a visibility lag of around 5 minutes. CloudWatch also retains higher-resolution data for a shorter period than lower-resolution data. For more information, see [Amazon CloudWatch concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html).