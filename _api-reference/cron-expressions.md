---
layout: default
title: Cron expressions
nav_order: 165
redirect_from:
  - /monitoring-plugins/alerting/cron/
  - /observing-your-data/alerting/cron/
---

# Cron expressions

Several OpenSearch features accept cron expressions for scheduling, including [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/), [alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/), and [anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/). OpenSearch uses the standard UNIX cron syntax. All schedule times are in UTC.

A cron expression has the following format:

```
<minutes> <hours> <day_of_month> <month> <day_of_week>
```

The following table describes each field.

| Field | Values | Special characters |
| :--- | :--- | :--- |
| Minutes | 0--59 | `, - * /` |
| Hours | 0--23 | `, - * /` |
| Day of month | 1--31 | `, - * /` |
| Month | 1--12 or JAN--DEC (case-insensitive) | `, - * /` |
| Day of week | 0--7 (0 and 7 are both Sunday) or SUN--SAT (case-insensitive) | `, - * /` |

The following table describes the special characters.

| Character | Description |
| :--- | :--- |
| `*` | Matches all values. For example, `*` in the month field matches every month. |
| `-` | Range. For example, `1-5` in `day_of_week` matches Monday through Friday. |
| `,` | Multiple values. For example, `1,3,5` in `day_of_week` means Monday, Wednesday, and Friday. |
| `/` | Increment. For example, `0/15` in minutes means every 15 minutes starting at minute 0. |

Two fields specify the day: `day_of_month` and `day_of_week`. If you use a non-wildcard value in both, the schedule runs whenever either field matches the time. For example, `15 2 1,15 * 1` runs at 2:15 AM UTC on the first day of the month, on the 15th day of the month, and every Monday. To schedule a single day, set one field and leave the other as `*`.

## Examples

| Expression | Description |
| :--- | :--- |
| `5 9 * * *` | 9:05 AM UTC every day |
| `0/15 9 * * *` | Every 15 minutes from 9:00 to 9:45 AM UTC |
| `5 9 * * 1-5` | 9:05 AM UTC Monday through Friday |
| `5 9 * * MON-FRI` | 9:05 AM UTC Monday through Friday (using named days) |
| `45 13 1-31/2 * *` | 1:45 PM UTC every other day |
| `0/10 * * * 6-7` | Every 10 minutes on Saturday and Sunday |
| `0 0-23/3 1 1-12/2 *` | Every 3 hours on the first day of every other month |

## Related documentation

- [Common REST parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/)
- [Index name syntax]({{site.url}}{{site.baseurl}}/api-reference/index-name-syntax/)
- [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/)
