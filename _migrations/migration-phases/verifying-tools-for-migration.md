---
layout: default
title: Verifying tools for migrations
nav_order: 70
parent: Migration phases
---

# Verifying tools for migration

Before using the Migration Assistant, take the following steps to verify that you're cluster is ready for migration.

## Snapshot creation verification

Verify that a snapshot can be created from your cluster and used for metadata and backfill scenarios.

### Installing the Elasticsearch S3 Repository plugin

The snapshot needs to be stored in a location that the Migration Assistant can access. This guide uses AWS S3 as and the Migration Assistant creates an S3 bucket for this purpose. Therefore, it is necessary to install the [Elasticsearch S3 Repository](https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/repository-s3.html) plugin on your source nodes (https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/repository-s3.html).

Additionally, make sure that the plugin has been configured with AWS credentials that allow it to read and write to AWS S3. If your Elasticsearch cluster is running on EC2 or ECS instances with an execution IAM Role, include the necessary S3 permissions. Alternatively, you can store the credentials in the [Elasticsearch keystore](https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/repository-s3-client.html).

### Verifying the S3 Repository plugin configuration

You can verify that the S3 Repository Plugin is configured correctly by creating a test snapshot.

Create an S3 bucket for the snapshot using the following AWS CLI command:

```shell
aws s3api create-bucket --bucket <your-bucket-name> --region <your-aws-region>
```

Register a new S3 Snapshot Repository on your source cluster using this curl command:

```shell
curl -X PUT "http://<your-source-cluster>:9200/_snapshot/test_s3_repository" -H "Content-Type: application/json" -d '{
  "type": "s3",
  "settings": {
    "bucket": "<your-bucket-name>",
    "region": "<your-aws-region>"
  }
}'
```

Next, create a test snapshot that captures only the cluster's metadata:

```shell
curl -X PUT "http://<your-source-cluster>:9200/_snapshot/test_s3_repository/test_snapshot_1" -H "Content-Type: application/json" -d '{
  "indices": "",
  "ignore_unavailable": true,
  "include_global_state": true
}'
```

Check the AWS Console to confirm that your bucket contains the snapshot. 

### Removing test snapshots after verification

To remove the resources created during verification you can use the following deletion commands:

**Test snapshot**

```shell
curl -X DELETE "http://<your-source-cluster>:9200/_snapshot/test_s3_repository/test_snapshot_1?pretty"
```

**Test snapshot repository**

```shell
curl -X DELETE "http://<your-source-cluster>:9200/_snapshot/test_s3_repository?pretty"
```

**S3 bucket**

```shell
aws s3 rm s3://<your-bucket-name> --recursive
aws s3api delete-bucket --bucket <your-bucket-name> --region <your-aws-region>
```

### Troubleshooting

Use this guidance to troubleshoot any of the following snapshot verification issues:

#### Access denied error (403)

If you encounter an error like `AccessDenied (Service: Amazon S3; Status Code: 403)`, verify the following:

- The IAM role assigned to your Elasticsearch cluster has the necessary S3 permissions.
- The bucket name and region provided in the snapshot configuration match the actual S3 bucket you created.

#### Older versions of Elasticsearch

Older versions of the Elasticsearch S3 Repository Plugin may have trouble reading IAM Role credentials embedded in AWS EC2 and AWS ECS Instances. This is due to the copy of the AWS SDK shipped in them being too old to read the new standard way of retrieving those credentials, as shown in [the Instance Metadata Service v2 (IMDSv2) specification](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html). This can result in snapshot creation failures, with an error message like:

```json
{"error":{"root_cause":[{"type":"repository_verification_exception","reason":"[migration_assistant_repo] path [rfs-snapshot-repo] is not accessible on master node"}],"type":"repository_verification_exception","reason":"[migration_assistant_repo] path [rfs-snapshot-repo] is not accessible on master node","caused_by":{"type":"i_o_exception","reason":"Unable to upload object [rfs-snapshot-repo/tests-s8TvZ3CcRoO8bvyXcyV2Yg/master.dat] using a single upload","caused_by":{"type":"amazon_service_exception","reason":"Unauthorized (Service: null; Status Code: 401; Error Code: null; Request ID: null)"}}},"status":500}
```

If you encounter this issue, you can resolve it by temporarily enabling IMDSv1 on the Instances in your source cluster for the duration of the snapshot. There is a toggle for it available in [the AWS Console](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-options.html), as well as in [the AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html#options).  Flipping this toggle will turn on the older access model and enable the Elasticsearch S3 Repository plugin to work as normal.

## Switching over client traffic

The Migration Assistant's automatic load balancer (ALB) is deployed with a listener that shifts traffic between the source and target clusters through proxy services. The ALB should start in **Source Passthrough** mode.

###  Verifying the traffic switchover has completed

Use the following steps to verify that the traffic switch over is complete:

1. In the AWS Console, navigate to **EC2 > Load Balancers**.
2. Select the **MigrationAssistant ALB**.
3. Examine the listener on port 9200 and verify that 100% of traffic is directed to the **Source Proxy**.
4. Navigate to the **Migration ECS Cluster** in the AWS Console.
5. Select the **Target Proxy Service**.
6. Verify that the desired count for the service is running:
   * If the desired count is not met, update the service to increase it to at least 1 and wait for the service to start.
7. In the **Health and Metrics** tab under **Load balancer health**, verify that all targets are reporting as healthy:
   * This confirms the ALB can connect to the target cluster through the target proxy.
8. (Reset) Update the desired count for the **Target Proxy Service** back to its original value in ECS.

### Fixing unidentified traffic patterns

When switching over traffic to the target cluster, you might encounter unidentified traffic patterns. To help identify the cause of these patterns, use the following steps:
* Verify that the target cluster allows traffic ingress from the **Target Proxy Security Group**.
* Navigate to the **Target Proxy ECS Tasks** to investigate any failing tasks:
   * Set the "Filter desired status" to "Any desired status" to view all tasks, then navigate to the logs for any stopped tasks.



## Validating replication

This section describes how to verify that replication is working once the traffic capture proxy is deployed


1. Navigate to the **Migration ECS Cluster** in AWS Console.
2. Navigate to **Capture Proxy Service**.
3. Verify that the capture proxy is running the desired proxy count and running. If not, update service to increase to at least 1 and wait for startup.
4. Under the **Health and Metrics** > **Load balancer health** verify that all targets are healthy. This means that the ALB is able to connect to the source cluster through the capture proxy.
5. Navigate to the **Migration Console Terminal**.
6. Run `console kafka describe-topic-records`. Wait 30 seconds for another ALB health check.
7. Run `console kafka describe-topic-records` again and verify the number of RECORDS increased between runs.
8. Run `console replay start` to start the Traffic Replayer.
9.  Run `tail -f /shared-logs-output/traffic-replayer-default/*/tuples/tuples.log  | jq '.targetResponses[]."Status-Code"'` to confirm that the Kafka requests were sent to the target and that it responded as expected. If the responses don't appear:
    * Check that the migration-console can access the target cluster by running `./catIndices.sh`, which should show indexes on the source and target.
    * Confirm that messages are still being recorded to Kafka.
    * Check for errors in the Replayer logs (`/migration/STAGE/default/traffic-replayer-default`) using CloudWatch.
10. (Reset) Update Traffic Capture Proxy service desired count back to it's original value in ECS.

### Troubleshooting

Use this guidance to troubleshoot any of the following replication validation issues:

### Health checks response with 401/403 status code

If the source cluster is configured to require authentication the capture proxy will not be able to verify beyond receiving 401/403 status code for ALB health checks. For more information, see [Traffic Capture Proxy Failure Modes](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/README.md#failure-modes)

### Traffic does not reach the source cluster 

Verify that the source cluster allows traffic ingress from the Capture Proxy Security Group.

Look for failing tasks by navigating to **Traffic Capture Proxy ECS** tasks. Change **Filter desired status** to **Any desired status** in order to see all tasks and navigate to logs for stopped tasks.


## Resetting before migration

After all verifications are complete, reset all resources before using Migration Assistant from an actual migration. 

The following steps outline how to reset resources with Migration Assistant before executing the actual migration. At this point all verifications are expected to have been completed. These steps can be performed after [[Accessing the Migration Console]]

### Replayer

To stop a running Replayer, use the following command:

```bash
console replay stop
```

### Kafka 
The clear all captured traffic from the Kafka topic, the following command can be executed. 

This command will result in the loss of any captured traffic data up to this point by the capture proxy and thus should be used with caution.
{: .warning}

```bash
console kafka delete-topic
```

### Target cluster 

To clear non-system indexes from the target cluster that may have been created from testing, the following command can be executed. 

This command will result in the loss of all data on the target cluster and should be used with caution.
{: .warning}

```bash
console clusters clear-indices --cluster target
```

