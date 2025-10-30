---
layout: default
title: Version
parent: Supported field types
nav_order: 75
redirect_from:
  - /opensearch/supported-field-types/version/
  - /field-types/supported-field-types/version/
---

# Version field type
**Introduced 3.2**
{: .label .label-purple }

The `version` field type is designed for indexing and querying version strings that follow [Semantic Versioning (SemVer)](https://semver.org/) specifications. This field type enables proper ordering and comparison of version strings such as `1.0.0`, `2.1.0-alpha`, `1.3.0+build.1`, and others.

The `version` field type provides the following functionality:

- Correctly parses semantic version strings with major, minor, and patch components
- Handles pre-release identifiers like `-alpha`, `-beta`, `-rc.1`
- Accepts build metadata like `+build.123` but ignores it for ordering (per SemVer specification)
- Versions are sorted according to semantic versioning rules (e.g., `1.0.0-alpha < 1.0.0-beta < 1.0.0`)
- Compatible with various query types including range, term, terms, wildcard, prefix, and more

## Version format

Version strings must follow the semantic versioning format:

```
<major>.<minor>.<patch>[-<pre-release>][+<build-metadata>]
```

The variables in the preceding format must be provided as follows.

| Component | Required/Optional | Description | Example |
|:----------|:------------------|:------------|:--------|
| `major`, `minor`, `patch` | Required | Non-negative integers representing the core version number | `1.2.3` |
| `pre-release` | Optional | Alphanumeric identifiers separated by dots, indicating a pre-release version | `-alpha`, `-beta.1`, `-rc.2` |
| `build-metadata` | Optional | Alphanumeric identifiers separated by dots, providing build information (ignored for ordering) | `+build.123`, `+20230815` |

## Example mapping

Create an index with a version field:

```json
PUT test_versions
{
  "mappings": {
    "properties": {
      "app": {
        "type": "keyword"
      },
      "version": {
        "type": "version"
      },
      "release_date": {
        "type": "date"
      },
      "description": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}


## Indexing version data

Index documents with version fields:

```json
POST test_versions/_bulk
{ "index": {} }
{ "app": "AlphaApp", "version": "1.0.0", "release_date": "2023-01-01", "description": "Initial release" }
{ "index": {} }
{ "app": "AlphaApp", "version": "1.0.1", "release_date": "2023-02-15", "description": "Bug fix release" }
{ "index": {} }
{ "app": "AlphaApp", "version": "1.1.0", "release_date": "2023-05-10", "description": "Minor feature update" }
{ "index": {} }
{ "app": "AlphaApp", "version": "2.0.0", "release_date": "2024-01-01", "description": "Major release" }
{ "index": {} }
{ "app": "BetaApp", "version": "0.9.0", "release_date": "2022-12-01", "description": "Beta release" }
{ "index": {} }
{ "app": "BetaApp", "version": "1.0.0-alpha", "release_date": "2023-03-01", "description": "Alpha pre-release" }
{ "index": {} }
{ "app": "BetaApp", "version": "1.0.0-alpha.1", "release_date": "2023-03-10", "description": "Alpha patch" }
{ "index": {} }
{ "app": "BetaApp", "version": "1.0.0-beta", "release_date": "2023-04-01", "description": "Beta pre-release" }
{ "index": {} }
{ "app": "BetaApp", "version": "1.0.0-rc.1", "release_date": "2023-04-15", "description": "Release candidate" }
{ "index": {} }
{ "app": "BetaApp", "version": "1.0.0+20230815", "release_date": "2023-08-15", "description": "Build metadata release" }
```
{% include copy-curl.html %}

## Querying version fields

The version field type supports various query types.

### Term query

Find documents with a specific version:

```json
GET test_versions/_search
{
  "query": {
    "term": { "version": "1.0.1" }
  }
}
```
{% include copy-curl.html %}

#### Response

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0466295,
    "hits": [
      {
        "_index": "test_versions",
        "_id": "cSWNQpcBY7cEASBv3Vr1",
        "_score": 1.0466295,
        "_source": {
          "app": "AlphaApp",
          "version": "1.0.1",
          "release_date": "2023-02-15",
          "description": "Bug fix release"
        }
      }
    ]
  }
}
```

### Range query

Find versions within a specific range:

```json
GET test_versions/_search
{
  "query": {
    "range": {
      "version": { "gte": "2.0.0" }
    }
  }
}
```
{% include copy-curl.html %}

#### Response

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "test_versions",
        "_id": "cyWNQpcBY7cEASBv3Vr1",
        "_score": 1,
        "_source": {
          "app": "AlphaApp",
          "version": "2.0.0",
          "release_date": "2024-01-01",
          "description": "Major release"
        }
      }
    ]
  }
}
```

### Terms query

Find documents matching multiple specific versions:

```json
GET test_versions/_search
{
  "query": {
    "terms": {
      "version": ["1.0.0", "1.0.0-alpha"]
    }
  }
}
```
{% include copy-curl.html %}

### Wildcard query

Find versions matching a pattern:

```json
GET test_versions/_search
{
  "query": {
    "wildcard": {
      "version": "1.2.0-*"
    }
  }
}
```
{% include copy-curl.html %}

### Prefix query

Find versions with a specific prefix:

```json
GET test_versions/_search
{
  "query": {
    "prefix": {
      "version": {
        "value": "1.0.0-"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Sorting by version

To sort by version, provide the `sort` parameter in the request. Versions are sorted according to semantic versioning rules:

```json
GET test_versions/_search
{
  "query": { "match_all": {} },
  "sort": [
    { "version": { "order": "asc" } }
  ]
}
```
{% include copy-curl.html %}

This request returns documents sorted in version order, with pre-release versions appearing before their corresponding stable versions: `0.9.0`, `1.0.0-alpha`, `1.0.0-alpha.1`, `1.0.0-beta`, `1.0.0-rc.1`, `1.0.0+20230815`, `1.0.1`, `1.1.0`, `2.0.0`.

## Version comparison rules

The version field follows semantic versioning comparison rules:

1. `major`, `minor`, `patch`: Compared numerically (`1.2.3` < `1.2.4` < `1.3.0` < `2.0.0`)
2. Pre-release precedence: Pre-release versions have lower precedence than normal versions (`1.0.0-alpha` < `1.0.0`)
3. Pre-release comparison: When both versions are pre-releases, they are compared lexically by each dot-separated identifier (`1.0.0-alpha` < `1.0.0-alpha.1` < `1.0.0-beta`)
4. Build metadata ignored: Build metadata does not affect version precedence (`1.0.0+build.1` equals `1.0.0+build.2` for sorting purposes)

## Parameters

The version field type accepts the following optional parameters.

Parameter | Description
:--- | :---
`null_value` | A value to be substituted for any explicit `null` values. Must be a valid version string. Defaults to `null`, which means `null` fields are treated as missing.

### Example with null_value

```json
PUT software_with_nulls
{
  "mappings": {
    "properties": {
      "version": {
        "type": "version",
        "null_value": "0.0.0"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Limitations

- Version strings must follow the semantic versioning format. Invalid version strings will cause indexing to fail.
- Build metadata (part after `+`) is accepted but ignored during comparisons and sorting.
- The field does not support advanced version range specifications like `^1.2.3` or `~1.2.0`; use [`range` queries]({{site.url}}{{site.baseurl}}/query-dsl/term/range/) instead.
