---
layout: default
title: Configuration options
nav_order: 15
parent: Deploying migration assistant
---

# Configuration options

This page outlines the configuration options for three key migrations scenarios:

1. **Metadata migration**
2. **Backfill migration with `Reindex-from-Snapshot` (RFS)**
3. **Live capture migration with Capture and Replay (C&R)**

Each of these migrations depend on either a snapshot or a capture proxy. The following example `cdk.context.json `configurations that are used by AWS Cloud Deployment Kits (CDKs) to deploy and configure the Migration Assistant, shown as separate blocks for each migration type. If you are performing a migration that suits multiple scenarios, these options can be combined.


For a complete list of configuration options, see [opensearch-migrations-options.md](https://github.com/opensearch-project/opensearch-migrations/blob/main/deployment/cdk/opensearch-service-migration/options.md). If there is a configuration option you would like that is not found on this page, open an issue in OpenSearch Migrations repository.
{: .tip }

Options for the source cluster endpoint, target cluster endpoint, and existing VPC should be configured for the Migration tools to function effectively.

## Shared configuration options

Each migration configuration shares the following options.


| Name | Example  | Description   |
| :--- | :--- | :--- |
| `sourceClusterEndpoint` | `"https://source-cluster.elb.us-east-1.endpoint.com"`  | The endpoint for the source cluster.  |
| `targetClusterEndpoint` | `"https://vpc-demo-opensearch-cluster-cv6hggdb66ybpk4kxssqt6zdhu.us-west-2.es.amazonaws.com:443"`   | The endpoint for the target cluster. Required if using an existing target cluster for the migration instead of creating a new one. |
| `vpcId` | `"vpc-123456789abcdefgh"`  | The ID of the existing VPC where the migration resources will be placed. The VPC must have at least two private subnets that span two availability zones. |


## Backfill migration using RFS

The following CDK performs a backfill migrations using RFS:

```json
{
  "backfill-migration": {
    "stage": "dev",
    "vpcId": <VPC_ID>,
    "sourceCluster": {
        "endpoint": <SOURCE_CLUSTER_ENDPOINT>,
        "version": "ES 7.10",
        "auth": {"type": "none"}
    },
    "targetCluster": {
        "endpoint": <TARGET_CLUSTER_ENDPOINT>,
        "auth": {
            "type": "basic",
            "username": <TARGET_CLUSTER_USERNAME>,
            "passwordFromSecretArn": <TARGET_CLUSTER_PASSWORD_SECRET>
        }
    },
    "reindexFromSnapshotServiceEnabled": true,
    "reindexFromSnapshotExtraArgs": "",
    "artifactBucketRemovalPolicy": "DESTROY"
  }
}
```

Performing an RFS backfill migration requires an existing snapshot. 


The RFS configuration uses the following options. All options are optional. 

| Name  | Example | Description |
| :--- | :--- | :--- |
| `reindexFromSnapshotServiceEnabled` | `true` | Enables deploying and configuring the RFS ECS service. |
| `reindexFromSnapshotExtraArgs` | `"--target-aws-region us-east-1 --target-aws-service-signing-name es"` | Extra arguments for the Document Migration command, with space separation. See the [RFS Extra Arguments](https://github.com/opensearch-project/opensearch-migrations/blob/main/DocumentsFromSnapshotMigration/README.md#arguments) for more details. You can pass `--no-insecure` to remove the `--insecure` flag. |

To view all available arguments for `reindexFromSnapshotExtraArgs`, see [Snapshot migrations README](https://github.com/opensearch-project/opensearch-migrations/blob/main/DocumentsFromSnapshotMigration/README.md#arguments). At a minimum, no extra arguments may be needed.

## Live capture migration with C&R 

The following sample CDK performs a live capture migration with C&R

```json
{
  "live-capture-migration": {
    "stage": "dev",
    "vpcId": <VPC_ID>,
    "sourceCluster": {
        "endpoint": <SOURCE_CLUSTER_ENDPOINT>,
        "version": "ES 7.10",
        "auth": {"type": "none"}
    },
    "targetCluster": {
        "endpoint": <TARGET_CLUSTER_ENDPOINT>,
        "auth": {
            "type": "basic",
            "username": <TARGET_CLUSTER_USERNAME>,
            "passwordFromSecretArn": <TARGET_CLUSTER_PASSWORD_SECRET>
        }
    },
    "captureProxyServiceEnabled": true,
    "captureProxyExtraArgs": "",
    "trafficReplayerServiceEnabled": true,
    "trafficReplayerExtraArgs": "",
    "artifactBucketRemovalPolicy": "DESTROY"
  }
}
```

Performing a live capture migration requires that a Capture Proxy be configured to capture incoming traffic and send it to the target cluster using the Traffic Replayer service. For arguments available in `captureProxyExtraArgs`, refer to the `@Parameter` fields [here](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/src/main/java/org/opensearch/migrations/trafficcapture/proxyserver/CaptureProxy.java). For `trafficReplayerExtraArgs`, refer to the `@Parameter` fields [here](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficReplayer/src/main/java/org/opensearch/migrations/replay/TrafficReplayer.java). At a minimum, no extra arguments may be needed.


| Name  | Example  | Description   |
| :--- | :--- | :--- |
| `captureProxyServiceEnabled`    | `true`  | Enables the Capture Proxy service deployment using a CloudFormation stack.  |
| `captureProxyExtraArgs`  | `"--suppressCaptureForHeaderMatch user-agent .*elastic-java/7.17.0.*"`  | Extra arguments for the Capture Proxy command, including options specified by the [Capture Proxy](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/src/main/java/org/opensearch/migrations/trafficcapture/proxyserver/CaptureProxy.java).  |
| `trafficReplayerServiceEnabled` | `true`  | Enables the Traffic Replayer service deployment using a  CloudFormation stack.  |
| `trafficReplayerExtraArgs`      | `"--sigv4-auth-header-service-region es,us-east-1 --speedup-factor 5"`                 | Extra arguments for the Traffic Replayer command, including options for auth headers and other parameters specified by the [Traffic Replayer](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficReplayer/src/main/java/org/opensearch/migrations/replay/TrafficReplayer.java). |


For arguments available in `captureProxyExtraArgs`, see the `@Parameter` fields [in the `CaptureProxy.java`](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/src/main/java/org/opensearch/migrations/trafficcapture/proxyserver/CaptureProxy.java). For `trafficReplayerExtraArgs`, see the `@Parameter` fields [in TrafficReplayer.java](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficReplayer/src/main/java/org/opensearch/migrations/replay/TrafficReplayer.java).


## Cluster authentication options

Both the source and target cluster can use no authentication, authentication limited to VPX, basic authentication with a username and password, or AWS Signature Version 4 scoped to a user or role.

### No authentication

```
    "sourceCluster": {
        "endpoint": <SOURCE_CLUSTER_ENDPOINT>,
        "version": "ES 7.10",
        "auth": {"type": "none"}
    }
```

### Basic authentication

```
    "sourceCluster": {
        "endpoint": <SOURCE_CLUSTER_ENDPOINT>,
        "version": "ES 7.10",
        "auth": {
            "type": "basic",
            "username": <TARGET_CLUSTER_USERNAME>,
            "passwordFromSecretArn": <TARGET_CLUSTER_PASSWORD_SECRET>
        }
    }
```

### SigV4 authentication

```
    "sourceCluster": {
        "endpoint": <SOURCE_CLUSTER_ENDPOINT>,
        "version": "ES 7.10",
        "auth": {
            "type": "sigv4",
            "region": "us-east-1",
            "serviceSigningName": "es"
        }
    }
```

The `serviceSigningName` can be `es` for an Elasticsearch or OpenSearch domain, or `aoss` for an OpenSearch Serverless collection.

All of these authentication options apply to both source and target clusters.

## Network configuration

The migration tooling expects the source cluster, target cluster, and migration resources to exist in the same VPC. If this is not the case, manual networking setup outside of this documentation is likely required.
