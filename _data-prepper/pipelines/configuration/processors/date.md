---
layout: default
title: date
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# date

## Overview

Adds a default timestamp to the event or parses timestamp fields, and converts it to ISO 8601 format, which can be used as event timestamp.

Option | Required | Type | Description
:--- | :--- | :--- | :---
match | Conditionally | List | List of `key` and `patterns` where patterns is a list. The list of match can have exactly one `key` and `patterns`. There is no default value. This option cannot be defined at the same time as `from_time_received`. Include multiple date processors in your pipeline if both options should be used.
from_time_received | Conditionally | Boolean | A boolean that is used for adding default timestamp to event data from event metadata which is the time when source receives the event. Default value is `false`. This option cannot be defined at the same time as `match`. Include multiple date processors in your pipeline if both options should be used.
destination | No | String | Field to store the timestamp parsed by date processor. It can be used with both `match` and `from_time_received`. Default value is `@timestamp`.
source_timezone | No | String | Time zone used to parse dates. It is used in case the zone or offset cannot be extracted from the value. If the zone or offset are part of the value, then timezone is ignored. Find all the available timezones [the list of database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) in the **TZ database name** column.
destination_timezone | No | String | Timezone used for storing timestamp in `destination` field. The available timezone values are the same as `source_timestamp`.
locale | No | String | Locale is used for parsing dates. It's commonly used for parsing month names(`MMM`). It can have language, country and variant fields using IETF BCP 47 or String representation of [Locale](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html) object. For example `en-US` for IETF BCP 47 and `en_US` for string representation of Locale. Full list of locale fields which includes language, country and variant can be found [the language subtag registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). Default value is `Locale.ROOT`.

<!---## Configuration

Content will be added to this section.--->

## Metrics

Add the following? "Apart from common metrics in [AbstractProcessor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java), the `date` processor introduces the following custom metrics:

* `dateProcessingMatchSuccessCounter`: Returns the number of records that match with at least one pattern specified in the `match configuration` option. 
* `dateProcessingMatchFailureCounter`: Returns the number of records that did not match any of the patterns specified in the `patterns match` configuration option.