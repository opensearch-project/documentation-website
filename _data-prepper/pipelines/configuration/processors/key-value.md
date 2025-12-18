---
layout: default
title: Key-value
parent: Processors
grand_parent: Pipelines
nav_order: 170
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/key-value/
---

# Key-value processor


You can use the `key_value` processor to parse the specified field into key-value pairs. You can customize the `key_value` processor to parse field information with the following options. The type for each of the following options is `string`.

## Examples

The following examples demonstrate several configurations you can use with this processor.

The examples don't use security and are for demonstration purposes only. We strongly recommend configuring SSL before using these examples in production.
{: .warning}

### Key-value parsing, normalization, and deduplication

The following example parses the `message` field into `key=value` pairs, normalizes and cleans the keys, prefixes them with `meta_`, deduplicates values, and drops keys without values into `parsed_kv`:

```yaml
kv-basic-pipeline:
  source:
    http:
      path: /logs
      ssl: false

  processor:
    - key_value:
        # Read key=value pairs from the "message" field (default anyway)
        source: message
        # Write parsed pairs into a nested object "parsed_kv"
        destination: parsed_kv

        # Split pairs on '&' and split key vs value on '='
        field_split_characters: "&"
        value_split_characters: "="

        # Normalize keys and trim garbage whitespace around keys/values
        transform_key: lowercase
        delete_key_regex: "\\s+"          # remove spaces from keys
        delete_value_regex: "^\\s+|\\s+$" # trim leading/trailing spaces

        # Add a prefix to every key (after normalization + delete_key_regex)
        prefix: meta_

        # Keep a single unique value for duplicate keys
        skip_duplicate_values: true

        # Drop keys whose value is empty/absent (e.g., `empty=` or `novalue`)
        drop_keys_with_no_value: true

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_password
        index_type: custom
        index: kv-basic-%{yyyy.MM.dd}
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -sS -X POST "http://localhost:2021/logs" \
  -H "Content-Type: application/json" \
  -d '[
    {"message":"key1=value1&key1=value1&Key Two = value two & empty=&novalue"},
    {"message":"ENV = prod & TEAM = core & owner = alice "}
  ]'
```
{% include copy.html %}

The documents stored in OpenSearch contain the following information:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "kv-basic-2025.10.14",
        "_id": "M6d84pkB3P3jd6EROH_f",
        "_score": 1,
        "_source": {
          "message": "key1=value1&key1=value1&Key Two = value two & empty=&novalue",
          "parsed_kv": {
            "meta_key1": "value1",
            "meta_empty": "",
            "meta_keytwo": "value two"
          }
        }
      },
      {
        "_index": "kv-basic-2025.10.14",
        "_id": "NKd84pkB3P3jd6EROH_f",
        "_score": 1,
        "_source": {
          "message": "ENV = prod & TEAM = core & owner = alice ",
          "parsed_kv": {
            "meta_owner": "alice",
            "meta_team": "core",
            "meta_env": "prod"
          }
        }
      }
    ]
  }
}
```

### Grouped values to root

The following example parses the `payload` field by using `&&` to separate pairs and `==` to separate keys and values. It preserves bracketed groups as single values, writes the parsed results to the event root without overwriting existing fields, and records any unmatched tokens as `null`:

```yaml
kv-grouping-pipeline:
  source:
    http:
      path: /logs
      ssl: false

  processor:
    - key_value:
        source: "payload"
        destination: null

        field_split_characters: "&&"     # pair delimiter (OK with grouping)
        value_split_characters: null     # disable the default "="
        key_value_delimiter_regex: "=="  # exact '==' for key/value

        value_grouping: true
        remove_brackets: false
        overwrite_if_destination_exists: false
        non_match_value: null

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: "admin_pass"
        index_type: custom
        index: "kv-regex-%{yyyy.MM.dd}"
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -sS -X POST "http://localhost:2021/logs" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "payload":"a==1&&b==[x=y,z=w]&&c==(inner=thing)&&http==http://example.com path",
      "a":"keep-me"
    },
    {
      "payload":"good==yes&&broken-token&&url==https://opensearch.org home",
      "note":"second doc"
    }
  ]'
```
{% include copy.html %}

The documents stored in OpenSearch contain the following information:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "kv-regex-2025.10.14",
        "_id": "FuCX4pkB344hN2Iu62oT",
        "_score": 1,
        "_source": {
          "payload": "a==1&&b==[x=y,z=w]&&c==(inner=thing)&&http==http://example.com path",
          "a": "keep-me",
          "b": "[x=y,z=w]",
          "c": "(inner=thing)",
          "http": "http://example.com path"
        }
      },
      {
        "_index": "kv-regex-2025.10.14",
        "_id": "F-CX4pkB344hN2Iu62oT",
        "_score": 1,
        "_source": {
          "payload": "good==yes&&broken-token&&url==https://opensearch.org home",
          "note": "second doc",
          "broken-token": null,
          "good": "yes",
          "url": "https://opensearch.org home"
        }
      }
    ]
  }
}
```

### Conditional recursive key-value parsing

The following example parses bracketed nested `key=value` structures from `body` into `parsed.*` only when `/type == "nested"`. It preserves group hierarchy, enforces strict nesting rules, applies default fields, and leaves non-nested events unchanged:

```yaml
kv-conditional-recursive-pipeline:
  source:
    http:
      path: /logs
      ssl: false

  processor:
    - key_value:
        source: "body"
        destination: "parsed"

        key_value_when: '/type == "nested"'
        recursive: true

        # Split rules (per docs; not regex)
        field_split_characters: "&"
        value_split_characters: "="

        # Grouping & quoting (per docs)
        value_grouping: true
        string_literal_character: "\""
        remove_brackets: false

        # Keep only some top-level keys; then set defaults
        include_keys: ["item1","item2","owner"]
        default_values:
          owner: "unknown"
          region: "eu-west-1"

        strict_grouping: true
        tags_on_failure: ["keyvalueprocessor_failure"]

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: "admin_pass"
        index_type: custom
        index: "kv-recursive-%{yyyy.MM.dd}"
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -sS -X POST "http://localhost:2021/logs" \
  -H "Content-Type: application/json" \
  -d '[
  {
    "type":"nested","body":"item1=[a=1&b=(c=3&d=<e=5>)]&item2=2&owner=alice"
  },
  {
    "type":"flat","body":"item1=[should=not&be=parsed]&item2=42"
  },
  {
    "type":"nested","body":"item1=[desc=\"a=b + c=d\"&x=1]&item2=2"
  }
]'
```
{% include copy.html %}

The documents stored in OpenSearch contain the following information:

```json
{
  ...
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "kv-recursive-2025.10.14",
        "_id": "Q7fC4pkBc0UY8I7pZ6vZ",
        "_score": 1,
        "_source": {
          "type": "nested",
          "body": "item1=[a=1&b=(c=3&d=<e=5>)]&item2=2&owner=alice",
          "parsed": {
            "owner": "alice",
            "item2": "2",
            "item1": {
              "a": "1",
              "b": {
                "c": "3",
                "d": {
                  "e": "5"
                }
              }
            },
            "region": "eu-west-1"
          }
        }
      },
      {
        "_index": "kv-recursive-2025.10.14",
        "_id": "RLfC4pkBc0UY8I7pZ6vZ",
        "_score": 1,
        "_source": {
          "type": "flat",
          "body": "item1=[should=not&be=parsed]&item2=42"
        }
      },
      {
        "_index": "kv-recursive-2025.10.14",
        "_id": "RbfC4pkBc0UY8I7pZ6vZ",
        "_score": 1,
        "_source": {
          "type": "nested",
          "body": """item1=[desc="a=b + c=d"&x=1]&item2=2""",
          "parsed": {
            "owner": "unknown",
            "item2": "2",
            "item1": {
              "desc": "\"a=b + c=d\"",
              "x": "1"
            },
            "region": "eu-west-1"
          }
        }
      }
    ]
  }
}
```

## Configuration

Option | Description | Example 
:--- | :--- | :--- 
`source` | The message field to be parsed. Optional. Default value is `message`. | If `source` is `"message1"`, `{"message1": {"key1=value1"}, "message2": {"key2=value2"}}` parses into `{"message1": {"key1=value1"}, "message2": {"key2=value2"}, "parsed_message": {"key1": "value1"}}`. 
destination | The destination field for the parsed source. The parsed source overwrites the preexisting data for that key. Optional. If `destination` is set to `null`, the parsed fields will be written to the root of the event. Default value is `parsed_message`. | If `destination` is `"parsed_data"`, `{"message": {"key1=value1"}}` parses into `{"message": {"key1=value1"}, "parsed_data": {"key1": "value1"}}`. 
`field_delimiter_regex` | A regular expression specifying the delimiter that separates key-value pairs. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be defined at the same time as `field_split_characters`. Optional. If this option is not defined, `field_split_characters` is used. | If `field_delimiter_regex` is `"&\\{2\\}"`, `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. 
`field_split_characters` | A string of characters specifying the delimeter that separates key-value pairs. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be defined at the same time as `field_delimiter_regex`. Optional. Default value is `&`. | If `field_split_characters` is `"&&"`, `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. 
`key_value_delimiter_regex` | A regular expression specifying the delimiter that separates the key and value within a key-value pair. Special regular expression characters such as `[` and `]` must be escaped with `\\`. This option cannot be defined at the same time as `value_split_characters`. Optional. If this option is not defined, `value_split_characters` is used.  | If `key_value_delimiter_regex` is `"=\\{2\\}"`, `{"key1==value1"}` parses into `{"key1": "value1"}`. 
`value_split_characters` | A string of characters specifying the delimiter that separates the key and value within a key-value pair. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be defined at the same time as `key_value_delimiter_regex`. Optional. Default value is `=`. | If `value_split_characters` is `"=="`, `{"key1==value1"}` parses into `{"key1": "value1"}`. 
`non_match_value` | When a key-value pair cannot be successfully split, the key-value pair is placed in the `key` field, and the specified value is placed in the `value` field. Optional. Default value is `null`. | `key1value1&key2=value2` parses into `{"key1value1": null, "key2": "value2"}`. |
`prefix` | A prefix to append before all keys. Optional. Default value is an empty string. | If `prefix` is `"custom"`, `{"key1=value1"}` parses into `{"customkey1": "value1"}`. 
`delete_key_regex` | A regular expression specifying the characters to delete from the key. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be an empty string. Optional. No default value. | If `delete_key_regex` is `"\s"`, `{"key1 =value1"}` parses into `{"key1": "value1"}`. 
`delete_value_regex` | A regular expression specifying the characters to delete from the value. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be an empty string. Optional. No default value. | If `delete_value_regex` is `"\s"`, `{"key1=value1 "}` parses into `{"key1": "value1"}`. 
`include_keys` | An array specifying the keys that should be added for parsing. By default, all keys will be added. | If `include_keys` is `["key2"]`,`key1=value1&key2=value2` will parse into `{"key2": "value2"}`. 
`exclude_keys` | An array specifying the parsed keys that should not be added to the event. By default, no keys will be excluded. | If `exclude_keys` is `["key2"]`, `key1=value1&key2=value2` will parse into `{"key1": "value1"}`. 
`default_values` | A map specifying the default keys and their values that should be added to the event in case these keys do not exist in the source field being parsed. If the default key already exists in the message, the value is not changed. The `include_keys` filter will be applied to the message before `default_values`. | If `default_values` is `{"defaultkey": "defaultvalue"}`, `key1=value1` will parse into `{"key1": "value1", "defaultkey": "defaultvalue"}`. <br /> If `default_values` is `{"key1": "abc"}`, `key1=value1` will parse into `{"key1": "value1"}`. <br /> If `include_keys` is `["key1"]` and `default_values` is `{"key2": "value2"}`, `key1=value1&key2=abc` will parse into `{"key1": "value1", "key2": "value2"}`. 
`transform_key` | When to lowercase, uppercase, or capitalize keys. | If `transform_key` is `lowercase`, `{"Key1=value1"}` will parse into `{"key1": "value1"}`. <br /> If `transform_key` is `uppercase`, `{"key1=value1"}` will parse into `{"KEY1": "value1"}`. <br /> If `transform_key` is `capitalize`, `{"key1=value1"}` will parse into `{"Key1": "value1"}`. 
`whitespace` | Specifies whether to be lenient or strict with the acceptance of unnecessary white space surrounding the configured value-split sequence. Default is `lenient`. | If `whitespace` is `"lenient"`, `{"key1  =  value1"}` will parse into `{"key1  ": "  value1"}`. If `whitespace` is `"strict"`, `{"key1  =  value1"}` will parse into `{"key1": "value1"}`. 
`skip_duplicate_values` | A Boolean option for removing duplicate key-value pairs. When set to `true`, only one unique key-value pair will be preserved. Default is `false`. | If `skip_duplicate_values` is `false`, `{"key1=value1&key1=value1"}` will parse into `{"key1": ["value1", "value1"]}`. If  `skip_duplicate_values` is `true`, `{"key1=value1&key1=value1"}` will parse into `{"key1": "value1"}`. 
`remove_brackets` | Specifies whether to treat square brackets, angle brackets, and parentheses as value "wrappers" that should be removed from the value. Default is `false`. | If `remove_brackets` is `true`, `{"key1=(value1)"}` will parse into `{"key1": value1}`. If `remove_brackets` is `false`, `{"key1=(value1)"}` will parse into `{"key1": "(value1)"}`. 
`recursive` | Specifies whether to recursively obtain additional key-value pairs from values. The extra key-value pairs will be stored as sub-keys of the root key. Default is `false`. The levels of recursive parsing must be defined by different brackets for each level: `[]`, `()`, and `<>`, in this order. Any other configurations specified will only be applied to the outmost keys. <br />When `recursive` is `true`: <br /> `remove_brackets` cannot also be `true`;<br />`skip_duplicate_values` will always be `true`; <br />`whitespace` will always be `"strict"`. | If `recursive` is true, `{"item1=[item1-subitem1=item1-subitem1-value&item1-subitem2=(item1-subitem2-subitem2A=item1-subitem2-subitem2A-value&item1-subitem2-subitem2B=item1-subitem2-subitem2B-value)]&item2=item2-value"}` will parse into `{"item1": {"item1-subitem1": "item1-subitem1-value", "item1-subitem2" {"item1-subitem2-subitem2A": "item1-subitem2-subitem2A-value", "item1-subitem2-subitem2B": "item1-subitem2-subitem2B-value"}}}`. 
`overwrite_if_destination_exists` | Specifies whether to overwrite existing fields if there are key conflicts when writing parsed fields to the event. Default is `true`. | If `overwrite_if_destination_exists` is `true` and destination is `null`, `{"key1": "old_value", "message": "key1=new_value"}` will parse into `{"key1": "new_value", "message": "key1=new_value"}`. 
`tags_on_failure` | When a `kv` operation causes a runtime exception within the processor, the operation is safely stopped without crashing the processor, and the event is tagged with the provided tags. | If `tags_on_failure` is set to `["keyvalueprocessor_failure"]`, `{"tags": ["keyvalueprocessor_failure"]}` will be added to the event's metadata in the event of a runtime exception. 
`value_grouping` | Specifies whether to group values using predefined value grouping delimiters: `{...}`, `[...]', `<...>`, `(...)`, `"..."`, `'...'`, `http://... (space)`, and `https:// (space)`. If this flag is enabled, then the content between the delimiters is considered to be one entity and is not parsed for key-value pairs. Default is `false`. If `value_grouping` is `true`, then `{"key1=[a=b,c=d]&key2=value2"}` parses to `{"key1": "[a=b,c=d]", "key2": "value2"}`. 
`drop_keys_with_no_value` | Specifies whether keys should be dropped if they have a null value. Default is `false`. If `drop_keys_with_no_value` is set to `true`, then `{"key1=value1&key2"}` parses to `{"key1": "value1"}`. 
`strict_grouping` | Specifies whether strict grouping should be enabled when the `value_grouping` or `string_literal_character` options are used. Default is `false`. | When enabled, groups with unmatched end characters yield errors. The event is ignored after the errors are logged. 
`string_literal_character` | Can be set to either a single quotation mark (`'`) or a double quotation mark (`"`). Default is `null`. | When this option is used, any text contained within the specified quotation mark character will be ignored and excluded from key-value parsing. For example, `text1 "key1=value1" text2 key2=value2` would parse to `{"key2": "value2"}`. 
`key_value_when` | Allows you to specify a [conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"`, that will be evaluated to determine whether the processor should be applied to the event. 


