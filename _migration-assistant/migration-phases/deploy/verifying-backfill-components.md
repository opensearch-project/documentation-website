---
layout: default
title: Verifying backfill components
grand_parent: Migration phases
nav_order: 3
parent: Deploy
permalink: /migration-assistant/migration-phases/deploy/verifying-backfill-components/
redirect_from:
  - /migration-assistant/migration-phases/verifying-migration-tools/verifying-backfill-components/
---

# Verifying backfill components

Before using the Migration Assistant, take the following steps to verify that your cluster is ready for migration.

## Verifying snapshot creation

Verify that a snapshot can be created of your source cluster and used for metadata and backfill scenarios.

### Installing the Elasticsearch S3 Repository plugin

The snapshot needs to be stored in a location that Migration Assistant can access. This guide uses Amazon Simple Storage Service (Amazon S3). By default, Migration Assistant creates an S3 bucket for storage. Therefore, it is necessary to install the [Elasticsearch S3 repository plugin](https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/repository-s3.html) on your source nodes (https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/repository-s3.html).

Additionally, make sure that the plugin has been configured with AWS credentials that allow it to read and write to Amazon S3. If your Elasticsearch cluster is running on Amazon Elastic Compute Cloud (Amazon EC2) or Amazon Elastic Container Service (Amazon ECS) instances with an AWS Identity and Access Management (IAM) execution role, include the necessary S3 permissions. Alternatively, you can store the credentials in the [Elasticsearch keystore](https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/repository-s3-client.html).

### Verifying the S3 repository plugin configuration

You can verify that the S3 repository plugin is configured correctly by creating a test snapshot.

Create an S3 bucket for the snapshot using the following AWS Command Line Interface (AWS CLI) command:

```shell
aws s3api create-bucket --bucket <your-bucket-name> --region <your-aws-region>
```
{% include copy.html %}

Register a new S3 snapshot repository on your source cluster using the following cURL command:

```shell
curl -X PUT "http://<your-source-cluster>:9200/_snapshot/test_s3_repository" -H "Content-Type: application/json" -d '{
  "type": "s3",
  "settings": {
    "bucket": "<your-bucket-name>",
    "region": "<your-aws-region>"
  }
}'
```
{% include copy.html %}

Next, create a test snapshot that captures only the cluster's metadata:

```shell
curl -X PUT "http://<your-source-cluster>:9200/_snapshot/test_s3_repository/test_snapshot_1" -H "Content-Type: application/json" -d '{
  "indices": "",
  "ignore_unavailable": true,
  "include_global_state": true
}'
```
{% include copy.html %}

Check the AWS Management Console to confirm that your bucket contains the snapshot. 

### Removing test snapshots after verification

To remove the resources created during verification, you can use the following deletion commands:

**Test snapshot**

```shell
curl -X DELETE "http://<your-source-cluster>:9200/_snapshot/test_s3_repository/test_snapshot_1?pretty"
```
{% include copy.html %}

**Test snapshot repository**

```shell
curl -X DELETE "http://<your-source-cluster>:9200/_snapshot/test_s3_repository?pretty"
```
{% include copy.html %}

**S3 bucket**

```shell
aws s3 rm s3://<your-bucket-name> --recursive
aws s3api delete-bucket --bucket <your-bucket-name> --region <your-aws-region>
```
{% include copy.html %}

### Troubleshooting

Use this guidance to troubleshoot any of the following snapshot verification issues.

#### Access denied error (403)

If you encounter an error like `AccessDenied (Service: Amazon S3; Status Code: 403)`, verify the following:

- Make sure you're using the S3 bucket created by Migration Assistant.
- If you're using a custom S3 bucket, verify that:
  - The IAM role assigned to your Elasticsearch cluster has the necessary S3 permissions.
  - The bucket name and AWS Region provided in the snapshot configuration match the actual S3 bucket you created.

#### Older versions of Elasticsearch

Older versions of the Elasticsearch S3 repository plugin may have trouble reading IAM role credentials embedded in Amazon EC2 and Amazon ECS instances. This is because the copy of the AWS SDK shipped with them is too old to read the new standard way of retrieving those credentials, as shown in [the Instance Metadata Service v2 (IMDSv2) specification](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html). This can result in snapshot creation failures, with an error message similar to the following:

```json
{"error":{"root_cause":[{"type":"repository_verification_exception","reason":"[migration_assistant_repo] path [rfs-snapshot-repo] is not accessible on master node"}],"type":"repository_verification_exception","reason":"[migration_assistant_repo] path [rfs-snapshot-repo] is not accessible on master node","caused_by":{"type":"i_o_exception","reason":"Unable to upload object [rfs-snapshot-repo/tests-s8TvZ3CcRoO8bvyXcyV2Yg/master.dat] using a single upload","caused_by":{"type":"amazon_service_exception","reason":"Unauthorized (Service: null; Status Code: 401; Error Code: null; Request ID: null)"}}},"status":500}
```

If you encounter this issue, you can resolve it by temporarily enabling IMDSv1 on the instances in your source cluster for the duration of the snapshot. There is a toggle for this available in the AWS Management Console and in the AWS CLI. Switching this toggle will turn on the older access model and enable the Elasticsearch S3 repository plugin to work as normal. For more information about IMDSv1, see [Modify instance metadata options for existing instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-IMDS-existing-instances.html).

## Switching over client traffic

The Migration Assistant Application Load Balancer is deployed with a listener that shifts traffic between the source and target clusters through proxy services. The Application Load Balancer should start in **Source Passthrough** mode.

### Verifying that the traffic switchover is complete

Use the following steps to verify that the traffic switchover is complete:

1. In the AWS Management Console, navigate to **EC2 > Load Balancers**.
2. Select the **MigrationAssistant ALB**.
3. Examine the listener on port `9200` and verify that 100% of the traffic is directed to the **Source Proxy**.
4. Navigate to the **Migration ECS Cluster** in the AWS Management Console.
5. Select the **Target Proxy Service**.
6. Verify that the desired count for the service is running:
   * If the desired count is not met, update the service to increase it to at least 1 and wait for the service to start.
7. On the **Health and Metrics** tab under **Load balancer health**, verify that all targets are reporting as healthy:
   * This confirms that the Application Load Balancer can connect to the target cluster through the target proxy.
8. (Reset) Update the desired count for the **Target Proxy Service** back to its original value in Amazon ECS.

### Fixing unidentified traffic patterns

When switching over traffic to the target cluster, you might encounter unidentified traffic patterns. To help identify the cause of these patterns, use the following steps:
* Verify that the target cluster allows traffic ingress from the **Target Proxy security group**.
* Navigate to **Target Proxy ECS Tasks** to investigate any failing tasks.
Set the **Filter desired status** to **Any desired status** to view all tasks, then navigate to the logs for any stopped tasks.


## Verifying replication

Use the following steps to verify that replication is working once the Traffic Capture Proxy is deployed:


1. Navigate to the **Migration ECS Cluster** in the AWS Management Console.
2. Navigate to **Capture Proxy Service**.
3. Verify that the capture proxy is running with the desired proxy count. If it is not, update the service to increase it to at least 1 and wait for startup.
4. Under **Health and Metrics** > **Load balancer health**, verify that all targets are healthy. This means that the Application Load Balancer is able to connect to the source cluster through the capture proxy.
5. Navigate to the **Migration Console Terminal**.
6. Run `console kafka describe-topic-records`. Wait 30 seconds for another Application Load Balancer health check.
7. Run `console kafka describe-topic-records` again and verify that the number of RECORDS increased between runs.
8. Run `console replay start` to start Traffic Replayer.
9. Run `tail -f /shared-logs-output/traffic-replayer-default/*/tuples/tuples.log  | jq '.targetResponses[]."Status-Code"'` to confirm that the Kafka requests were sent to the target and that it responded as expected. If the responses don't appear:
    * Check that the migration console can access the target cluster by running `./catIndices.sh`, which should show the indexes in the source and target.
    * Confirm that messages are still being recorded to Kafka.
    * Check for errors in the Traffic Replayer logs (`/migration/STAGE/default/traffic-replayer-default`) using Amazon CloudWatch.
10. (Reset) Update the desired count for the **Capture Proxy Service** back to its original value in Amazon ECS.

### Troubleshooting

Use this guidance to troubleshoot any of the following replication verification issues.

### Health check responses with 401/403 status code

If the source cluster is configured to require authentication, the capture proxy will not be able to verify replication beyond receiving a 401/403 status code for Application Load Balancer health checks. For more information, see [Failure Modes](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/README.md#failure-modes).

### Traffic does not reach the source cluster 

Verify that the source cluster allows traffic ingress from the Capture Proxy security Group.

Look for failing tasks by navigating to **Traffic Capture Proxy ECS**. Change **Filter desired status** to **Any desired status** in order to see all tasks and navigate to the logs for stopped tasks.

### Snapshot and S3 bucket issues

When using the CDK deployment for Migration Assistant, you might encounter the following errors during snapshot creation and deletion.

#### Bucket permissions

To make sure that you can delete snapshots and create them during the AWS Cloud Development Kit (AWS CDK) deployment process, confirm that the `OSMigrations-dev-<region>-CustomS3AutoDeleteObjects` stack has S3 object deletion rights. Then, verify that `OSMigrations-dev-<region>-default-SnapshotRole` has the following S3 permissions:

  - List bucket contents  
  - Read/Write/Delete objects

#### Snapshot conflicts

To prevent snapshot conflicts, use the `console snapshot delete` command from the migration console. If you delete snapshots or snapshot repositories in a location other than the migration console, you might encounter "already exists" errors.

## Resetting before migration

After all verifications are complete, reset all resources before using Migration Assistant for an actual migration. 

The following steps outline how to reset resources with Migration Assistant before executing the actual migration. At this point all verifications are expected to have been completed. These steps can be performed after [Accessing the Migration Console]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/accessing-the-migration-console/).


{% include copy.html %}
