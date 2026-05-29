---
layout: default
title: Hunspell
parent: Token filters
nav_order: 160
---

# Hunspell token filter

The `hunspell` token filter is used for stemming and morphological analysis of words in a specific language. This filter applies Hunspell dictionaries, which are widely used in spell checkers. It works by breaking down words into their root forms (stemming).

The Hunspell dictionary files are automatically loaded at startup from the `<OS_PATH_CONF>/hunspell/<locale>` directory. For example, the `en_GB` locale must have at least one `.aff` file and one or more `.dic` files in the `<OS_PATH_CONF>/hunspell/en_GB/` directory. 

Alternatively, you can load dictionaries from a custom directory by using the `ref_path` parameter to maintain multiple independent dictionary sets for the same locale. For more information, see [Custom dictionary loading with ref_path](#custom-dictionary-loading-with-ref_path).

You can also hot-reload Hunspell dictionaries at runtime without restarting the node. For more information, see [Hot-reloading Hunspell dictionaries](#hot-reloading-hunspell-dictionaries).

You can download these files from [LibreOffice dictionaries](https://github.com/LibreOffice/dictionaries).

## Parameters

The `hunspell` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`language/lang/locale` | At least one of the three is required | String | Specifies the language for the Hunspell dictionary. Can contain only alphanumeric characters, hyphens, and underscores (for example, `en_US`, `de_DE`).
`ref_path` | Optional | String | Specifies a relative path used to load dictionaries from the `<OS_PATH_CONF>/<ref_path>/hunspell/<locale>/` directory instead of the default `<OS_PATH_CONF>/hunspell/<locale>/` directory. When specified, the `locale` parameter is required. The `ref_path` value can contain alphanumeric characters, hyphens, underscores, and forward slashes (for nested paths such as `analyzers/my-dict`). The `locale` value can contain only alphanumeric characters, hyphens, and underscores. See [Custom dictionary loading with ref_path](#custom-dictionary-loading-with-ref_path). **Note**: Starting in OpenSearch 3.7, `ref_path` resolves directly under `<OS_PATH_CONF>`. In earlier versions (3.6), it resolved under `<OS_PATH_CONF>/analyzers/`. To preserve the previous layout, prefix your `ref_path` value with `analyzers/` (for example, `analyzers/my-dict`).
`dedup` | Optional | Boolean | Determines whether to remove multiple duplicate stemming terms for the same token. Default is `true`.
`dictionary` | Optional | Array of strings | Configures the dictionary files to be used for the Hunspell dictionary. Default is all files in the `<OS_PATH_CONF>/hunspell/<locale>` directory if `ref_path` is not specified or all files in the `<OS_PATH_CONF>/<ref_path>/hunspell/<locale>/` directory when `ref_path` is specified. See [Custom dictionary loading with ref_path](#custom-dictionary-loading-with-ref_path).
`longest_only` | Optional | Boolean | Specifies whether only the longest stemmed version of the token should be returned. Default is `false`.
`updateable` | Optional | Boolean | When set to `true`, the filter operates in search-time analysis mode, allowing dictionaries to be hot-reloaded by using the [Refresh search analyzer]({{site.url}}{{site.baseurl}}/im-plugin/refresh-analyzer/) API without restarting the node. Default is `false`. **Introduced 3.7.**

## Example

The following example request creates a new index named `my_index` and configures an analyzer with a `hunspell` filter:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_hunspell_filter": {
          "type": "hunspell",
          "lang": "en_GB",
          "dedup": true,
          "longest_only": true
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_hunspell_filter"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Custom dictionary loading with ref_path

When you specify a `ref_path` parameter, dictionaries are loaded from a custom directory instead of the default directory. This is useful when you need multiple independent dictionary sets for the same locale, for example, when different indexes require different custom dictionaries.

Starting in OpenSearch 3.7, `ref_path` is resolved relative to `<OS_PATH_CONF>` and can contain forward slashes for nested paths. In OpenSearch 3.6, `ref_path` was resolved relative to `<OS_PATH_CONF>/analyzers/`. To preserve the previous directory layout when upgrading from 3.6, prefix your existing `ref_path` value with `analyzers/`.
{: .note}

Place dictionary files in the following directory structure:

```xml
<OS_PATH_CONF>/<ref_path>/hunspell/<locale>/
├── <locale>.aff       (exactly one .aff file required)
├── <locale>.dic       (one or more .dic files)
└── <locale>_custom.dic
```

The following example loads a Hunspell dictionary from `<OS_PATH_CONF>/analyzers/my-dict/hunspell/en_US/`:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_custom_hunspell": {
          "type": "hunspell",
          "ref_path": "analyzers/my-dict",
          "locale": "en_US"
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_custom_hunspell"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Multiple indexes can use different `ref_path` directories configured for the same locale. Each `ref_path` maintains its own independent dictionary cache:

```json
PUT /index_medical
{
  "settings": {
    "analysis": {
      "filter": {
        "medical_hunspell": {
          "type": "hunspell",
          "ref_path": "analyzers/medical-dict",
          "locale": "en_US"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /index_legal
{
  "settings": {
    "analysis": {
      "filter": {
        "legal_hunspell": {
          "type": "hunspell",
          "ref_path": "analyzers/legal-dict",
          "locale": "en_US"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Hot-reloading Hunspell dictionaries

**Introduced 3.7**
{: .label .label-purple }

You can update Hunspell dictionaries at runtime without restarting the node by setting the `updateable` parameter to `true` on the filter and then calling the [Refresh search analyzer]({{site.url}}{{site.baseurl}}/im-plugin/refresh-analyzer/) API with the `reload_cached_resources` query parameter.

When `updateable` is `true`, the filter is registered in search-time analysis mode, which allows in-place reloading of cached dictionary resources. The filter can then only be used at search time (for example, in a `search_analyzer`), not at index time.

The hot-reload workflow is as follows:

1. Replace the `.aff` and `.dic` files on disk on every node that holds a shard for the index.
2. Send a request to the Refresh search analyzer API with `reload_cached_resources=true`:

   ```json
   POST /_plugins/_refresh_search_analyzers/<index or alias or wildcard>?reload_cached_resources=true
   ```
   {% include copy-curl.html %}

When `reload_cached_resources` is `false` (the default), the API rebuilds analyzer factories but reuses the previously cached Hunspell dictionary. Set the parameter to `true` to force the dictionary to be reloaded from disk.

The following example creates an index that uses a hot-reloadable Hunspell filter as a `search_analyzer`:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_reloadable_hunspell": {
          "type": "hunspell",
          "ref_path": "analyzers/my-dict",
          "locale": "en_US",
          "updateable": true
        }
      },
      "analyzer": {
        "my_search_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_reloadable_hunspell"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "standard",
        "search_analyzer": "my_search_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information about the Refresh search analyzer API, see [Refresh search analyzer]({{site.url}}{{site.baseurl}}/im-plugin/refresh-analyzer/).

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /my_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "the turtle moves slowly"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "the",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "turtle",
      "start_offset": 4,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "move",
      "start_offset": 11,
      "end_offset": 16,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "slow",
      "start_offset": 17,
      "end_offset": 23,
      "type": "<ALPHANUM>",
      "position": 3
    }
  ]
}
```
