---
layout: default
title: csv
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# csv

## Overview

Takes in an Event and parses its CSV data into columns.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The field in the Event that will be parsed. Default is `message`.
quote_character | No | String | The character used as a text qualifier for a single column of data. Default is double quote `"`.
delimiter | No | String | The character separating each column. Default is `,`.
delete_header | No | Boolean | If specified, the header on the Event (`column_names_source_key`) deletes after the event is parsed. If there’s no header on the event, no actions is taken. Default is true.
column_names_source_key | No | String | The field in the Event that specifies the CSV column names, which will be autodetected. If there must be extra column names, the column names autogenerate according to their index. If `column_names` is also defined, the header in `column_names_source_key` can also be used to generate the event fields. If too few columns are specified in this field, the remaining column names autogenerate. If too many column names are specified in this field, the CSV processor omits the extra column names.
column_names | No | List | User-specified names for the CSV columns. Default is `[column1, column2, ..., columnN]` if there are N columns of data in the CSV record and `column_names_source_key` is not defined. If `column_names_source_key` is defined, the header in `column_names_source_key` generates the Event fields. If too few columns are specified in this field, the remaining column names will autogenerate. If too many column names are specified in this field, CSV processor omits the extra column names.

<!---## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.--->