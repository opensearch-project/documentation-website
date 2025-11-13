---
layout: default
title: Mapping Approach
nav_order: 15
parent: Synthetic Data Generation
grand_parent: Features
---

# Generating Data with OpenSearch Index Mappings

To invoke synthetic data generation, you'll need to provide either one of the two required input files:
* OpenSearch index mappings
* Custom logic (via Python module)

This document explores using OpenSearch index mappings to generate synthetic data.

### Prerequisites

* **Required**: OpenSearch Index Mapping
* **Optional**: Synthetic Data Generation Config

### Overview
This approach offers a balance between automation and customization. Synthetic data generation in OpenSearch Benchmark can use basic OpenSearch index mappings like this:

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

or complex OpenSearch index mappings like this:

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

In the next section, we'll use the example index mappings (or your own) to generate synthetic documents.

## Command Parameters
A basic command that activates synthetic data generation with an OpenSearch index mapping:
```shell
osb generate-data --index-name <NAME OF DATA CORPORA> --index-mappings <PATH TO INDEX MAPPINGS> --output-path <DESIRED OUTPUT PATH> --total-size <TOTAL SIZE OF DATA CORPORA GENERATED IN GB>
```
* `generate-data` (required): sub-command that activates synthetic data generation in OpenSearch Benchmark
* `--index-mappings` or `-i` (required): Path to OpenSearch index mappings
* `--index-name` or `-n` (required): Name of data corpora generated
* `--output-path` or `-p` (required): Path where data should be generated in
* `--total-size` or `-s` (required): Total amount of data that should be generated in GB
* `--custom-config` or `-c` (optional): Path to YAML config defining rules for how data should be generated. This is further explored in the subsequent section
* `--test-document` or `-t` (optional): When flag is present, OSB generates a single synthetic document and outputs to the console. Provides users a way to verify that the example document generated is aligned with expectations. When the flag is not present, the entire data corpora will be generated

### Example Output

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
ssh -i <PEM filepath> -N -L localhost:8787:localhost:8787 ec2-user@<DNS>

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
This is an example output of what it might look like if you generated 100GB.

## Using synthetic data generation config

Users can have more control over how data is generated with the help of the synthetic data generation config. When generating synthetic data with an OpenSearch index mappings, the synthetic data generation config should have *MappingGenerationValues* defined and either *generator_overrides*, *field_overrides*, or both defined.

* **MappingGenerationValues** → When synthetic data generator is using OpenSearch index mappings to generate synthetic data, it looks for this section for additional instructions
* **generator_overrides** → For each type of generator defined in this section, the synthetic data generator uses these rules to generate synthetic data for that OpenSearch mapping field type.
* **field_overrides** → For each field defined, the synthetic data generator uses these rules to generate synthetic data for that specific field

If both generator_overrides and field_overrides are defined, field_overrides have a higher precedence than generator_overrides.
{: .important}

### Example sdg-config.yml

Example of MappingGenerationValues defined:
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

To use this synthetic data generation config, append the following parameter and path to the YAML config to the `generate-data` command:

```shell
--custom-config ~/Desktop/sdg-config.yml
```

OpenSearch Benchmark should now be generating synthetic data with these rules in mind.
