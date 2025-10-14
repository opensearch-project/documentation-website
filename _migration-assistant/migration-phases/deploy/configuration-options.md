---
layout: default
title: Configuration options
nav_order: 1
grand_parent: Migration phases
parent: Deploy
permalink: /migration-assistant/migration-phases/deploy/configuration-options/
redirect_from:
  - /migration-assistant/migration-phases/deploying-migration-assistant/configuration-options/
  - /deploying-migration-assistant/configuration-options/
  - /migration-assistant/deploying-migration-assistant/configuration-options/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/deploy/configuration-options/
---

# Configuration options

This page outlines the configuration options for three key migrations scenarios:

1. **Metadata migration**
2. **Backfill migration with `Reindex-from-Snapshot` (RFS)**
3. **Live capture migration with  Capture and Replay  (C&R)**

Each of these migrations depends on either a snapshot or a capture proxy. The following example `cdk.context.json` configurations are used by AWS Cloud Development Kit (AWS CDK) to deploy and configure Migration Assistant for OpenSearch, shown as separate blocks for each migration type. If you are performing a migration applicable to multiple scenarios, these options can be combined.


For a complete list of configuration options, see [opensearch-migrations-options.md](https://github.com/opensearch-project/opensearch-migrations/blob/main/deployment/cdk/opensearch-service-migration/options.md). If you need a configuration option that is not found on this page, create an issue in the [OpenSearch Migrations repository](https://github.com/opensearch-project/opensearch-migrations/issues).
{: .tip }

Options for the source cluster endpoint, target cluster endpoint, and existing virtual private cloud (VPC) should be configured in order for the migration tools to function effectively.

## Shared configuration options

Each migration configuration shares the following options.


| Name | Example  | Description   |
| :--- | :--- | :--- |
| `sourceClusterEndpoint` | `"https://source-cluster.elb.us-east-1.endpoint.com"`  | The endpoint for the source cluster.  |
| `targetClusterEndpoint` | `"https://vpc-demo-opensearch-cluster-cv6hggdb66ybpk4kxssqt6zdhu.us-west-2.es.amazonaws.com:443"`   | The endpoint for the target cluster. Required if using an existing target cluster for the migration instead of creating a new one. |
| `vpcId` | `"vpc-123456789abcdefgh"`  | The ID of the existing VPC in which the migration resources will be stored. The VPC must have at least two private subnets that span two Availability Zones. |


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
            "userSecretArn": <SECRET_WITH_USERNAME_AND_PASSWORD_KEYS>
        }
    },
    "reindexFromSnapshotServiceEnabled": true,
    "reindexFromSnapshotExtraArgs": "",
    "artifactBucketRemovalPolicy": "DESTROY"
  }
}
```
{% include copy.html %}

Performing an RFS backfill migration requires an existing snapshot. 


The RFS configuration uses the following options. All options are optional. 

| Name  | Example | Description |
| :--- | :--- | :--- |
| `reindexFromSnapshotServiceEnabled` | `true` | Enables deployment and configuration of the RFS ECS service. |
| `reindexFromSnapshotExtraArgs` | `"--target-aws-region us-east-1 --target-aws-service-signing-name es"` | Extra arguments for the Document Migration command, with space separation. See [RFS Extra Arguments](https://github.com/opensearch-project/opensearch-migrations/blob/main/DocumentsFromSnapshotMigration/README.md#arguments) for more information. You can pass `--no-insecure` to remove the `--insecure` flag. |

To view all available arguments for `reindexFromSnapshotExtraArgs`, see [Snapshot migrations README](https://github.com/opensearch-project/opensearch-migrations/blob/main/DocumentsFromSnapshotMigration/README.md#arguments). At a minimum, no extra arguments may be needed.

## Live capture migration with C&R 

The following sample CDK performs a live capture migration with C&R:

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
            "userSecretArn": <SECRET_WITH_USERNAME_AND_PASSWORD_KEYS>
        }
    },

    "// settingsForCaptureAndReplay": "Enable the following services for live traffic capture and replay:",
    "trafficReplayerServiceEnabled": true,

    "// help trafficReplayerExtraArgs": "Increase the speedup factor to replay requests at a faster rate in order to catch up.",
    "trafficReplayerExtraArgs": "--speedup-factor 1.5",

    "// help capture/target proxy pt. 1 of 2": "captureProxyService and targetClusterProxyService deployment will fail without network access to clusters.",
    "// help capture/target proxy pt. 2 of 2": "In most cases, keep the desired count setting at `0` until you verify connectivity in the migration console. After verifying connectivity, you can redeploy with a higher desired count.",
    "captureProxyServiceEnabled": true,
    "captureProxyDesiredCount": 3,
    "targetClusterProxyServiceEnabled": true,
    "targetClusterProxyDesiredCount": 3

  }
}
```
{% include copy.html %}

Performing a live capture migration requires that a Capture Proxy be configured to capture incoming traffic and send it to the target cluster using the Traffic Replayer service. For arguments available in `captureProxyExtraArgs`, refer to the `@Parameter` fields [here](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/src/main/java/org/opensearch/migrations/trafficcapture/proxyserver/CaptureProxy.java). For `trafficReplayerExtraArgs`, refer to the `@Parameter` fields [here](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficReplayer/src/main/java/org/opensearch/migrations/replay/TrafficReplayer.java). At a minimum, no extra arguments may be needed.


| Name  | Example                                                                | Description   |
| :--- |:-----------------------------------------------------------------------| :--- |
| `captureProxyServiceEnabled`    | `true`                                                                 | Enables the Capture Proxy service deployment using an AWS CloudFormation stack.  |
| `captureProxyExtraArgs`  | `"--suppressCaptureForHeaderMatch user-agent .*elastic-java/7.17.0.*"` | Extra arguments for the Capture Proxy command, including options specified by the [Capture Proxy](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/src/main/java/org/opensearch/migrations/trafficcapture/proxyserver/CaptureProxy.java).  |
| `captureProxyDesiredCount`  | `0`                                                                    |  Sets the number of Capture Proxy Amazon Elastic Container Service (Amazon ECS) tasks. In most cases, keep this setting at `0` until you verify connectivity between the source and target clusters in the migration console. After deployment, you can modify the networking setup to allow ingress from the migration security groups into the existing cluster security groups.  |
| `trafficReplayerServiceEnabled` | `true`                                                                 | Enables the Traffic Replayer service deployment using a CloudFormation stack.  |
| `trafficReplayerExtraArgs`      | `"--sigv4-auth-header-service-region es,us-east-1 --speedup-factor 5"` | Extra arguments for the Traffic Replayer command, including options for auth headers and other parameters specified by the [Traffic Replayer](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficReplayer/src/main/java/org/opensearch/migrations/replay/TrafficReplayer.java). |
| `targetClusterProxyServiceEnabled` | `true`                                                                 | Enables the target cluster proxy service deployment using a CloudFormation stack. |
| `targetClusterProxyDesiredCount`  | `0`                                                                    | Sets the number of target cluster proxy Amazon ECS tasks. In most cases, keep this setting at `0` until you verify connectivity between the source and target clusters in the migration console. After deployment, you can modify the networking setup to allow ingress from the migration security groups into the existing cluster security groups.  |

For arguments available in `captureProxyExtraArgs`, see the `@Parameter` fields in [`CaptureProxy.java`](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/src/main/java/org/opensearch/migrations/trafficcapture/proxyserver/CaptureProxy.java). For `trafficReplayerExtraArgs`, see the `@Parameter` fields in [`TrafficReplayer.java`](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficReplayer/src/main/java/org/opensearch/migrations/replay/TrafficReplayer.java).


## Cluster authentication options

Both the source and target cluster can use no authentication, authentication limited to VPC, basic authentication with a username and password, or AWS Signature Version 4 scoped to a user or role.

### No authentication

```json
    "sourceCluster": {
        "endpoint": <SOURCE_CLUSTER_ENDPOINT>,
        "version": "ES 7.10",
        "auth": {"type": "none"}
    }
```
{% include copy.html %}

### Basic authentication

```json
    "sourceCluster": {
        "endpoint": <SOURCE_CLUSTER_ENDPOINT>,
        "version": "ES 7.10",
        "auth": {
            "type": "basic",
            "userSecretArn": <SECRET_WITH_USERNAME_AND_PASSWORD_KEYS>
        }
    }
```
{% include copy.html %}

### AWS Signature Version 4 authentication

```json
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
{% include copy.html %}

The `serviceSigningName` can be `es` for an Elasticsearch or OpenSearch domain.

All of these authentication options apply to both source and target clusters.

## Snapshot options

The following configuration options customize the process of migrating from snapshots.

### Snapshot of a managed service source

If your source cluster is on Amazon OpenSearch Service, you need to set up an additional AWS Identity and Access Management (IAM) role and pass it with the snapshot creation call, as described in the [AWS documentation](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-snapshots.html). Migration Assistant can automatically manage this process. OpenSearch Service snapshots are only compatible with AWS Signature Version 4 authentication. The following parameter ensures that the additional IAM role is created and passed.

| Name  | Example | Description |
| :--- | :--- | :--- |
| `managedServiceSourceSnapshotEnabled` | `true` | Creates the necessary roles and trust relationships for taking a snapshot of an OpenSearch Service source cluster. This is only compatible with AWS Signature Version 4 authentication.|

### Bring your own snapshot

You can use an existing Amazon Simple Storage Service (Amazon S3) snapshot to perform [metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrating-metadata/) and [backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/) migrations instead of using Migration Assistant to create a snapshot:

```json
    "snapshot": {
        "snapshotName": "my-snapshot-name",
        "snapshotRepoName": "my-snapshot-repo",
        "s3Uri": "s3://my-s3-bucket-name/my-bucket-path-to-snapshot-repo",
        "s3Region": "us-east-2"
    }
```
{% include copy.html %}

The version of the cluster used for the provided snapshot configuration should be aligned with the source cluster version. The source cluster version is required to ensure that the provided snapshot is parsed appropriately. If access to the source cluster is not required for monitoring and verification, it can be disabled as follows:
```json
    "sourceCluster": {
        "disabled": true,
        "version": "ES 7.10"
    }
```
{% include copy.html %}

By default, Amazon S3 buckets automatically allow roles in the same AWS account (with the appropriate `s3:*` permissions) to access the S3 bucket, regardless of the bucket's AWS Region. If the external S3 bucket is in the same AWS account as the Migration Assistant deployment, no further IAM configuration is required to access the bucket.

If you use a custom permission model with Amazon S3, any access control list (ACL) or custom bucket policy should allow the Migration Assistant task roles for RFS and the migration console to read from the S3 bucket.

If the S3 bucket is in a separate AWS account from the Migration Assistant deployment, you need a custom bucket policy similar to the following to allow access to Migration Assistant:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowExternalAccountReadAccessToBucket",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<ACCOUNT_ID>:root"
      },
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::my-s3-bucket-name",
        "arn:aws:s3:::my-s3-bucket-name/*"
      ]
    }
  ]
}
```
{% include copy.html %}

## Network configuration

The migration tooling expects the source cluster, target cluster, and migration resources to exist in the same VPC. If this is not the case, manual networking setup outside of this documentation is likely required.
