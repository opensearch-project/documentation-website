---
layout: default
title: Generating data using index mappings
nav_order: 15
parent: Synthetic data generation
grand_parent: Additional features
---

# Generating data using index mappings

You can use OpenSearch index mappings to generate synthetic data. This approach offers a balance between automation and customization. 

To use this method, save your OpenSearch index mappings to a JSON file:

```json
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "description": {
        "type": "text"
      },
      "price": {
        "type": "float"
      },
      "created_at": {
        "type": "date",
        "format": "strict_date_optional_time||epoch_millis"
      },
      "is_available": {
        "type": "boolean"
      },
      "category_id": {
        "type": "integer"
      },
      "tags": {
        "type": "keyword"
      }
    }
  },
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
```

OpenSearch Benchmark works with any valid index mappings, regardless of complexity. You can provide more complex mappings similar to the following:

<details markdown="block">
  <summary>
    Mappings
  </summary>
  {: .text-delta}

```json
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "user": {
        "type": "object",
        "properties": {
          "id": {
            "type": "keyword"
          },
          "email": {
            "type": "keyword"
          },
          "name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              },
              "completion": {
                "type": "completion"
              }
            },
            "analyzer": "standard"
          },
          "address": {
            "type": "object",
            "properties": {
              "street": {
                "type": "text"
              },
              "city": {
                "type": "keyword"
              },
              "state": {
                "type": "keyword"
              },
              "zip": {
                "type": "keyword"
              },
              "location": {
                "type": "geo_point"
              }
            }
          },
          "preferences": {
            "type": "object",
            "dynamic": true
          }
        }
      },
      "orders": {
        "type": "nested",
        "properties": {
          "id": {
            "type": "keyword"
          },
          "date": {
            "type": "date",
            "format": "strict_date_optional_time||epoch_millis"
          },
          "amount": {
            "type": "scaled_float",
            "scaling_factor": 100
          },
          "status": {
            "type": "keyword"
          },
          "items": {
            "type": "nested",
            "properties": {
              "product_id": {
                "type": "keyword"
              },
              "name": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword"
                  }
                }
              },
              "quantity": {
                "type": "short"
              },
              "price": {
                "type": "float"
              },
              "categories": {
                "type": "keyword"
              }
            }
          },
          "shipping_address": {
            "type": "object",
            "properties": {
              "street": {
                "type": "text"
              },
              "city": {
                "type": "keyword"
              },
              "state": {
                "type": "keyword"
              },
              "zip": {
                "type": "keyword"
              },
              "location": {
                "type": "geo_point"
              }
            }
          }
        }
      },
      "activity_log": {
        "type": "nested",
        "properties": {
          "timestamp": {
            "type": "date"
          },
          "action": {
            "type": "keyword"
          },
          "ip_address": {
            "type": "ip"
          },
          "details": {
            "type": "object",
            "enabled": false
          }
        }
      },
      "metadata": {
        "type": "object",
        "properties": {
          "created_at": {
            "type": "date"
          },
          "updated_at": {
            "type": "date"
          },
          "tags": {
            "type": "keyword"
          },
          "source": {
            "type": "keyword"
          },
          "version": {
            "type": "integer"
          }
        }
      },
      "description": {
        "type": "text",
        "analyzer": "english",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          },
          "standard": {
            "type": "text",
            "analyzer": "standard"
          }
        }
      },
      "ranking_scores": {
        "type": "object",
        "properties": {
          "popularity": {
            "type": "float"
          },
          "relevance": {
            "type": "float"
          },
          "quality": {
            "type": "float"
          }
        }
      },
      "permissions": {
        "type": "nested",
        "properties": {
          "user_id": {
            "type": "keyword"
          },
          "role": {
            "type": "keyword"
          },
          "granted_at": {
            "type": "date"
          }
        }
      }
    }
  },
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2,
    "analysis": {
      "analyzer": {
        "email_analyzer": {
          "type": "custom",
          "tokenizer": "uax_url_email",
          "filter": ["lowercase", "stop"]
        }
      }
    }
  }
}
```

</details>

## Generating data

To generate synthetic data using index mappings, use the `generate-data` subcommand and provide the required index mappings file, index name, output path, and total amount of data to generate:

```shell
osb generate-data --index-name <NAME_OF_DATA_CORPORA> --index-mappings <PATH_TO_INDEX_MAPPINGS> --output-path <DESIRED_OUTPUT_PATH> --total-size <TOTAL_SIZE_OF_DATA_CORPORA_GENERATED_IN_GB>
```
{% include copy.html %}

For a complete list of available parameters and their descriptions, see the [`generate-data` command reference]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/generate-data/).

## Example output

The following is an example output of generating 100 GB of data:

```
   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/


[NOTE] ✨ Dashboard link to monitor processes and task streams: [http://127.0.0.1:8787/status]
[NOTE] ✨ For users who are running generation on a virtual machine, consider SSH port forwarding (tunneling) to localhost to view dashboard.
[NOTE] Example of localhost command for SSH port forwarding (tunneling) from an AWS EC2 instance:
ssh -i <PEM_FILEPATH> -N -L localhost:8787:localhost:8787 ec2-user@<DNS>

Total GB to generate: [1]
Average document size in bytes: [412]
Max file size in GB: [40]

100%|███████████████████████████████████████████████████████████████████| 100.07G/100.07G [3:35:29<00:00, 3.98MB/s]

Generated 24271844660 docs in 12000 seconds. Total dataset size is 100.21GB.
✅ Visit the following path to view synthetically generated data: /home/ec2-user/

-----------------------------------
[INFO] ✅ SUCCESS (took 272 seconds)
-----------------------------------
```

## Advanced configuration

You can control how synthetic data is generated by creating a YAML configuration file. The following is an example configuration file that defines custom rules in the `MappingGenerationValues` parameter:

```yml
MappingGenerationValues:
  # For users who want more granular control over how data is generated when providing an OpenSearch mapping
  generator_overrides:
    # Overrides all instances of generators with these settings. Specify type and params
    integer:
      min: 0
      max: 20
    long:
      min: 0
      max: 1000
    float:
      min: 0.0
      max: 1.0
    double:
      min: 0.0
      max: 2000.0
    date:
      start_date: "2020-01-01"
      end_date: "2023-01-01"
      format: "yyyy-mm-dd"
    text:
      must_include: ["lorem", "ipsum"]
    keyword:
      choices: ["alpha", "beta", "gamma"]

  field_overrides:
    # Specify field name as key of dict. For its values, specify generator and its params. Params must adhere to existing params for each generator
    # For nested fields, use dot notation: Example preferences.allergies if allergies is a subfield of preferences object
    title:
      generator: generate_keyword
      params:
        choices: ["Helly R", "Mark S", "Irving B"]

    promo_codes:
      generator: generate_keyword
      params:
        choices: ["HOT_SUMMER", "TREATSYUM!"]

    # Nested fields, use dot notation
    orders.items.product_id:
      generator: generate_keyword
      params:
        choices: ["Python", "English"]
```
{% include copy.html %}

`MappingGenerationValues` supports the following parameters.

| Parameter | Description |
|---|---|
| `generator_overrides` | Defines custom generator rules for specific OpenSearch field types. Any field that uses the corresponding type will follow these rules. See [Generator overrides parameters](#generator-overrides-parameters). |
| `field_overrides` | Defines generator rules for individual fields by field name. These apply only to the fields explicitly listed. For nested fields, use dot notation (for example, `orders.items.product_id`). See [Field overrides parameters](#field-overrides-parameters). |

If both `generator_overrides` and `field_overrides` are present, `field_overrides` take precedence.
{: .important}

#### Generator overrides parameters

The following parameters are available for each OpenSearch field type in `generator_overrides`.

| Field type | Parameters |
|---|---|
| `integer`, `long`, `short`, `byte` | `min`, `max` |
| `float`, `double` | `min`, `max`, `round` (the number of decimal places to round to) |
| `date` | `start_date`, `end_date`, `format` |
| `text` | `must_include` (array of terms to include in generated text) |
| `keyword` | `choices` (array of keywords to randomly select from) |

#### Field overrides parameters

The following generators and their parameters are available for use in `field_overrides`.

| Generator | Parameters |
|---|---|
| `generate_text` | `must_include` (array of terms to include in generated text) |
| `generate_keyword` | `choices` (array of keywords to randomly select from) |
| `generate_integer` | `min`, `max` |
| `generate_long` | `min`, `max` |
| `generate_short` | `min`, `max` |
| `generate_byte` | `min`, `max` |
| `generate_float` | `min`, `max`, `round` (the number of decimal places to round to) |
| `generate_double` | `min`, `max` |
| `generate_boolean` | N/A|
| `generate_date` | `format`, `start_date`, `end_date` |
| `generate_ip` | N/A|
| `generate_geo_point` | N/A|
| `generate_knn_vector` | `dimension`, `sample_vectors`, `noise_factor`, `distribution_type`, `normalize`. See [Advanced techniques](/benchmark/features/synthetic-data-generation/advanced/). |
| `generate_sparse_vector` | `num_tokens`, `min_weight`, `max_weight`, `token_id_start`, `token_id_step`. See [Advanced techniques](/benchmark/features/synthetic-data-generation/advanced/). |

### Using the configuration

To use your configuration file, provide its full path in the `--custom-config` parameter:

```shell
osb generate-data --index-name <NAME_OF_DATA_CORPORA> --index-mappings <PATH_TO_INDEX_MAPPINGS> --output-path <DESIRED_OUTPUT_PATH> --total-size <TOTAL_SIZE_OF_DATA_CORPORA_GENERATED_IN_GB> --custom-config ~/Desktop/sdg-config.yml
```
{% include copy.html %}

## Related documentation

- [`generate-data` command reference]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/generate-data/)
- [Generating data using custom logic]({{site.url}}{{site.baseurl}}/benchmark/features/synthetic-data-generation/custom-logic-sdg/)