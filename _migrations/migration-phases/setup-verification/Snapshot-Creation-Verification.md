


Verify that a snapshot can be created and used for metadata and backfill scenarios.

### Install the Elasticsearch S3 Repository Plugin

The snapshot needs to be stored in a location that the Migration Assistant can access. We use AWS S3 as that location, and the Migration Assistant creates an S3 bucket for this purpose. Therefore, it is necessary to install the Elasticsearch S3 Repository Plugin on your source nodes [as described here](https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/repository-s3.html) ↗.

Additionally, ensure that the plugin has been configured with AWS credentials that allow it to read and write to AWS S3. If your Elasticsearch cluster is running on EC2 or ECS instances with an execution IAM Role, include the necessary S3 permissions. Alternatively, you can store the credentials in the Elasticsearch Key Store [as described here](https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/repository-s3-client.html) ↗.

### Verifying S3 Repository Plugin Configuration

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

You should receive a response like: `{"acknowledged":true}`.

Create a test snapshot that captures only the cluster's metadata:

```shell
curl -X PUT "http://<your-source-cluster>:9200/_snapshot/test_s3_repository/test_snapshot_1" -H "Content-Type: application/json" -d '{
  "indices": "",
  "ignore_unavailable": true,
  "include_global_state": true
}'
```

<details>
<summary><b>Example Response</b></summary>

You should receive a response like: `{"accepted":true}`.

Check the AWS Console to confirm that your bucket contains the snapshot. It will appear similar to this:

![Screenshot 2024-08-06 at 3 25 25 PM](https://github.com/user-attachments/assets/200818a5-e259-4837-aa2a-44c0bd7b099c)
</details>

### Cleaning Up After Verification

To remove the resources created during verification:

Delete the snapshot:

```shell
curl -X DELETE "http://<your-source-cluster>:9200/_snapshot/test_s3_repository/test_snapshot_1?pretty"
```

Delete the snapshot repository:

```shell
curl -X DELETE "http://<your-source-cluster>:9200/_snapshot/test_s3_repository?pretty"
```

Delete the S3 bucket and its contents:

```shell
aws s3 rm s3://<your-bucket-name> --recursive
aws s3api delete-bucket --bucket <your-bucket-name> --region <your-aws-region>
```

### Troubleshooting

#### Access Denied Error (403)

If you encounter an error like `AccessDenied (Service: Amazon S3; Status Code: 403)`, verify the following:

- The IAM role assigned to your Elasticsearch cluster has the necessary S3 permissions.
- The bucket name and region provided in the snapshot configuration match the actual S3 bucket you created.

#### Older versions of Elasticsearch

Older versions of the Elasticsearch S3 Repository Plugin may have trouble reading IAM Role credentials embedded in EC2 and ECS Instances.  This is due to the copy of the AWS SDK shipped in them being being too old to read the new standard way of retrieving those credentials - [the Instance Metadata Service v2 (IMDSv2) specification](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html).  This can result in Snapshot creation failures, with an error message like:

```
{"error":{"root_cause":[{"type":"repository_verification_exception","reason":"[migration_assistant_repo] path [rfs-snapshot-repo] is not accessible on master node"}],"type":"repository_verification_exception","reason":"[migration_assistant_repo] path [rfs-snapshot-repo] is not accessible on master node","caused_by":{"type":"i_o_exception","reason":"Unable to upload object [rfs-snapshot-repo/tests-s8TvZ3CcRoO8bvyXcyV2Yg/master.dat] using a single upload","caused_by":{"type":"amazon_service_exception","reason":"Unauthorized (Service: null; Status Code: 401; Error Code: null; Request ID: null)"}}},"status":500}
```

If you encounter this issue, you can resolve it by temporarily enabling IMDSv1 on the Instances in your source cluster for the duration of the snapshot.  There is a toggle for it available in [the AWS Console](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-options.html), as well as in [the AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-instance-metadata-options.html#options).  Flipping this toggle will turn on the older access model and enable the Elasticsearch S3 Repository Plugin to work as normal.

### Related Links

- [Elasticsearch S3 Repository Plugin Configuration Guide](https://www.elastic.co/guide/en/elasticsearch/plugins/7.10/repository-s3-client.html) ↗.
