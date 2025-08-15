---
layout: default
title: UBI in AWS Managed Services tutorial
parent: User Behavior Insights
has_children: false
nav_order: 24
---


# UBI in AWS Managed Services tutorial

This tutorial walks you through the steps for collecting queries and events in the UBI (User Behavior Insights) format when you are using AWS's Managed Service for OpenSearch.  At the end of this tutorial you will be able to send authenticated queries and events to both S3 for long term storage and OpenSearch for immediate processing using the Curl command line tool. At the end of the tutorial you will be ready to start collecting UBI data for your applications.

The tutorial makes the following assumptions:

1. You are using AWS Managed Service OpenSearch version 2.19.
1. You are not using the UBI Plugin for OpenSearch, which isn't available until OpenSearch 3.1 in Managed Service.
1. You are writing UBI data to OpenSearch using [OpenSearch Ingestion](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ingestion.html), the managed version of Data Prepper.


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

## 3. Set up OpenSearch Ingestion Pipeline


## 4. Test with sample events

Here is an example of posting an event.
```
awscurl --service osis --region us-east-1 \
    -X POST \
    -H "Content-Type: application/json" \
    -d '[{
      "action_name": "page_exit",
      "user_id": "1821196507152684",
      "query_id": "00112233-4455-6677-8899-aabbccddeeff",
      "session_id": "c3d22be7-6bdc-4250-91e1-fc8a92a9b1f9",
      "page_id": "/docs/latest/",
      "timestamp": "2024-05-16T12:34:56.789Z",
      "message_type": "INFO",
      "message": "On page /docs/latest/ for 3.35 seconds"
    }]' \
    https://erictry2-e2tkd7xuvkswcreho56cuylooq.us-east-1.osis.amazonaws.com/eric-ubi-queries

```

Now you can query for the event data that you posted in the Dev Tools console.  It may take a minute for the data to flow through OpenSearch Ingestion to the `ubi_queries` index.   

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
