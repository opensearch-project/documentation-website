---
layout: default
title: S3 logs
parent: Common use cases
nav_order: 20
---

# S3 logs

Data Prepper supports loading logs from [Amazon Simple Storage Service](https://aws.amazon.com/s3/) (Amazon S3), including traditional logs, JSON documents, and CSV logs.


## Architecture

Data Prepper supports reading objects from S3 buckets using an [Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) (Amazon SQS) queue and [Amazon S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html).

Data Prepper polls the Amazon SQS queue for S3 event notifications.When Data Prepper receives a notification that an S3 object was created, Data Prepper reads and parses that S3 object.

The following diagram shows the overall architecture of the components involved.

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper/s3-source/s3-architecture.jpg" alt="S3 source architecture">{: .img-fluid}

The flow of data is as follows.

1. A system produces logs into the S3 bucket.
2. S3 creates an S3 event notification in the SQS queue.
3. Data Prepper polls Amazon SQS for messages and then receives a message.
4. Data Prepper downloads the content from the S3 object.
5. Data Prepper sends a document to OpenSearch for the content in the S3 object.


## Pipeline overview

Data Prepper supports reading data from S3 using the [`s3` source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/).

The following diagram shows a conceptual outline of a Data Prepper pipeline reading from S3.

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper/s3-source/s3-pipeline.jpg" alt="S3 source architecture">{: .img-fluid}

## Prerequisites

In order to read log data from S3 using Data Prepper you need the following prerequisites: 

- An S3 bucket.
- A log producer which writes logs to S3. The exact log producer will vary depending on your specific use-case, but could include writing logs to S3 or a service such as Amazon CloudWatch.


## Getting started

To begin loading logs from S3 with Data Prepper.

1. Create a [SQS standard queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/step-create-queue.html) for your S3 event notifications. 
2. Configure [bucket notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ways-to-add-notification-config-to-bucket.html) for SQS. Use the `s3:ObjectCreated:*` event type.
3. Grant [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) permissions to Data Prepper for accessing SQS and S3.
4. (Recommended) Create an [SQS dead-letter queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) (DLQ).
5. (Recommended) Configure an SQS re-drive policy to move failed messages into the DLQ.

### Setting permissions for Data Prepper

To see S3 log, Data Prepper need access to Amazon SQS and S3.
Use the following example to set up permissions:

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

If your S3 objects or SQS queues does not use KMS, you can remove the `kms:Decrypt` permission.

### SQS dead-letter queue

The are two options for how to handle errors processing S3 objects.

1. Use an SQS dead-letter queue (DLQ) to track the failure. This is the recommended approach.
2. Delete the message from SQS. You will have to manually find this S3 object and correct the error.

Using an SQS dead-letter queue is a built-in feature within SQS. 
The following diagram depicts the system architecture when using SQS with DLQ.

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper/s3-source/s3-architecture-dlq.jpg" alt="S3 source architecture with dlq">{: .img-fluid}

To use an SQS dead-letter queue, you will need to perform the following steps:

1. Create a new SQS standard queue to act as your DLQ.
2. Configure your SQS's redrive policy [to use your DLQ](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-dead-letter-queue.html).  Consider using a low value for the "Maximum Receives" setting, such as 2 or 3.
3. Configure the Data Prepper `s3` source to use `retain_messages` for `on_error`. This is the default behavior.

## Pipeline design

Using the following example, create a pipeline to read logs from S3 starts with an [`s3`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/) source plugin.

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

Configure the following options according to your use case:

* `queue_url`: This the SQS queue URL and is always unique to your pipeline.
* `codec`:The codec determines how to parse the incoming data.
* `visibility_timeout`:Configure this value to be large enough for Data Prepper to process 10 S3 objects. However, if you make this value too large, then messages which fail to process will take at least that long before Data Prepper retries.

The default values for each option works for the majority of use cases. For all available options for the S3 source, see [`s3`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/s3/).

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

You should have one SQS queue per Data Prepper pipeline. You can have multiple nodes in the same cluster reading from the same SQS queue, which doesn't require additional configuration with Data Prepper.

However, if you have multiple pipelines, you must create multiple SQS queues for each pipeline, even if both pipelines use the same S3 bucket.




