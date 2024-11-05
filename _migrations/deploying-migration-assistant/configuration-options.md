---
layout: default
title: Configuration options
nav_order: 15
parent: Deploying migration assistant
---

# Configuration options

This page outlines the configuration options for three key migrations:
1. **Metadata Migration**
2. **Backfill Migration with Reindex-from-Snapshot (RFS)**
3. **Live Capture Migration with Capture and Replay (C&R)**

Each of these migrations may depend on either a snapshot or a capture proxy. The CDK context blocks below are shown as separate context blocks for each migration type for simplicity. If performing multiple migration types, combine these options, as the actual execution of each migration is controlled from the Migration Console.

It also has a section describing how to specify the auth details for the source and target cluster (no auth, basic auth with a username and password, or sigv4 auth).

> [!TIP]
For a complete list of configuration options, please refer to the [opensearch-migrations options.md](https://github.com/opensearch-project/opensearch-migrations/blob/main/deployment/cdk/opensearch-service-migration/options.md) but please open an issue for consultation if changing an option that is not listed on this page.

Options for the source cluster endpoint, target cluster endpoint, and existing VPC should be configured for the Migration tools to function effectively.


## Metadata Migration Options

## Sample Metadata Migration CDK Options

```json
{
  "metadata-migration": {
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
    "artifactBucketRemovalPolicy": "DESTROY"
  }
}
```

There are currently no CDK options specific to Metadata migrations, which are performed from the Migration Console. This migration requires an existing snapshot, which can be created from the Migration Console.

<details>
<summary><b>Shared configuration options table</b>
</summary>

| Name                  | Example                                                                                             | Description                                                                                                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sourceClusterEndpoint` | `"https://source-cluster.elb.us-east-1.endpoint.com"`                                               | The endpoint for the source cluster.                                                                                                                                        |
| `targetClusterEndpoint` | `"https://vpc-demo-opensearch-cluster-cv6hggdb66ybpk4kxssqt6zdhu.us-west-2.es.amazonaws.com:443"`   | The endpoint for the target cluster. Required if using an existing target cluster for the migration instead of creating a new one.                                           |
| `vpcId`               | `"vpc-123456789abcdefgh"`                                                                           | The ID of the existing VPC where the migration resources will be placed. The VPC must have at least two private subnets that span two availability zones.                    |

</details>

## Backfill Migration with Reindex-from-Snapshot (RFS) Options

### Sample Backfill Migration CDK Options

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

Performing a Reindex-from-Snapshot backfill migration requires an existing snapshot. The CDK options specific to backfill migrations are listed below. To view all available arguments for `reindexFromSnapshotExtraArgs`, see [here](https://github.com/opensearch-project/opensearch-migrations/blob/main/DocumentsFromSnapshotMigration/README.md#arguments). At a minimum, no extra arguments may be needed.

<details>
<summary><b>Backfill specific configuration options table</b>
</summary>

| Name                            | Example                                                               | Description                                                                                                                                                                                                 |
|---------------------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `reindexFromSnapshotServiceEnabled` | `true`                                                                | Enables deploying and configuring the RFS ECS service.                                                                                                                                                      |
| `reindexFromSnapshotExtraArgs`      | `"--target-aws-region us-east-1 --target-aws-service-signing-name es"` | Extra arguments for the Document Migration command, with space separation. See the [RFS Extra Arguments](https://github.com/opensearch-project/opensearch-migrations/blob/main/DocumentsFromSnapshotMigration/README.md#arguments) for more details. You can pass `--no-insecure` to remove the `--insecure` flag. |

</details>

## Live Capture Migration with Capture and Replay (C&R) Options

### Sample Live Capture Migration CDK Options

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

Performing a live capture migration requires that a Capture Proxy be configured to capture incoming traffic and send it to the target cluster via the Traffic Replayer service. For arguments available in `captureProxyExtraArgs`, refer to the `@Parameter` fields [here](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/src/main/java/org/opensearch/migrations/trafficcapture/proxyserver/CaptureProxy.java). For `trafficReplayerExtraArgs`, refer to the `@Parameter` fields [here](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficReplayer/src/main/java/org/opensearch/migrations/replay/TrafficReplayer.java). At a minimum, no extra arguments may be needed.

<details>
<summary><b>Capture and Replay specific configuration options table</b>
</summary>

| Name                           | Example                                                                                | Description                                                                                                                                                                                                                                                                             |
|--------------------------------|----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `captureProxyServiceEnabled`    | `true`                                                                                 | Enables the Capture Proxy service deployment via a new CloudFormation stack.                                                                                                                                                                     |
| `captureProxyExtraArgs`         | `"--suppressCaptureForHeaderMatch user-agent .*elastic-java/7.17.0.*"`                 | Extra arguments for the Capture Proxy command, including options specified by the [Capture Proxy](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/src/main/java/org/opensearch/migrations/trafficcapture/proxyserver/CaptureProxy.java).                         |
| `trafficReplayerServiceEnabled` | `true`                                                                                 | Enables the Traffic Replayer service deployment via a new CloudFormation stack.                                                                                                                                                                   |
| `trafficReplayerExtraArgs`      | `"--sigv4-auth-header-service-region es,us-east-1 --speedup-factor 5"`                 | Extra arguments for the Traffic Replayer command, including options for auth headers and other parameters specified by the [Traffic Replayer](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficReplayer/src/main/java/org/opensearch/migrations/replay/TrafficReplayer.java). |

</details>

## Cluster Authentication Options

Both the source and target cluster can use no authentication (e.g. limited to the VPC), basic authentication with a username and password, or SigV4 scoped to a user or role.

Examples of each of these are below.

No auth:
```
    "sourceCluster": {
        "endpoint": <SOURCE_CLUSTER_ENDPOINT>,
        "version": "ES 7.10",
        "auth": {"type": "none"}
    }
```

Basic auth:
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

SigV4 auth:
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

All of these auth mechanisms apply to both source and target clusters.

## Troubleshooting

### Restricted Permissions
When deploying if part of an [AWS Organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) ↗ some permissions / resources might not be allowed.  The full list can be generated from the synthesized cdk output with the awsFeatureUsage script.

```
/opensearch-migrations/deployment/cdk/opensearch-service-migration/awsFeatureUsage.sh [contextId]
```

<details>
<summary><b>Capture and Replay specific configuration options table</b>
</summary>

```shell
$ /opensearch-migrations/deployment/cdk/opensearch-service-migration/awsFeatureUsage.sh default
Synthesizing all stacks...
Synthesizing stack: networkStack-default
Synthesizing stack: migrationInfraStack
Synthesizing stack: reindexFromSnapshotStack
Synthesizing stack: migration-console
Finding resource usage from synthesized stacks...
-----------------------------------
IAM Policy Actions:
cloudwatch:GetMetricData
...
-----------------------------------
Resources Types:
AWS::CDK::Metadata
...
```
</details>


### Network Configuration
The migration tooling expects the source cluster, target cluster, and migration resources to exist in the same VPC. If this is not the case, manual networking setup outside of this documentation is likely required.
