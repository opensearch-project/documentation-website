---
layout: default
title: Create controller
parent: Controller APIs
grand_parent: ML Commons APIs
nav_order: 10
canonical_url: https://docs.opensearch.org/docs/latest/ml-commons-plugin/api/controller-apis/create-controller/
---

# Create or update a controller
**Introduced 2.12**
{: .label .label-purple }

Use this API to create or update a controller for a model. A model may be shared by multiple users. A controller sets rate limits for the number of [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) calls users can make on the model. A controller consists of a set of rate limiters for different users.  

You can only create a controller for a model once you have registered the model and received a model ID.
{: .tip}

The POST method creates a new controller. The PUT method updates an existing controller. 

To learn how to set rate limits at the model level for all users, see [Update Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/update-model/). The rate limit is set to either the model-level limit or the user-level limit, whichever is more restrictive. For example, if the model-level limit is 2 requests per minute and the user-level limit is 4 requests per minute, the overall limit will be set to 2 requests per minute.

## Endpoints

```json
POST /_plugins/_ml/controllers/<model_id>
PUT /_plugins/_ml/controllers/<model_id>
```
{% include copy-curl.html %}

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`model_id` | String | The model ID of the model for which you want to set rate limits. Required.

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- | :---
`user_rate_limiter`| Object | Required | Limits the number of times users can call the Predict API on the model. For more information, see [Rate limiting inference calls]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#rate-limiting-inference-calls).

The `user_rate_limiter` object contains an object for each user, specified by username. The user object contains the following fields.

Field | Data type | Description
:---  | :--- | :--- 
`limit` | Integer | The maximum number of times the user can call the Predict API on the model per `unit` of time. By default, there is no limit on the number of Predict API calls. Once you set a limit, you cannot reset it to no limit. As an alternative, you can specify a high limit value and a small time unit, for example, 1 request per nanosecond.
`unit` | String | The unit of time for the rate limiter. Valid values are `DAYS`, `HOURS`, `MICROSECONDS`, `MILLISECONDS`, `MINUTES`, `NANOSECONDS`, and `SECONDS`.


#### Example request: Create a controller

```json
POST _plugins/_ml/controllers/mtw-ZI0B_1JGmyB068C0
{
  "user_rate_limiter": {
    "user1": {
      "limit": 4,
      "unit": "MINUTES"
    },
    "user2": {
      "limit": 4,
      "unit": "MINUTES"
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "model_id": "mtw-ZI0B_1JGmyB068C0",
  "status": "CREATED"
}
```

#### Example request: Update the rate limit for one user

To update the limit for `user1`, send a PUT request and specify the updated information:

```json
PUT _plugins/_ml/controllers/mtw-ZI0B_1JGmyB068C0
{
  "user_rate_limiter": {
    "user1": {
      "limit": 6,
      "unit": "MINUTES"
    }
  }
}
```
{% include copy-curl.html %}

This will update only the `user1` object, leaving all other user limits intact:

```json
{
  "model_id": "mtw-ZI0B_1JGmyB068C0",
  "user_rate_limiter": {
    "user1": {
      "limit": "6",
      "unit": "MINUTES"
    },
    "user2": {
      "limit": "4",
      "unit": "MINUTES"
    }
  }
}
```

#### Example response

```json
{
  "_index": ".plugins-ml-controller",
  "_id": "mtw-ZI0B_1JGmyB068C0",
  "_version": 2,
  "result": "updated",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 1
}
```

#### Example request: Delete the rate limit for one user

To delete the limit for `user2`, send a POST request containing all other users' limits: 

```json
POST _plugins/_ml/controllers/mtw-ZI0B_1JGmyB068C0
{
  "user_rate_limiter": {
    "user1": {
      "limit": 6,
      "unit": "MINUTES"
    }
  }
}
```
{% include copy-curl.html %}

This will overwrite the controller with the new information:

```json
{
  "model_id": "mtw-ZI0B_1JGmyB068C0",
  "user_rate_limiter": {
    "user1": {
      "limit": "6",
      "unit": "MINUTES"
    }
  }
}
```

#### Example response

```json
{
  "_index": ".plugins-ml-controller",
  "_id": "mtw-ZI0B_1JGmyB068C0",
  "_version": 2,
  "result": "updated",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 1
}
```

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/opensearch/ml/controllers/create` and `cluster:admin/opensearch/ml/controllers/update`.