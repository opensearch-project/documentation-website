


This guide covers how to use the Replayer to replay captured traffic from a source cluster to a target cluster during the migration process. The Replayer allows users to verify that the target cluster can handle requests in the same way as the source cluster and catch up to real-time traffic for a smooth migration.

## Replayer Configurations

[Replayer settings](Configuration-Options) are configured during the deployment of the Migration Assistant. Make sure to set the authentication mode for the Replayer so it can properly communicate with the target cluster. Refer to the **Limitations** section below for details on how different traffic types are handled.

### Speedup Factor

The `--speedup-factor` option, passed via `trafficReplayerExtraArgs`, adjusts the wait times between requests. For example:
- A speedup factor of `2` sends requests at twice the original speed (e.g., a request originally sent every minute will now be sent every 30 seconds).
- A speedup factor of `0.5` will space requests further apart (e.g., requests every 2 minutes instead of every minute).

This setting can be used to stress test the target cluster or to catch up to real-time traffic, ensuring the target cluster is ready for production client switchover.

## When to Run the Replayer

After deploying the Migration Assistant, the Replayer is not running by default. It should be started only after all metadata and documents have been migrated to ensure that recent changes to the source cluster are properly reflected in the target cluster.

For example, if a document was deleted after a snapshot was taken, starting the Replayer before the document migration is complete may cause the deletion request to execute before the document is even added to the target. Running the Replayer after all other migration processes ensures that the target cluster will be consistent with the source cluster.

## Using the Replayer

To manage the Replayer, use the `console replay` command:

- **Start the Replayer**: 
  ```bash
  console replay start
  ```
  This starts the Replayer with the options specified at deployment.

- **Check Replayer Status**:
  ```bash
  console replay status
  ```
  This command shows whether the Replayer is running, pending, or desired. "Running" shows how many container instances are actively running, "Pending" indicates how many are being provisioned, and "Desired" shows the total number of instances that should be running.

- **Stop the Replayer**:
  ```bash
  console replay stop
  ```

<details>
<summary>
<b>Example Interactions</b>
</summary>

Check the status of the Replayer:
```bash
root@ip-10-0-2-66:~# console replay status
(<ReplayStatus.STOPPED: 4>, 'Running=0\nPending=0\nDesired=0')
```

Start the Replayer:
```bash
root@ip-10-0-2-66:~# console replay start
Replayer started successfully.
Service migration-dev-traffic-replayer-default set to 1 desired count. Currently 0 running and 0 pending.
```

Stop the Replayer:
```bash
root@ip-10-0-2-66:~# console replay stop
Replayer stopped successfully.
Service migration-dev-traffic-replayer-default set to 0 desired count. Currently 0 running and 0 pending.
```
</details>

### Delivery Guarantees

The Replayer pulls traffic from Kafka and advances its commit cursor after requests have been sent to the target cluster. This provides an "at least once" delivery guarantee—requests will be replayed, but success is not guaranteed. You will need to monitor metrics, tuple outputs, or external validation to ensure the target cluster is performing as expected.

## Time Scaling

The Replayer sends requests in the same order they were received on each connection to the source. However, relative timing between different connections is not guaranteed. For example:

- **Scenario**: Two connections exist—one sends a PUT request every minute, and the other sends a GET request every second.
- **Behavior**: The Replayer will maintain the sequence within each connection, but the relative timing between the connections (PUTs and GETs) is not preserved.

### Speedup Factor Example

Assume a source cluster responds to requests (GETs and PUTs) within 100ms:
- With a **speedup factor of 1**, the target will experience the same request rates and idle periods as the source.
- With a **speedup factor of 2**, requests will be sent twice as fast, with GETs sent every 500ms and PUTs every 30 seconds.
- At a **speedup factor of 10**, requests will be sent 10x faster, and as long as the target responds quickly, the Replayer can keep pace.

If the target cannot respond fast enough, the Replayer will wait for the previous request to complete before sending the next one. This may cause delays and affect global relative ordering.

## Transformations

During migrations, some requests may need to be transformed between versions. For example, Elasticsearch supported multiple type mappings in indices, but this is no longer the case in OpenSearch. Clients may need to adjust accordingly by splitting documents into multiple indices or transforming request data.

The Replayer automatically rewrites host and authentication headers, but for more complex transformations, custom transformation rules can be passed via the `--transformer-config` option (as described in the [Traffic Replayer README](https://github.com/opensearch-project/opensearch-migrations/blob/c3d25958a44ec2e7505892b4ea30e5fbfad4c71b/TrafficCapture/trafficReplayer/README.md#transformations)). 

### Example Transformation

Suppose a source request includes a "tagToExcise" element that needs to be removed and its children promoted, and the URI path includes "extraThingToRemove" which should also be removed. The following Jolt script handles this transformation:

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

You can pass Base64-encoded transformation scripts via `--transformer-config-base64` for convenience.

## Troubleshooting

### Client changes
See [[Required Client Changes]] for more information on how clients will need to be updated.

### Request Delivery
The Replayer provides an "at least once" delivery guarantee but does not ensure request success when a replayed request arrives at the target cluster.
