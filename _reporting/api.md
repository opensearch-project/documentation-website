---
layout: default
title: Reporting API
nav_order: 8
---

# Reporting API

Use the Reporting API to create and manage report definitions and to generate reports from dashboards, visualizations, saved searches, and notebooks. A report definition specifies the source object to capture, the file format, the time range, and an optional schedule. Generating a report from a definition produces a report instance.

Report definitions and report instances are managed through OpenSearch, but the file itself is rendered by OpenSearch Dashboards. Creating a definition and listing instances use the OpenSearch endpoint on port 9200, and downloading the report content uses the OpenSearch Dashboards endpoint on port 5601. For more information, see [Downloading report content](#downloading-report-content).

For the OpenSearch Dashboards interface equivalent of these operations, see [Reporting using OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/reporting/report-dashboard-index/).

## Report source types and file formats

The `Csv` and `Xlsx` file formats export the underlying rows of a saved search. They are not supported for the `Visualization`, `Dashboard`, or `Notebook` source types, which are captured as rendered images. To export the data behind a visualization as CSV, save the equivalent query as a saved search in **Discover** and use that saved search as the report source.

The following table lists the file formats supported for each report source type.

| Source type | Supported file formats |
| :--- | :--- |
| `SavedSearch` | `Csv`, `Xlsx` |
| `Visualization` | `Pdf`, `Png` |
| `Dashboard` | `Pdf`, `Png` |
| `Notebook` | `Pdf`, `Png` |

OpenSearch accepts a report definition that pairs a source type with an unsupported file format, such as `Visualization` with `Csv`, but the report cannot be rendered. A definition with an unsupported pairing also causes the **Reporting** page in OpenSearch Dashboards to fail to load its list of report definitions until you delete the definition.
{: .warning}

## Create report definition API

Creates a report definition.

### Endpoint

```json
POST _plugins/_reports/definition
```

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `reportDefinition` | Object | The report definition. Required. |
| `reportDefinition.name` | String | The name of the report definition. Required. |
| `reportDefinition.isEnabled` | Boolean | Whether the definition's schedule is active. Required. |
| `reportDefinition.source` | Object | The object to capture. Required. |
| `reportDefinition.source.type` | String | The type of source object. Valid values are `Dashboard`, `Visualization`, `SavedSearch`, and `Notebook`. Required. |
| `reportDefinition.source.id` | String | The saved object ID of the source object. Required. |
| `reportDefinition.source.origin` | String | The base URL of the OpenSearch Dashboards instance that renders the report, such as `http://localhost:5601`. Required. |
| `reportDefinition.source.description` | String | A description of the source object. Optional. |
| `reportDefinition.format` | Object | The output format. Required. |
| `reportDefinition.format.fileFormat` | String | The file format of the generated report. Valid values are `Pdf`, `Png`, `Csv`, and `Xlsx`. Required. |
| `reportDefinition.format.duration` | String | The time range to capture, ending at the time the report is generated, as an ISO 8601 duration such as `PT30M` or `P60D`. Required. |
| `reportDefinition.format.limit` | Integer | The maximum number of rows to include in a `Csv` or `Xlsx` report. Optional. |
| `reportDefinition.format.header` | String | A header to add to the report. Optional. |
| `reportDefinition.trigger` | Object | Specifies when the report is generated. Required. |
| `reportDefinition.trigger.triggerType` | String | Valid values are `OnDemand`, `Download`, `CronSchedule`, and `IntervalSchedule`. Required. |
| `reportDefinition.trigger.schedule` | Object | The schedule on which to generate the report. Required when `triggerType` is `CronSchedule` or `IntervalSchedule`. |
| `reportDefinition.delivery` | Object | Notification settings for the generated report. Optional. |

### Example request

The following request creates an on-demand definition that exports the last 60 days of a saved search as CSV:

```json
POST _plugins/_reports/definition
{
  "reportDefinition": {
    "name": "Orders CSV",
    "isEnabled": true,
    "source": {
      "description": "CSV of all orders",
      "type": "SavedSearch",
      "origin": "http://localhost:5601",
      "id": "<saved_search_id>"
    },
    "format": {
      "duration": "P60D",
      "fileFormat": "Csv",
      "limit": 1000,
      "header": ""
    },
    "trigger": {
      "triggerType": "OnDemand"
    },
    "delivery": {
      "configIds": [],
      "title": "",
      "textDescription": "",
      "htmlDescription": ""
    },
    "status": "ACTIVE"
  }
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "reportDefinitionId": "7f6fY6ABLgrkzSeVjlGr"
}
```

### Example request: Scheduled report

To generate a report on a recurring schedule, set `triggerType` to `CronSchedule` and provide a `schedule` object. The following request generates the same CSV report every day at 6:00 AM:

```json
POST _plugins/_reports/definition
{
  "reportDefinition": {
    "name": "Daily orders CSV",
    "isEnabled": true,
    "source": {
      "description": "CSV of all orders",
      "type": "SavedSearch",
      "origin": "http://localhost:5601",
      "id": "<saved_search_id>"
    },
    "format": {
      "duration": "P1D",
      "fileFormat": "Csv",
      "limit": 10000,
      "header": ""
    },
    "trigger": {
      "triggerType": "CronSchedule",
      "schedule": {
        "cron": {
          "expression": "0 6 * * *",
          "timezone": "America/Los_Angeles"
        }
      }
    },
    "status": "ACTIVE"
  }
}
```
{% include copy-curl.html %}

For more information about cron expressions, see [Cron expression reference]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/cron/).

## List report definitions API

Retrieves all report definitions.

### Endpoint

```json
GET _plugins/_reports/definitions
```

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `fromIndex` | Integer | The index of the first definition to return. Default is `0`. |
| `maxItems` | Integer | The maximum number of definitions to return. |

### Example request

```json
GET _plugins/_reports/definitions
```
{% include copy-curl.html %}

### Example response

```json
{
  "startIndex": 0,
  "totalHits": 1,
  "totalHitRelation": "eq",
  "reportDefinitionDetailsList": [
    {
      "id": "7f6fY6ABLgrkzSeVjlGr",
      "lastUpdatedTimeMs": 1788377796262,
      "createdTimeMs": 1788377796262,
      "tenant": "",
      "reportDefinition": {
        "name": "Orders CSV",
        "isEnabled": true,
        "source": {
          "description": "CSV of all orders",
          "type": "SavedSearch",
          "origin": "http://localhost:5601",
          "id": "test-search"
        },
        "format": {
          "duration": "PT1440H",
          "fileFormat": "Csv",
          "limit": 1000,
          "header": "",
          "timeFrom": null,
          "timeTo": null
        },
        "trigger": {
          "triggerType": "OnDemand"
        },
        "delivery": {
          "title": "",
          "textDescription": "",
          "htmlDescription": "",
          "configIds": []
        }
      }
    }
  ]
}
```

## Get report definition API

Retrieves a single report definition.

### Endpoint

```json
GET _plugins/_reports/definition/{report_definition_id}
```

### Example request

```json
GET _plugins/_reports/definition/7f6fY6ABLgrkzSeVjlGr
```
{% include copy-curl.html %}

### Example response

```json
{
  "reportDefinitionDetails": {
    "id": "7f6fY6ABLgrkzSeVjlGr",
    "lastUpdatedTimeMs": 1788377796434,
    "createdTimeMs": 1788377796262,
    "tenant": "",
    "reportDefinition": {
      "name": "Orders CSV",
      "isEnabled": true,
      "source": {
        "description": "CSV of all orders",
        "type": "SavedSearch",
        "origin": "http://localhost:5601",
        "id": "test-search"
      },
      "format": {
        "duration": "PT1440H",
        "fileFormat": "Csv",
        "limit": 1000,
        "header": "",
        "timeFrom": null,
        "timeTo": null
      },
      "trigger": {
        "triggerType": "OnDemand"
      },
      "delivery": {
        "title": "",
        "textDescription": "",
        "htmlDescription": "",
        "configIds": []
      }
    }
  }
}
```

## Update report definition API

Replaces an existing report definition. Provide the complete definition, because fields you omit are not preserved.

### Endpoint

```json
PUT _plugins/_reports/definition/{report_definition_id}
```

### Example request

```json
PUT _plugins/_reports/definition/7f6fY6ABLgrkzSeVjlGr
{
  "reportDefinition": {
    "name": "Orders CSV",
    "isEnabled": true,
    "source": {
      "description": "CSV of all orders",
      "type": "SavedSearch",
      "origin": "http://localhost:5601",
      "id": "<saved_search_id>"
    },
    "format": {
      "duration": "P90D",
      "fileFormat": "Csv",
      "limit": 5000,
      "header": ""
    },
    "trigger": {
      "triggerType": "OnDemand"
    },
    "status": "ACTIVE"
  }
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "reportDefinitionId": "7f6fY6ABLgrkzSeVjlGr"
}
```

## Delete report definition API

Deletes a report definition. Deleting a definition does not delete reports that were already generated from it.

### Endpoint

```json
DELETE _plugins/_reports/definition/{report_definition_id}
```

### Example request

```json
DELETE _plugins/_reports/definition/7f6fY6ABLgrkzSeVjlGr
```
{% include copy-curl.html %}

### Example response

```json
{
  "reportDefinitionId": "7f6fY6ABLgrkzSeVjlGr"
}
```

## Generate on-demand report API

Creates a report instance from an existing report definition. The response records the definition used and the time range captured. To retrieve the file content, see [Downloading report content](#downloading-report-content).

### Endpoint

```json
POST _plugins/_reports/on_demand/{report_definition_id}
```

### Example request

```json
POST _plugins/_reports/on_demand/7f6fY6ABLgrkzSeVjlGr
{}
```
{% include copy-curl.html %}

### Example response

```json
{
  "reportInstance": {
    "id": "7v6fY6ABLgrkzSeVpVGM",
    "lastUpdatedTimeMs": 1788377802121,
    "createdTimeMs": 1788377802121,
    "beginTimeMs": 1780601802121,
    "endTimeMs": 1788377802121,
    "tenant": "",
    "reportDefinitionDetails": {
      "id": "7f6fY6ABLgrkzSeVjlGr",
      "reportDefinition": {
        "name": "Orders CSV",
        "isEnabled": true,
        "source": {
          "description": "CSV of all orders",
          "type": "SavedSearch",
          "origin": "http://localhost:5601",
          "id": "test-search"
        },
        "format": {
          "duration": "PT1440H",
          "fileFormat": "Csv",
          "limit": 5000,
          "header": "",
          "timeFrom": null,
          "timeTo": null
        },
        "trigger": {
          "triggerType": "OnDemand"
        }
      }
    },
    "status": "Success"
  }
}
```

### Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `reportInstance.id` | String | The ID of the report instance. |
| `reportInstance.beginTimeMs` | Integer | The start of the captured time range, in milliseconds since the epoch. |
| `reportInstance.endTimeMs` | Integer | The end of the captured time range, in milliseconds since the epoch. |
| `reportInstance.reportDefinitionDetails` | Object | The report definition used to generate the instance. |
| `reportInstance.status` | String | The status of the report instance, such as `Success`. |

## List report instances API

Retrieves the report instances that were generated in the cluster.

### Endpoint

```json
GET _plugins/_reports/instances
```

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `fromIndex` | Integer | The index of the first instance to return. Default is `0`. |
| `maxItems` | Integer | The maximum number of instances to return. |

### Example request

```json
GET _plugins/_reports/instances?fromIndex=0&maxItems=2
```
{% include copy-curl.html %}

### Example response

```json
{
  "startIndex": 0,
  "totalHits": 5,
  "totalHitRelation": "eq",
  "reportInstanceList": [
    {
      "id": "7v6fY6ABLgrkzSeVpVGM",
      "lastUpdatedTimeMs": 1788377802121,
      "createdTimeMs": 1788377802121,
      "beginTimeMs": 1780601802121,
      "endTimeMs": 1788377802121,
      "tenant": "",
      "status": "Success"
    }
  ]
}
```

## Get report instance API

Retrieves a single report instance.

### Endpoint

```json
GET _plugins/_reports/instance/{report_instance_id}
```

### Example request

```json
GET _plugins/_reports/instance/7v6fY6ABLgrkzSeVpVGM
```
{% include copy-curl.html %}

## Downloading report content

The OpenSearch endpoints manage report metadata and do not return the report file. To retrieve the content, call the OpenSearch Dashboards reporting endpoint with the ID of a report definition:

```json
POST {osd_host}:{port}/api/reporting/generateReport/{report_definition_id}
```

This endpoint requires the `osd-xsrf: true` header and the following query parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `timezone` | String | The time zone used to interpret the report time range, such as `UTC`. Required. |
| `dateFormat` | String | The format applied to date fields in the output, such as `MMM D, YYYY @ HH:mm:ss.SSS`. Required. |
| `csvSeparator` | String | The character used to delimit values in `Csv` output. Required. |
| `allowLeadingWildcards` | Boolean | Whether the saved search query can begin with a wildcard. Required. |

### Example request

The following request downloads the CSV content of a report definition:

```bash
curl -X POST \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  'http://localhost:5601/api/reporting/generateReport/7f6fY6ABLgrkzSeVjlGr?timezone=UTC&dateFormat=MMM%20D,%20YYYY%20@%20HH:mm:ss.SSS&csvSeparator=,&allowLeadingWildcards=true' \
  -d '{}'
```
{% include copy.html %}

### Example response

For `Csv` reports, the `data` field contains the file content as text:

```json
{
  "data": "order_date,customer_name,price\n\"Aug 1, 2026 @ 10:00:00.000\",Alice,24.99\n\"Aug 2, 2026 @ 11:00:00.000\",Bob,13.5\n\"Aug 3, 2026 @ 12:00:00.000\",Carla,99",
  "filename": "Orders CSV_2026-09-02T19:34:25.546Z_4e4bc6a0-a705-11f1-b9f2-73596a0bfb5c.csv"
}
```

For `Xlsx` reports, the `data` field contains a Base64-encoded data URL instead of text.

If `data` is an empty string, the report definition's `duration` did not overlap any documents. Increase `duration` so that the time range ending at the current time includes your data.
{: .tip}

CSV reports have a non-configurable 10,000-row limit in OpenSearch version 2.16 and earlier. As of version 2.17, set the limit using the `limit` field in the report definition.
{: .note}

## Related documentation

- [Reporting using OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/reporting/report-dashboard-index/)
- [Saved Objects APIs]({{site.url}}{{site.baseurl}}/dashboards/management/saved-objects-api/)
- [Report definition access control]({{site.url}}{{site.baseurl}}/reporting/report-definition-access-control/)
- [Report instance access control]({{site.url}}{{site.baseurl}}/reporting/report-instance-access-control/)
