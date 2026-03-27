---
layout: default
title: Hunspell
parent: Token filters
nav_order: 160
---

# Hunspell token filter

The `hunspell` token filter is used for stemming and morphological analysis of words in a specific language. This filter applies Hunspell dictionaries, which are widely used in spell checkers. It works by breaking down words into their root forms (stemming).

The Hunspell dictionary files are automatically loaded at startup from the `<OS_PATH_CONF>/hunspell/<locale>` directory. For example, the `en_GB` locale must have at least one `.aff` file and one or more `.dic` files in the `<OS_PATH_CONF>/hunspell/en_GB/` directory.

Alternatively, dictionaries can be loaded from a package-based directory using the `ref_path` parameter. When `ref_path` is specified, dictionaries are loaded from `<OS_PATH_CONF>/analyzers/<ref_path>/hunspell/<locale>/`. This enables multiple independent dictionary sets for the same locale, allowing different indexes to use different dictionaries without conflicts. When `ref_path` is not specified, the filter falls back to the traditional loading behavior from `<OS_PATH_CONF>/hunspell/<locale>/`.

You can download these files from [LibreOffice dictionaries](https://github.com/LibreOffice/dictionaries).

## Parameters

The `hunspell` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`language/lang/locale` | At least one of the three is required | String | Specifies the language for the Hunspell dictionary. Only alphanumeric characters, hyphens, and underscores are allowed (for example, `en_US`, `de_DE`).
`ref_path` | Optional | String | Specifies a package identifier for loading dictionaries from `<OS_PATH_CONF>/analyzers/<ref_path>/hunspell/<locale>/` instead of the default `<OS_PATH_CONF>/hunspell/<locale>/` directory. When specified, the `locale` parameter is required. Both `ref_path` and `locale` only allow alphanumeric characters, hyphens, and underscores.
`dedup` | Optional | Boolean | Determines whether to remove multiple duplicate stemming terms for the same token. Default is `true`.
`dictionary` | Optional | Array of strings | Configures the dictionary files to be used for the Hunspell dictionary. Default is all files in the `<OS_PATH_CONF>/hunspell/<locale>` directory, or `<OS_PATH_CONF>/analyzers/<ref_path>/hunspell/<locale>/` when `ref_path` is specified.
`longest_only` | Optional | Boolean | Specifies whether only the longest stemmed version of the token should be returned. Default is `false`.

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

## Package-based dictionary loading

When using `ref_path`, dictionaries are loaded from a package-specific directory instead of the default hunspell directory. This is useful when you need multiple independent dictionary sets for the same locale, for example, when different indexes require different custom dictionaries.

Place dictionary files in the following directory structure:

```
<OS_PATH_CONF>/analyzers/<ref_path>/hunspell/<locale>/
├── <locale>.aff       (exactly one .aff file required)
├── <locale>.dic       (one or more .dic files)
└── <locale>_custom.dic
```

The following example loads a hunspell dictionary from the package directory `<OS_PATH_CONF>/analyzers/pkg-1234/hunspell/en_US/`:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_custom_hunspell": {
          "type": "hunspell",
          "ref_path": "pkg-1234",
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

Multiple indexes can use different packages with the same locale. Each package maintains its own independent dictionary cache:

```json
PUT /index_medical
{
  "settings": {
    "analysis": {
      "filter": {
        "medical_hunspell": {
          "type": "hunspell",
          "ref_path": "medical-dict",
          "locale": "en_US"
        }
      }
    }
  }
}
```

```json
PUT /index_legal
{
  "settings": {
    "analysis": {
      "filter": {
        "legal_hunspell": {
          "type": "hunspell",
          "ref_path": "legal-dict",
          "locale": "en_US"
        }
      }
    }
  }
}
```

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
