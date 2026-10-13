---
layout: default
title: Supported units
nav_order: 150
redirect_from:
  - /opensearch/units/
---

# Supported units

OpenSearch supports the following units for all REST operations.

## Time units

The following table lists all supported time units.

Units | Specify as
:--- | :---
Days | `d`
Hours | `h`
Minutes | `m`
Seconds | `s`
Milliseconds | `ms`
Microseconds | `micros`
Nanoseconds | `nanos`

## Byte size units

The following table lists all supported byte size units. Units are case insensitive. Byte size units are base 2, so `1kb` is equal to 1,024 bytes and `1mb` is equal to 1,048,576 bytes.

Units | Specify as
:--- | :---
Bytes | `b`
Kibibytes | `kb` or `k`
Mebibytes | `mb` or `m`
Gibibytes | `gb` or `g`
Tebibytes | `tb` or `t`
Pebibytes | `pb` or `p`

## Distance units

The following table lists all supported distance units.

Units | Specify as
:--- | :---
Miles | `mi` or `miles`
Yards | `yd` or `yards`
Feet | `ft` or `feet`
Inches | `in` or `inch`
Kilometers | `km` or `kilometers`
Meters | `m` or `meters`
Centimeters | `cm` or `centimeters`
Millimeters | `mm` or `millimeters`
Nautical miles | `NM`, `nmi`, or `nauticalmiles`

## Quantities without units

For large values that don't have a unit, such as document counts, use the following suffixes. For example, `5k` is equal to 5,000.

Suffix | Multiplier
:--- | :---
`k` | Kilo (1,000)
`m` | Mega (1,000,000)
`g` | Giga (1,000,000,000)
`t` | Tera (1,000,000,000,000)
`p` | Peta (1,000,000,000,000,000)

## Related documentation

- [Common REST parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/)
