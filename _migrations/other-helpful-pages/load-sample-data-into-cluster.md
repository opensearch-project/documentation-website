<!-- Document: Guide -->
This guide demonstrates how to quickly load test data into an Elasticsearch or OpenSearch source cluster using AWS Glue and the AWS Open Dataset library. We'll walk through indexing Bitcoin transaction data on the source cluster. For more details, refer to [the official AWS documentation on setting up Glue connections to OpenSearch](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-connect-opensearch-home.html) ↗.

## 1. Create Your Source Cluster

Create your source cluster using the method of your choice, keeping in mind the following requirements:

* We will use basic authentication (username/password) for access control. In this example, we are using Elasticsearch 7.10, but earlier versions of Elasticsearch and OpenSearch 1.X and 2.X are also supported.
* The source cluster must be in a VPC you control and have access to, enabling AWS Glue to send data to it.

## 2. Create the Access Secret in Secrets Manager

Create a secret in AWS Secrets Manager that provides AWS Glue with access to the source cluster’s basic authentication credentials:

1. Navigate to the AWS Secrets Manager Console.
2. Create a generic secret. Name it as you prefer and configure replication/rotation as needed.

Key fields:

* `opensearch.net.http.auth.user`: The username for accessing the source cluster.
* `opensearch.net.http.auth.pass`: The password for accessing the source cluster.

<details>
<summary>
<b>Example Access Secrets</b>
</summary>

![Screenshot](https://github.com/user-attachments/assets/dde7e343-4a9c-4f0b-af6d-e7048ecd1b14)
</details>

## 3. Create an AWS Glue IAM Role

Create an IAM Role that grants AWS Glue the necessary permissions:

1. Navigate to the IAM Console and create a new IAM Role.
2. Use the following trust policy to allow the AWS Glue service to assume the role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "glue.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

3. Attach the following permission sets:
   * `AWSGlueServiceRole`
   * `AmazonS3ReadOnlyAccess`

4. Grant the role access to the secret created in step 2 by adding an inline policy like this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "secretsmanager:GetSecretValue",
            "Resource": "arn:aws:secretsmanager:us-east-1:XXXXXXXXXXXX:secret:migration-assistant-source-cluster-creds-YDtnmx"
        }
    ]
}
```

## 4. Create an AWS Glue Connection

Create a Glue Connection to provide AWS Glue with access to the source cluster:

1. Navigate to the AWS Glue Console.
2. Create a new connection of the **Amazon OpenSearch Service** type.
3. Fill in your source cluster’s details (including VPC, subnet, and security group) and use the secret created earlier.

<details>
<summary>
<b>Example Glue Connection Configuration</b>
</summary>

![Screenshot](https://github.com/user-attachments/assets/b5978b2e-de58-4d46-ad47-ac960e729b89)
</details>

## 5. (Optional) Examine the Source Dataset

The sample dataset we'll use is the [AWS Public Blockchain dataset](https://registry.opendata.aws/aws-public-blockchain/) ↗, which is available for free. More information can be found [in this blog post](https://aws.amazon.com/blogs/database/access-bitcoin-and-ethereum-open-datasets-for-cross-chain-analytics/) ↗, and you can browse its contents in S3 [here](https://us-east-2.console.aws.amazon.com/s3/buckets/aws-public-blockchain) ↗.

The Bitcoin transaction data we'll load into our source cluster is located at the S3 URI: `s3://aws-public-blockchain/v1.0/btc/transactions/`.

## 6. Create the AWS Glue Job

Now, create a Glue Job in the AWS Glue Console using the connection you created earlier.

### S3 Source

1. Set the S3 URI to `s3://aws-public-blockchain/v1.0/btc/transactions`.
2. Enable recursive reading of the bucket's contents.
3. The data format is Parquet.

<details>
<summary>
<b>Example Glue Connection</b>
</summary>

![Screenshot](https://github.com/user-attachments/assets/6fc4c0da-45b9-4c09-ba73-1619f59c9dd3)
</details>

### OpenSearch Target

1. Select the AWS Glue Connection you created.
2. Specify the index name where the Bitcoin transaction data will be stored.

<details>
<summary>
<b>Example Data Sink</b>
</summary>

![Screenshot](https://github.com/user-attachments/assets/264d0d17-f7f4-4c07-8567-6cae47c3ccd1)
</details>

### Pre-Configure the Index Settings

This is an optional step. By default, the Glue Job creates a single-shard index. Since the dataset is approximately 1 TB in size, it's recommended to pre-create the index with multiple shards. Follow this example to create an index with 40 shards:

```bash
curl -u <your username>:<your password> -X PUT "http://<your source cluster domain>:9200/bitcoin-data" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "number_of_shards": 40,
    "number_of_replicas": 1
  }
}
'
```

You can also adjust any additional index settings at this time.

## 7. Run the Glue Job

Once the Glue source and target are configured, run the job in the AWS Console by clicking the **Run** button. You can monitor the job’s progress under the **Runs** tab in the console.