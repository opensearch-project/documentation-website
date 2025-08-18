---
layout: default
title: UBI in AWS Managed Services tutorial
parent: User Behavior Insights
has_children: false
nav_order: 24
---


# UBI in AWS Managed Services tutorial

This tutorial walks you through the steps for collecting queries and events in the UBI (User Behavior Insights) format when you are using AWS's OpenSearch Service.  At the end of this tutorial you will be able to send authenticated queries and events to both S3 for long term storage and OpenSearch for immediate processing using the Curl command line tool. At the end of the tutorial you will be ready to start collecting UBI data for your applications.

The tutorial makes the following assumptions:

1. You are using AWS Managed Service OpenSearch version 2.19.
1. You are not using the UBI Plugin for OpenSearch, which isn't available until OpenSearch 3.1 in Managed Service.
1. You are writing UBI data to OpenSearch using [OpenSearch Ingestion](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ingestion.html), the managed version of Data Prepper.
1. You have already established permissions between OpenSearch Ingestion and your Managed Clusters by following the steps in the tutorial [Tutorial: Ingesting data into a domain using Amazon OpenSearch Ingestion
](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/osis-get-started.html), specifically the *Required Permissions* step.


## 1. Set up OpenSearch indexes for UBI

Log into Managed Service OpenSearch Dashboard. We will use the DevTools console to create two indexes for storing data: `ubi_queries` and `ubi_events`.  

Navigate to **Management > Dev Tools**

Create the overall index creation command:

```json
PUT ubi_events
{
  "mappings": 
}
```

You will see a syntax warning after typing this in, that's okay.

Then, go to (https://github.com/opensearch-project/user-behavior-insights/blob/main/src/main/resources/events-mapping.json)[https://github.com/opensearch-project/user-behavior-insights/blob/main/src/main/resources/events-mapping.json] and copy the entire JSON formatted contents of the file and paste it in after the `"mappings":` line in the Dev Tools console. This will produce a complete command similar to:

```json
PUT ubi_events
{
  "mappings": {
    "properties": {
      "application": {
        "type": "keyword",
        "ignore_above": 256
      },
      "action_name": {
        "type": "keyword",
        "ignore_above": 100
      },
      CUT FOR LENGTH
```

Go ahead and run that command and make sure it runs successfully.

You will do the same thing for `ubi_queries`.

```json
PUT ubi_queries
{
  "mappings": 
}
```

This time go to https://github.com/opensearch-project/user-behavior-insights/blob/main/src/main/resources/queries-mapping.json and copy the entire JSON text and paste it in after the `"mappings":` line in the Dev Tools console. Run the command.

> If you are using OpenSearch 3.0 or newer then the UBI plugin is already included. Instead of manually creating the indexes you can instead use the UBI plugin to create them:
>
> ```json
> POST /_plugins/ubi/initialize
> ```
{: .note}

You now have the required OpenSearch indexes to recieve UBI data from applications.

## 2. Set up S3 Storage

You need to have a bucket alredy created that you can write the queries and events data to.  Use the AWS Console to create the S3 bucket.  

## 3. Set up OpenSearch Ingestion Pipeline

### Required Permissions

To complete this tutorial, your user or role must have an attached identity-based policy with the following minimum permissions. These permissions allow you to create a pipeline role and attach a policy (`iam:Create*` and `iam:Attach*`), create or modify a domain (`es:*`), and work with pipelines (`osis:*`).

```json
{
   "Version":"2012-10-17",
   "Statement":[
      {
         "Effect":"Allow",
         "Resource":"*",
         "Action":[
            "osis:*",
            "iam:Create*",
            "iam:Attach*",
            "es:*"
         ]
      },
      {
         "Resource":[
            "arn:aws:iam::111122223333:role/OpenSearchIngestion-PipelineRole"
         ],
         "Effect":"Allow",
         "Action":[
            "iam:CreateRole",
            "iam:AttachRolePolicy",
            "iam:PassRole"
         ]
      }
   ]
}
```

We expect your *DataPrepperOpenSearchRole* to have permissions similar to:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "es:ESHttpPost",
                "es:ESHttpPut",
                "es:ESHttpGet",
                "es:ESHttpHead"
            ],
            "Resource": "arn:aws:es:*:<YOUR_AWS_ACCOUNT_NUMBER>:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::<YOUR-BUCKET>/*"
        }
    ]
}
```

### Create a Pipeline

Now you can create a pipeline.   __This is inspired by https://docs.aws.amazon.com/opensearch-service/latest/developerguide/osis-get-started.html__

1. Within the Amazon OpenSearch Service console, choose **Pipelines** from the left navigation pane.

1. Choose **Create pipeline**.

1. Select the **Blank** pipeline, then choose **Select blueprint**.

1. In this tutorial, we'll create a simple pipeline that uses the HTTP source plugin. The plugin accepts UBI query data in a JSON array format. We'll specify a OpenSearch Service domain as the sink, and ingest all data into the `ubi_queries` index.  We will also log all events to an S3 bucket in `.ndjson` format.

In the **Source**e menu, choose **HTTP**. For the **Path**, enter `/ubi/queries`.

1. We will configure public access for the pipeline to faciliate posting data from our notional application. For **Source network options**, choose **Public access**. 

1. Choose Next.

1. We do not require any intermediate Processor steps, so on the Processor screen, choose Next.

1. Configure the first sink. For **OpenSearch resource type**, choose **Managed cluster**. Then choose the OpenSearch Service domain that you created in the previous section.

For **Index name**, enter `ubi_queries`. OpenSearch Ingestion automatically creates this index in the domain if it doesn't already exist, so make sure you have already created it using the specific schema required by UBI.

1. Now configure the second sink.  Start by clicking **Add Sink**.

1. Choose **Amazon S3**.

1. For **S3 bucket**, enter the bucket name that you created previosly and the corresponding **S3 Region**. Then choose the OpenSearch Service domain that you created in the previous section.  For **Event Collection Timeout** use `60s` so you can see the data fairly quickly.  There are a number of formats you can save the data as, **NDJSON** is a perfectly good one.

1. Choose **Next**.

1. Name the pipeline `ubi-queries-pipeline`. Leave the capacity settings as their defaults.

1. Choose **Next**.

1. Choose **Create Pipeline**.


## 4. Test with sample events

When the pipeline status is `Active`, you can start ingesting data into it. You must sign all HTTP requests to the pipeline using [Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html). Use an HTTP tool such as [Postman](https://www.getpostman.com/) or [awscurl](https://github.com/okigan/awscurl) to send some data to the pipeline. As with indexing data directly to a domain, ingesting data into a pipeline always requires either an IAM role or an [IAM access key and secret key](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html).

First, get the ingestion URL from the Pipeline settings page:

![Pipeline Settings]({{site.url}}{{site.baseurl}}/images/ubi/opensearch-ingestion-pipeline.png "Pipeline Settings")

Here is an example of posting a query using [awscurl](https://github.com/okigan/awscurl):

```
awscurl --service osis --region us-east-1 \
    -X POST \
    -H "Content-Type: application/json" \
    -d '[{
    "query_response_id": "117d75fb-ea76-41dc-9d1d-1d7bba548bd8",
    "user_query": "laptop",
    "query_id": "d194b734-70a4-41dc-b103-b26a56a277b5",
    "application": "Chorus",
    "query_response_hit_ids": [
      "B076YX2LML",
      "B07S3T59VP",
      "B075ZGJSL1",
      "B07FMGGRGG",
      "B07KN5JP3H",
      "B07FM8BNBC",
      "B007OYLNGA",
      "B07P75NDMB",
      "B004HJ1ZB8",
      "B01M69KU15",
      "B072ZW6NBL",
      "B07R7NL612",
      "B083GH3L2N",
      "B06XNQDR8J",
      "B07ZQJQ4HV",
      "B07YZHH5WY",
      "B07F822FND",
      "B004XAVT8K",
      "B07F5JN761",
      "B087RNZT41"
    ],
    "query_attributes": {},
    "client_id": "CLIENT-9a9968ac-664b-42d7-9a9e-96f412b5ab49",
    "timestamp": "2025-01-23T13:18:22.274+0000"
  }]' \
https://ubi-queries-pipeline-il3g3pwe4ve4nov4bwhnzlrm4q.us-east-1.osis.amazonaws.com/ubi/queries
```

You should see a `200 OK` response.

Now you can query for the event data that you posted via the Dev Tools console.  It may take a minute for the data to flow through OpenSearch Ingestion to the `ubi_queries` index.   

```
GET ubi_queries/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    { "timestamp": { "order": "desc" } }
  ]
}
```

If you are feeling impatient you can force the newly written data to be visible with:

```
POST ubi_queries/_refresh
```

## Where Next?
