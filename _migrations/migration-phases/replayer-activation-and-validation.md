---
layout: default
title: Replayer activation and validation
nav_order: 100
parent: Migration phases
---

# Replayer activation and validation

This guide covers how to use the Replayer to replay captured traffic from a source cluster to a target cluster during the migration process. The Replayer allows users to verify that the target cluster can handle requests in the same way as the source cluster and catch up to real-time traffic for a smooth migration.

## When to run the Replayer

After deploying the Migration Assistant, the Replayer is not running by default. It should be started only after all metadata and documents have been migrated to ensure that recent changes to the source cluster are properly reflected in the target cluster.

For example, if a document was deleted after a snapshot was taken, starting the Replayer before the document migration is complete may cause the deletion request to execute before the document is even added to the target. Running the Replayer after all other migration processes ensures that the target cluster will be consistent with the source cluster.

## Configuration options

[Replayer settings]({{site.url}}{{site.baseurl}}/migrations/deploying-migration-assisstant/configuation-options/) are configured during the deployment of the Migration Assistant. Make sure to set the authentication mode for the Replayer so it can properly communicate with the target cluster. For more information about different types of traffic are handled by the Replayer, see [limitations](#limitations).

## Using the Replayer

To manage the Replayer, use the `console replay` command. The following examples show the available commands.

### Start the Replayer

The following command starts the Replayer with the options specified at deployment:

```bash
console replay start
```

When starting the replayer, you should receive an output similar to the following:

```bash
root@ip-10-0-2-66:~# console replay start
Replayer started successfully.
Service migration-dev-traffic-replayer-default set to 1 desired count. Currently 0 running and 0 pending.
```

## Check the Replayer's status

The following command shows the status of the Replayer: 

```bash
console replay status
```

Replay will return one of the following statuses:

- `Running` shows how many container instances are actively running. 
- `Pending` indicates how many are being provisioned 
- `Desired` shows the total number of instances that should be running.

You should receive an output similar to the following:

```bash
root@ip-10-0-2-66:~# console replay status
(<ReplayStatus.STOPPED: 4>, 'Running=0\nPending=0\nDesired=0')
```

## Stop the Replayer

The following command stops the Replayer:

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

The Replayer retrieves traffic from Kafka and updates its commit cursor after sending requests to the target cluster. This provides an "at least once" delivery guarantee, however, successes isn't always guaranteed. Therefore, you should monitor metrics, tuple outputs, or perform external validation to ensure the target cluster is functioning as expected.

## Time scaling

The Replayer sends requests in the same order they were received on each connection to the source. However, relative timing between different connections is not guaranteed. For example:

- **Scenario**: Two connections exist—one sends a PUT request every minute, and the other sends a GET request every second.
- **Behavior**: The Replayer will maintain the sequence within each connection, but the relative timing between the connections (PUTs and GETs) is not preserved.

Assume a source cluster responds to requests (GETs and PUTs) within 100 ms:

- With a **speedup factor of 1**, the target will experience the same request rates and idle periods as the source.
- With a **speedup factor of 2**, requests will be sent twice as fast, with GETs sent every 500 ms and PUTs every 30 seconds.
- With a **speedup factor of 10**, requests will be sent 10x faster, and as long as the target responds quickly, the Replayer can maintain the pace.

If the target cannot respond fast enough, the Replayer will wait for the previous request to complete before sending the next one. This may cause delays and affect global relative ordering.

## Transformations

During migrations, some requests may need to be transformed between versions. For example, Elasticsearch previously supported multiple type mappings in indexes, but this is no longer the case in OpenSearch. Clients may need to adjust accordingly by splitting documents into multiple indexes or transforming request data.

The Replayer automatically rewrites host and authentication headers, but for more complex transformations, custom transformation rules can be specified using the `--transformer-config` option. For more information, see the [Traffic Replayer README](https://github.com/opensearch-project/opensearch-migrations/blob/c3d25958a44ec2e7505892b4ea30e5fbfad4c71b/TrafficCapture/trafficReplayer/README.md#transformations). 

### Example transformation

Suppose a source request contains a "tagToExcise" element that needs to be removed and its children promoted, and the URI path includes "extraThingToRemove" which should also be removed. The following Jolt script handles this transformation:

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

The resulting request to the target will look like this:

```http
PUT /oldStyleIndex/moreStuff HTTP/1.0
host: testhostname

{"top":{"properties":{"field1":{"type":"text"},"field2":{"type":"keyword"}}}}
```

You can pass Base64-encoded transformation scripts using `--transformer-config-base64` for convenience.

## Result logs

HTTP transactions from the source capture and those resent to the target cluster are logged in files located at `/shared-logs-output/traffic-replayer-default/*/tuples/tuples.log`. The `/shared-logs-output` directory is shared across containers, including the migration console. Users can access these files from the migration console using the same path. Previous runs are also available in a `gzipped` format. 

Each log entry is a newline-delimited JSON object, which contains details of the source and target requests/responses along with other transaction details, such as response times. 

These logs contain the contents of all requests, including Authorization headers and the contents of all HTTP messages. Ensure that access to the migration environment is restricted as these logs serve as a source of truth for determining what happened on both the source and target clusters. Response times for the source refer to the time between the proxy sending the end of a request and receiving the response. While response times for the target are recorded in the same manner, keep in mind that the locations of the capture proxy, Replayer, and target may differ, and these logs do not account for the client's location.
{: .note}


### Example log entry

The following example log entry shows `/_cat/indices?v` request sent to both the source and target clusters:

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


### Decoding log content

The contents of HTTP message bodies are Base64 encoded to handle various types of traffic, including compressed data. To view the logs in a more human-readable format, use the console library `tuples show`. Running the script as follows will produce a `readable-tuples.log` in the home directory:

```shell
console tuples show --in /shared-logs-output/traffic-replayer-default/d3a4b31e1af4/tuples/tuples.log > readable-tuples.log
```

The `readable-tuples.log` should look similar to the following:

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


## Metrics

The Replayer emits various OpenTelemetry metrics to CloudWatch, and traces are sent through AWS X-Ray. The following some useful metrics that can help evaluate cluster performance.

### `sourceStatusCode`

This metric tracks the HTTP status codes for both the source and target clusters, with dimensions for the HTTP verb, such as `GET` or `POST`, and the status code families, (200--299). These dimensions help quickly identify discrepancies between the source and target, such as when `DELETE 200s` become `4xx` or `GET 4xx` errors turn into `5xx` errors.

### `lagBetweenSourceAndTargetRequests`

This metric shows the delay between requests hitting the source and target clusters. With a speedup factor greater than 1 and a target cluster that can handle requests efficiently, this value should decrease as the replay progresses, indicating a reduction in replay lag.

### Additional metrics

The following metrics are also reported.

- **Throughput**: `bytesWrittenToTarget` and `bytesReadFromTarget` indicate the throughput to and from the cluster.
- **Retries**: `numRetriedRequests` tracks the number of requests retried due to status-code mismatches between the source and target.
- **Event Counts**: Various `(*)Count` metrics track the number of specific events that have completed.
- **Durations**: `(*)Duration` metrics measure the duration of each step in the process.
- **Exceptions**: `(*)ExceptionCount` shows the number of exceptions encountered during each processing phase.


## CloudWatch considerations

Metrics pushed to CloudWatch may experience around a 5-minute visibility lag. CloudWatch also retains higher-resolution data for a shorter period than lower-resolution data. For more details, see [CloudWatch Metrics retention policies](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html).