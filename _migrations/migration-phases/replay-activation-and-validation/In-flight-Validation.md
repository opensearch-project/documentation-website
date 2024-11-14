


The Replayer is a long-running process that makes requests to a target cluster to maintain synchronization with the source cluster and enable users to compare the performance between the two clusters. There are two primary ways to assess how the target requests are being handled: through logs and metrics.

## Result Logs

HTTP transactions from the source capture and those resent to the target cluster are logged in files located at `/shared-logs-output/traffic-replayer-default/*/tuples/tuples.log`. The `/shared-logs-output` directory is shared across containers, including the migration console. Users can access these files from the migration console using the same path. Previous runs are also available in gzipped form. 

Each log entry is a newline-delimited JSON object, which contains details of the source and target requests/responses along with other transaction details, such as response times. 

> **Note:** These logs contain the contents of all requests, including Authorization headers and the contents of all HTTP messages. Ensure that access to the migration environment is restricted as these logs serve as a source of truth for determining what happened on both the source and target clusters. Response times for the source refer to the time between the proxy sending the end of a request and receiving the response. While response times for the target are recorded in the same manner, keep in mind that the locations of the capture proxy, replayer, and target may differ, and these logs do not account for the client's location.

<details>
<summary>
<b>Example Log Entry</b>
</summary>

Below is an example log entry for a `/_cat/indices?v` request sent to both the source and target clusters:

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
</details>

### Decoding Log Content

The contents of HTTP message bodies are Base64 encoded to handle various types of traffic, including compressed data. To view the logs in a more human-readable format, use the console library `tuples show`. Running the script as follows will produce a `readable-tuples.log` in the home directory:

```shell
console tuples show --in /shared-logs-output/traffic-replayer-default/d3a4b31e1af4/tuples/tuples.log > readable-tuples.log
```

<details>
<summary>
</b>Example log entry would look after running the script</b>
</summary>

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
</details>

## Metrics

The Replayer emits various OpenTelemetry metrics to CloudWatch, and traces are sent through AWS X-Ray. Here are some useful metrics that help evaluate cluster performance:

### `sourceStatusCode`

This metric tracks the HTTP status codes for both the source and target clusters, with dimensions for the HTTP verb (e.g., GET, POST) and the status code families (e.g., 200-299). These dimensions help quickly identify discrepancies between the source and target, such as when DELETE 200s become 4xx or GET 4xx errors turn into 5xx errors.

### `lagBetweenSourceAndTargetRequests`

This metric shows the delay between requests hitting the source and target clusters. With a speedup factor greater than 1 and a target cluster that can handle requests efficiently, this value should decrease as the replay progresses, indicating a reduction in replay lag.

### Additional Metrics

- **Throughput**: `bytesWrittenToTarget` and `bytesReadFromTarget` indicate the throughput to and from the cluster.
- **Retries**: `numRetriedRequests` tracks the number of requests retried due to status-code mismatches between the source and target.
- **Event Counts**: Various `(*)Count` metrics track the number of specific events that have completed.
- **Durations**: `(*)Duration` metrics measure the duration of each step in the process.
- **Exceptions**: `(*)ExceptionCount` shows the number of exceptions encountered during each processing phase.

## Troubleshooting

### CloudWatch Considerations

Metrics pushed to CloudWatch may experience around a 5-minute visibility lag. CloudWatch also retains higher-resolution data for a shorter period than lower-resolution data. For more details, see [CloudWatch Metrics Retention Policies](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) ↗.
