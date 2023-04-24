---
layout: default
title: S3 logs
parent: Common use cases
nav_order: 20
---

# S3 logs

Data Prepper supports loading logs from [Amazon Simple Storage Service](https://aws.amazon.com/s3/) (Amazon S3). 
These logs can be of different types, including traditional logs, JSON documents, and CSV logs.

## Architecture

Data Prepper supports reading objects from S3 buckets using an [Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) 
(Amazon SQS) queue and [Amazon S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html).

Data Prepper will poll the SQS queue for S3 event notifications.
When Data Prepper receives a notification that an S3 object was created, Data Prepper will read and parse that S3 object.

The following diagram shows the overall architecture of the components involved.

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper/s3-source/s3-architecture.jpg" alt="S3 source architecture">{: .img-fluid}

The flow of data is as follows.

1. Some system produces logs into the S3 bucket.
2. S3 creates an S3 event notification in the SQS queue.
3. Data Prepper polls SQS for messages and receives a message.
4. Data Prepper downloads the content from the S3 object
5. Data Prepper sends a document to OpenSearch for the content in the S3 object.


## Pipeline overview

Data Prepper supports reading data from S3 using the `s3` source.
The S3 source will both receive from the SQS queue and read content from S3.

The following diagram shows a conceptual outline of a Data Prepper pipeline reading from S3.

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper/s3-source/s3-pipeline.jpg" alt="S3 source architecture">{: .img-fluid}

## Getting started

In order to read log data from S3 using Data Prepper you will need to perform a few steps.
First, you will need to have an S3 bucket and some log producer which writes logs to S3.
The exact log producer will vary depending on your specific use-case.
It might be an application writing logs to S3, an AWS service, or some other process.

1. Create a [SQS standard queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html) for your S3 event notifications. You can use SQS's [Getting started](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/step-create-queue.html) guide for help.
2. Configure bucket notifications for SQS. You can follow the [walkthrough](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ways-to-add-notification-config-to-bucket.html) provided in the S3 documentation. You should generally use the `s3:ObjectCreated:*` event type.
3. Grant [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) permissions to Data Prepper for accessing SQS and S3.
4. (Recommended) Create an [SQS dead-letter queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) (DLQ).
5. (Recommended) Configure an SQS redrive policy to move failed messages into the DLQ.

### Permission needed for Data Prepper

Data Prepper will need access to SQS and S3.
You will need to set up permissions similar to the following.
Update the items in angle braces to specify your actual resources.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "s3-access",
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<YOUR-BUCKET>/*"
        },
        {
            "Sid": "sqs-access",
            "Effect": "Allow",
            "Action": [
                "sqs:DeleteMessage",
                "sqs:ReceiveMessage"
            ],
            "Resource": "arn:aws:sqs:<YOUR-REGION>:<123456789012>:<YOUR-SQS-QUEUE>"
        },
        {
            "Sid": "kms-access",
            "Effect": "Allow",
            "Action": "kms:Decrypt",
            "Resource": "arn:aws:kms:<YOUR-REGION>:<123456789012>:key/<YOUR-KMS-KEY>"
        }
    ]
}
```

If your S3 objects or SQS queues do not use KMS, you can remove the `kms:Decrypt` permission.

### SQS dead-letter queue

You have two options for how to handle errors processing S3 objects.

1. Use an SQS dead-letter queue to track the failure. This is the recommended approach.
2. Delete the message from SQS. You will have to manually find this S3 object and correct the error.

Using an SQS dead-letter queue is a built-in feature within SQS. 
The following diagram depicts the overall architecture when using it.

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper/s3-source/s3-architecture-dlq.jpg" alt="S3 source architecture with dlq">{: .img-fluid}

To use an SQS dead-letter queue, you will need to perform the following steps:

1. Create a new SQS standard queue to act as your DLQ.
2. Configure your SQS's Redrive Policy to use your DLQ. You can follow the [Configuring a dead-letter queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-dead-letter-queue.html) guide to complete this step. Consider using a low value for "Maximum Receives" such as 2 or 3.
3. Configure the Data Prepper `s3` source to use `retain_messages` for `on_error`. This is the default behavior.

## Pipeline design

Creating a pipeline to read logs from S3 starts with an [`s3`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/) source plugin.

```yaml
s3-log-pipeline:
   source:
     s3:
       notification_type: sqs
       compression: gzip
       codec:
         newline:
       sqs:
         # Change this value to your SQS Queue URL
         queue_url: "arn:aws:sqs:<YOUR-REGION>:<123456789012>:<YOUR-SQS-QUEUE>"
         visibility_timeout: "2m"
```

There are a few important configurations that you need to configure.

* `queue_url` - This the SQS queue URL and is always unique to your pipeline.
* `codec` - The codec determines how to parse the incoming data.
* `visibility_timeout` - Configure this value to be large enough for Data Prepper to process 10 S3 objects. However, if you make this value too large, then messages which fail to process will take at least that long before Data Prepper retries.

There are other configurations available. 
But, for many situations, you can use the default values for those.
See the [`s3`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/) documentation for all the available options.

```yaml
s3-log-pipeline:
   source:
     s3:
       notification_type: sqs
       compression: gzip
       codec:
         newline:
       sqs:
         # Change this value to your SQS Queue URL
         queue_url: "arn:aws:sqs:<YOUR-REGION>:<123456789012>:<YOUR-SQS-QUEUE>"
         visibility_timeout: "2m"
       aws:
         # Specify the correct region
         region: "<YOUR-REGION>"
         # This shows using an STS role, but you can also use your system's default permissions.
         sts_role_arn: "arn:aws:iam::<123456789012>:role/<DATA-PREPPER-ROLE>"
   processor:
     # You can configure a grok pattern to enrich your documents in OpenSearch.
     #- grok:
     #    match:
     #      message: [ "%{COMMONAPACHELOG}" ]
   sink:
     - opensearch:
         hosts: [ "https://localhost:9200" ]
         # Change to your credentials
         username: "admin"
         password: "admin"
         index: s3_logs
```

## Multiple Data Prepper pipelines

You should have one SQS queue per Data Prepper pipeline. 
You can have multiple nodes in the same cluster reading from the same SQS queue. 
SQS supports multiple nodes making requests.
So there is no special coordination that Data Prepper needs to provide.

However, if you have different pipelines, even if they use the same S3 bucket, you must have different SQS queues.

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper/s3-source/s3-architecture-multiple-sqs.jpg" alt="S3 source architecture with dlq">{: .img-fluid}



