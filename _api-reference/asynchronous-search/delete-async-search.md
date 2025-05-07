---
layout: default
title: Delete asynchronous search
parent: Asynchronous Search APIs
nav_order: 30
---

# Delete asynchronous search
**Introduced 1.0**
{: .label .label-purple }

The Delete Asynchronous Search API deletes an asynchronous search by its ID before its configured expiration time. Use this API to clean up searches that are no longer needed, free up cluster resources, or remove stored results that may contain sensitive data.

The following list describes what happens when you delete an asynchronous search:

- If the search is still running, the operation is canceled.
- Any stored partial or complete results are immediately removed from the cluster.
- Resources associated with the search are released.

<!-- spec_insert_start
api: asynchronous_search.delete
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_asynchronous_search/{id}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The ID of the asynchronous search to delete. This is the same ID returned when the search was created. |

## Example request

The following request deletes an asynchronous search with ID `FmRldE8zREVEUzA2ZV`:

```json
DELETE /_plugins/_asynchronous_search/FmRldE8zREVEUzA2ZV
```
{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Whether the delete operation was successful. Returns `true` when the asynchronous search was successfully deleted. |