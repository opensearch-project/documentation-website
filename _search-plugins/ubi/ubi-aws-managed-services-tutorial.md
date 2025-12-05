---
layout: default
title: Collecting UBI-Formatted Data in Amazon OpenSearch Service
parent: User Behavior Insights
has_children: false
nav_order: 30
---


# Collecting UBI-Formatted Data in Amazon OpenSearch Service

This tutorial shows you how to collect queries and events in the User Behavior Insights (UBI) format when using Amazon OpenSearch Service (AWS managed service).

The native UBI plugin is only available in open-source OpenSearch distributions and is not part of Amazon OpenSearch Service. This tutorial demonstrates an alternative approach using Amazon OpenSearch Ingestion for AWS managed service customers who want to implement UBI-style data collection.
{: .important}

After following this tutorial, you'll be able to send authenticated queries and events to both Amazon Simple Storage Service (Amazon S3) for long-term storage and OpenSearch for real-time processing using the `curl` command-line tool. 

This tutorial assumes the following:

1. You are using Amazon's Managed OpenSearch Service.
2. You are not using the UBI plugin for OpenSearch. The UBI plugin is only available in the open-source version of OpenSearch and is not included in Amazon OpenSearch Service (the AWS managed service).
3. You are writing UBI data to OpenSearch using [Amazon OpenSearch Ingestion](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ingestion.html), the managed version of OpenSearch Data Prepper.
4. You have already configured permissions between OpenSearch Ingestion and your managed clusters by following the instructions found in [Tutorial: Ingesting data into a domain using Amazon OpenSearch Ingestion](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/osis-get-started.html), specifically the *Required permissions* step.

## Step 1: Set up OpenSearch indexes for UBI

Follow these steps to create the indexes needed for UBI data:

1. Log in to OpenSearch Dashboards in Amazon OpenSearch Service.
1. On the main menu, select **Management > Dev Tools** to open the **Dev Tools** console.
1. Create two new indexes: `ubi_events` and `ubi_queries`.

    1. First, start creating the mappings for the `ubi_events` index:

        ```json
        PUT /ubi_events
        {
          "mappings": 
        }
        ```

        A syntax warning will appear at this point. That's expected; you'll enter the mappings next.

        Open the [events-mapping.json](https://github.com/opensearch-project/user-behavior-insights/blob/main/src/main/resources/events-mapping.json) file, copy its contents, and paste them after the `"mappings":` line:

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
              ...
            }
          }
        }
        ```

        Run the command and verify that it succeeds.

    1. Next, create the `ubi_queries` index in a similar way. Set up the mappings:

        ```json
        PUT ubi_queries
        {
          "mappings": 
        }
        ```

        Open the [queries-mapping.json](https://github.com/opensearch-project/user-behavior-insights/blob/main/src/main/resources/queries-mapping.json?utm_source=chatgpt.com) file, copy its contents, and paste them after the `"mappings":` line. Run the command and verify that it succeeds.

## Step 2: Set up Amazon S3 storage

For long-term storage of UBI data, use Amazon S3.  

Before proceeding, create an S3 bucket in which the query and event data will be stored. You can do this in the AWS Management Console. Note the bucket name and the AWS Region in which it is created; you'll need this information for the following steps.

## Step 3: Set up query and event ingest pipelines

Follow these steps to set up query and event ingest pipelines.

### Required permissions

To complete this tutorial, your user or role must have an attached identity-based policy with the following minimum permissions. These permissions allow you to create a pipeline role and attach a policy (`iam:Create*` and `iam:Attach*`), create or modify a domain (`es:*`), and work with pipelines (`osis:*`):

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
{% include copy.html %}

Your `DataPrepperOpenSearchRole` must have permissions similar to the following:

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
{% include copy.html %}

### Step 3(a): Create a query pipeline

Follow these steps to create a pipeline for UBI query data:

1. In the Amazon OpenSearch Service console, select **Pipelines** from the left navigation pane.
1. Select **Create pipeline**.
1. Select a **Blank** pipeline, then select **Select blueprint**.
1. Configure the pipeline to use the **HTTP** source plugin, which accepts UBI query data in JSON array format. Set the OpenSearch Service domain as the sink, directing all data into the `ubi_queries` index. Additionally, log all events to an S3 bucket in `.ndjson` format.
1. In the **Source** menu, select **HTTP**. For **Path**, enter `/ubi/queries`.
1. For **Source network options**, select **Public access** to allow the posting of data from your application.
1. Select **Next**.
1. Skip intermediate **Processor** steps by selecting **Next** on the **Processor** screen.
1. Configure the first sink:
   * In **OpenSearch resource type**, select **Managed cluster**.  
   * Select the OpenSearch Service domain you created earlier.  
   * In **Index name**, enter `ubi_queries`. Make sure this index exists with the required UBI schema.
1. Configure the second sink:
    * Select **Add Sink**.  
    * Select **Amazon S3**.  
    * Enter the bucket name and AWS Region you created previously.  
    * In **Event Collection Timeout**, enter `60s` to observe data flow quickly.  
    * Select **NDJSON** as the format.
1. Select **Next**.
1. Name the pipeline `ubi-queries-pipeline` and leave the capacity settings at their defaults.
1. Select **Next**, then **Create Pipeline**.

### Step 3(b): Test the query pipeline

When the pipeline status is `Active`, you can start ingesting data into it. You must sign all HTTP requests to the pipeline using [AWS Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html). Use an HTTP tool such as [Postman](https://www.getpostman.com/) or [awscurl](https://github.com/okigan/awscurl) to send some data to the pipeline. As with indexing data directly to a domain, ingesting data into a pipeline always requires either an AWS Identity and Access Management (IAM) role or an [IAM access key and secret key](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html).

To test the pipeline, use these steps:

1. Retrieve the ingestion URL from the **Pipeline settings** page, shown in the following image.

    ![Pipeline Settings]({{site.url}}{{site.baseurl}}/images/ubi/opensearch-ingestion-pipeline.png "Pipeline Settings")

1. Post a UBI query to the ingest pipeline. The following is an example of posting a query using [awscurl](https://github.com/okigan/awscurl):

    ```bash
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
    {% include copy.html %}

    You should receive a `200 OK` response.

1. Query for the event data that you posted using the Dev Tools console. Note that it may take some time for the data to flow through OpenSearch Ingestion into the `ubi_queries` index:

    ```json
    GET /ubi_queries/_search
    {
      "query": {
        "match_all": {}
      },
      "sort": [
        { "timestamp": { "order": "desc" } }
      ]
    }
    ```
    {% include copy-curl.html %}

    If you want the newly written data to appear immediately, run the following request:

    ```json
    POST /ubi_queries/_refresh
    ```
    {% include copy-curl.html %}

### Step 3(c): Create an event pipeline

Repeat [Step 3(a)](#step-3a-create-a-query-pipeline) to set up a pipeline for the UBI event data. Use the following table to replace query-specific values with their event equivalents.

| Setting                  | Query pipeline           | Event pipeline           |
|--------------------------|------------------------|------------------------|
| Path                     | `/ubi/queries`         | `/ubi/events`          |
| Index name               | `ubi_queries`          | `ubi_events`           |
| Pipeline name            | `ubi-queries-pipeline` | `ubi-events-pipeline`  |
| S3 path prefix pattern   | `ubi_queries/`         | `ubi_events/`          |
| Dev Tools search         | `GET ubi_queries/_search` | `GET ubi_events/_search` |
| Refresh command          | `POST ubi_queries/_refresh` | `POST ubi_events/_refresh` |

### Step 3(d): Test the event pipeline

Test the event pipeline by following [Step 3(b)](#step-3b-test-the-query-pipeline). The following is an example of posting a query using [awscurl](https://github.com/okigan/awscurl):

```bash
awscurl --service osis --region us-east-1 \
    -X POST \
    -H "Content-Type: application/json" \
    -d '[
  {
    "action_name": "product_hover",
    "client_id": "CLIENT-9a9968ac-664b-42d7-9a9e-96f412b5ab49",
    "query_id": "d194b734-70a4-41dc-b103-b26a56a277b5",
    "page_id": "/",
    "message_type": "INFO",
    "message": "Integral 2GB SD Card memory card (undefined)",
    "timestamp": 1724944081669,
    "event_attributes": {
      "object": {
        "object_id_field": "product",
        "object_id": "1625640",
        "description": "Integral 2GB SD Card memory card",
        "object_detail": null
      }
    }
  }
]
' \
https://ubi-events-pipeline-il3g3pwe4ve4nov4bwhnzlrm4q.us-east-1.osis.amazonaws.com/ubi/events
```
{% include copy.html %}

Now you're ready to start collecting UBI data for your applications.
