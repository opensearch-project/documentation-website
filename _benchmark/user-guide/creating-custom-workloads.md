---
layout: default
title: Creating custom workloads
nav_order: 10
parent: User guide
redirect_from: /benchmark/creating-custom-workloads/
---

# Creating custom workloads

OpenSearch Benchmark includes a set of [workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) that you can use to benchmark data from your cluster. Additionally, if you want to create a workload that is tailored to your own data, you can create a custom workload using one of the following options:

- [Creating custom workloads](#creating-custom-workloads)
  - [Creating a workload from an existing cluster](#creating-a-workload-from-an-existing-cluster)
    - [Prerequisites](#prerequisites)
    - [Customizing the workload](#customizing-the-workload)
    - [Creating a workload without an existing cluster](#creating-a-workload-without-an-existing-cluster)
  - [Invoking your custom workload](#invoking-your-custom-workload)
  - [Advanced options](#advanced-options)
    - [Test mode](#test-mode)
    - [Adding variance to test procedures](#adding-variance-to-test-procedures)
    - [Separate operations and test procedures](#separate-operations-and-test-procedures)
  - [Next steps](#next-steps)

## Creating a workload from an existing cluster

If you already have an OpenSearch cluster with indexed data, use the following steps to create a custom workload for your cluster.

### Prerequisites

Before creating a custom workload, make sure you have the following prerequisites:

- An OpenSearch cluster with an index that contains 1000 or more documents. If your cluster's index does not contain at least 1000 documents, the workload can still run tests, however, you cannot run workloads using `--test-mode`.
- You must have the correct permissions to access your OpenSearch cluster. For more information about cluster permissions, see [Permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/).

### Customizing the workload

To begin creating a custom workload, use the `opensearch-benchmark create-workload` command.

```
opensearch-benchmark create-workload \
--workload="<WORKLOAD NAME>" \
--target-hosts="<CLUSTER ENDPOINT>" \
--client-options="basic_auth_user:'<USERNAME>',basic_auth_password:'<PASSWORD>'" \
--indices="<INDEXES TO GENERATE WORKLOAD FROM>" \
--output-path="<LOCAL DIRECTORY PATH TO STORE WORKLOAD>"
```

Replace the following options in the preceding example with information specific to your existing cluster:

- `--workload`: A custom name for your custom workload.
- `--target-hosts:` A comma-separated list of host:port pairs from which the cluster extracts data.
- `--client-options`: The basic authentication client options that OpenSearch Benchmark uses to access the cluster.
- `--indices`: One or more indexes inside your OpenSearch cluster that contain data.
- `--output-path`: The directory in which OpenSearch Benchmark creates the workload and its configuration files.

The following example response creates a workload named `movies` from a cluster with an index named `movies-info`. The `movies-info` index contains over 2,000 documents.

```
   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/

[INFO] You did not provide an explicit timeout in the client options. Assuming default of 10 seconds.
[INFO] Connected to OpenSearch cluster [380d8fd64dd85b5f77c0ad81b0799e1e] version [1.1.0].

Extracting documents for index [movies] for test mode...      1000/1000 docs [100.0% done]
Extracting documents for index [movies]...                    2000/2000 docs [100.0% done]

[INFO] Workload movies has been created. Run it with: opensearch-benchmark --workload-path=/Users/hoangia/Desktop/workloads/movies

-------------------------------
[INFO] SUCCESS (took 2 seconds)
-------------------------------
```

As part of workload creation, OpenSearch Benchmark generates the following files. You can access them in the directory specified by the `--output-path` option.

- `workload.json`: Contains general workload specifications.
- `<index>.json`: Contains mappings and settings for the extracted indexes.
- `<index>-documents.json`: Contains the sources of every document from the extracted indexes. Any sources suffixed with `-1k` encompass only a fraction of the document corpus of the workload and are only used when running the workload in test mode.

By default, OpenSearch Benchmark does not contain a reference to generate queries. Because you have the best understanding of your data, we recommend adding a query to `workload.json` that matches your index's specifications. Use the following `match_all` query as an example of a query added to your workload:

```json
{
      "operation": {
        "name": "query-match-all",
        "operation-type": "search",
        "body": {
          "query": {
            "match_all": {}
          }
        }
      },
      "clients": 8,
      "warmup-iterations": 1000,
      "iterations": 1000,
      "target-throughput": 100
    }
```

### Creating a workload without an existing cluster

If you want to create a custom workload but do not have an existing OpenSearch cluster with indexed data, you can create the workload by building the workload source files directly. All you need is data that can be exported into a JSON format.

To build a workload with source files, create a directory for your workload and perform the following steps:

1. Build a `<index>-documents.json` file that contains rows of documents that comprise the document corpora of the workload and houses all data to be ingested and queried into the cluster. The following example shows the first few rows of a `movies-documents.json` file that contains rows of documents about famous movies:

   ```json
  # First few rows of movies-documents.json
  {"title": "Back to the Future", "director": "Robert Zemeckis", "revenue": "$212,259,762 USD", "rating": "8.5 out of 10",  "image_url": "https://imdb.com/images/32"}
  {"title": "Avengers: Endgame", "director": "Anthony and Joe Russo", "revenue": "$2,800,000,000 USD", "rating": "8.4 out   of 10", "image_url": "https://imdb.com/images/2"}
  {"title": "The Grand Budapest Hotel", "director": "Wes Anderson", "revenue": "$173,000,000 USD", "rating": "8.1 out of 10", "image_url": "https://imdb.com/images/65"}
  {"title": "The Godfather: Part II", "director": "Francis Ford Coppola", "revenue": "$48,000,000 USD", "rating": "9 out of 10", "image_url": "https://imdb.com/images/7"}
   ```

2. In the same directory, build a `index.json` file. The workload uses this file as a reference for data mappings and index settings for the documents contained in `<index>-documents.json`. The following example creates mappings and settings specific to the `movie-documents.json` data from the previous step:

    ```json
    {
    "settings": {
        "index.number_of_replicas": 0
    },
    "mappings": {
        "dynamic": "strict",
        "properties": {
        "title": {
            "type": "text"
        },
        "director": {
            "type": "text"
        },
        "revenue": {
            "type": "text"
        },
        "rating": {
            "type": "text"
        },
        "image_url": {
            "type": "text"
        }
        }
    }
    }
    ```

3. Next, build a `workload.json` file that provides a high-level overview of your workload and determines how your workload runs benchmark tests. The `workload.json` file contains the following sections:

   - `indices`: Defines the name of the index to be created in your OpenSearch cluster using the mappings from the workload's `index.json` file created in the previous step.
   - `corpora`: Defines the corpora and the source file, including the:
      - `document-count`: The number of documents in `<index>-documents.json`. To get an accurate number of documents, run `wc -l <index>-documents.json`.
      - `uncompressed-bytes`: The number of bytes inside the index. To get an accurate number of bytes, run `stat -f %z <index>-documents.json` on macOS or `stat -c %s <index>-documents.json` on GNU/Linux. Alternatively, run `ls -lrt | grep <index>-documents.json`.
   - `schedule`: Defines the sequence of operations and available test procedures for the workload.

The following example `workload.json` file provides the entry point for the `movies` workload. The `indices` section creates an index called `movies`. The corpora section refers to the source file created in step one, `movie-documents.json`, and provides the document count and the amount of uncompressed bytes. Lastly, the schedule section defines a few operations the workload performs when invoked, including:

- Deleting any current index named `movies`.
- Creating an index named `movies` based on data from `movie-documents.json` and the mappings from `index.json`.
- Verifying that the cluster is in good health and can ingest the new index.
- Ingesting the data corpora from `workload.json` into the cluster.
- Querying the results.

    ```json
    {
    "version": 2,
    "description": "Tutorial benchmark for OpenSearch Benchmark",
    "indices": [
        {
        "name": "movies",
        "body": "index.json"
        }
    ],
    "corpora": [
        {
        "name": "movies",
        "documents": [
            {
            "source-file": "movies-documents.json",
            "document-count": 11658903, # Fetch document count from command line
            "uncompressed-bytes": 1544799789 # Fetch uncompressed bytes from command line
            }
        ]
        }
    ],
    "schedule": [
        {
        "operation": {
            "operation-type": "delete-index"
        }
        },
        {
        "operation": {
            "operation-type": "create-index"
        }
        },
        {
        "operation": {
            "operation-type": "cluster-health",
            "request-params": {
            "wait_for_status": "green"
            },
            "retry-until-success": true
        }
        },
        {
        "operation": {
            "operation-type": "bulk",
            "bulk-size": 5000
        },
        "warmup-time-period": 120,
        "clients": 8
        },
        {
        "operation": {
            "operation-type": "force-merge"
        }
        },
        {
        "operation": {
            "name": "query-match-all",
            "operation-type": "search",
            "body": {
            "query": {
                "match_all": {}
            }
            }
        },
        "clients": 8,
        "warmup-iterations": 1000,
        "iterations": 1000,
        "target-throughput": 100
        }
    ]
    }
    ```

The corpora section refers to the source file created in step one, `movie-documents.json`, and provides the document count and the amount of uncompressed bytes. Lastly, the schedule section defines a few operations the workload performs when invoked, including:

- Deleting any current index named `movies`.
- Creating an index named `movies` based on data from `movie-documents.json` and the mappings from `index.json`.
   - Verifying that the cluster is in good health and can ingest the new index.
   - Ingesting the data corpora from `workload.json` into the cluster.
   - Querying the results.



For all the workload files created, verify that the workload is functional by running a test. To verify the workload, run the following command, replacing `--workload-path` with a path to your workload directory:

```
opensearch-benchmark list workloads --workload-path=</path/to/workload/>
```

## Invoking your custom workload

Use the `opensearch-benchmark execute-test` command to invoke your new workload and run a benchmark test against your OpenSearch cluster, as shown in the following example. Replace `--workload-path` with the path to your custom workload, `--target-host` with the `host:port` pairs for your cluster, and `--client-options` with any authorization options required to access the cluster.

```
opensearch-benchmark execute_test \
--pipeline="benchmark-only" \
--workload-path="<PATH OUTPUTTED IN THE OUTPUT OF THE CREATE-WORKLOAD COMMAND>" \
--target-host="<CLUSTER ENDPOINT>" \
--client-options="basic_auth_user:'<USERNAME>',basic_auth_password:'<PASSWORD>'"
```

Results from the test appear in the directory set by `--output-path` option in `workloads.json`.

## Advanced options

You can enhance your custom workload's functionality with the following advanced options.

### Test mode

If you want run the test in test mode to make sure your workload operates as intended, add the `--test-mode` option to the `execute-test` command. Test mode ingests only the first 1000 documents from each index provided and runs query operations against them.

To use test mode, create a `<index>-documents-1k.json` file that contains the first 1000 documents from `<index>-documents.json` using the following command:

```
head -n 1000 <index>-documents.json > <index>-documents-1k.json
```

Then, run `opensearch-benchmark execute-test` with the option `--test-mode`. Test mode runs a quick version of the workload test.

```
opensearch-benchmark execute_test \
--pipeline="benchmark-only"  \
--workload-path="<PATH OUTPUTTED IN THE OUTPUT OF THE CREATE-WORKLOAD COMMAND>" \
--target-host="<CLUSTER ENDPOINT>" \
--client-options"basic_auth_user:'<USERNAME>',basic_auth_password:'<PASSWORD>'" \
--test-mode
```

### Adding variance to test procedures

After using your custom workload several times, you might want to use the same workload but perform the workload's operations in a different order. Instead of creating a new workload or reorganizing the procedures directly, you can provide test procedures to vary workload operations.

To add variance to your workload operations, go to your `workload.json` file and replace the `schedule` section with a `test_procedures` array, as shown in the following example. Each item in the array contains the following:

- `name`: The name of the test procedure.
- `default`: When set to `true`, OpenSearch Benchmark defaults to the test procedure specified as `default` in the workload if no other test procedures are specified.
- `schedule`: All the operations the test procedure will run.


```json
"test_procedures": [
    {
      "name": "index-and-query",
      "default": true,
      "schedule": [
        {
          "operation": {
            "operation-type": "delete-index"
          }
        },
        {
          "operation": {
            "operation-type": "create-index"
          }
        },
        {
          "operation": {
            "operation-type": "cluster-health",
            "request-params": {
              "wait_for_status": "green"
            },
            "retry-until-success": true
          }
        },
        {
          "operation": {
            "operation-type": "bulk",
            "bulk-size": 5000
          },
          "warmup-time-period": 120,
          "clients": 8
        },
        {
          "operation": {
            "operation-type": "force-merge"
          }
        },
        {
          "operation": {
            "name": "query-match-all",
            "operation-type": "search",
            "body": {
              "query": {
                "match_all": {}
              }
            }
          },
          "clients": 8,
          "warmup-iterations": 1000,
          "iterations": 1000,
          "target-throughput": 100
        }
      ]
    }
  ]
}
```

### Separate operations and test procedures

If you want to make your `workload.json` file more readable, you can separate your operations and test procedures into different directories and reference the path to each in `workload.json`. To separate operations and procedures, perform the following steps:

1. Add all test procedures to a single file. You can give the file any name. Because the `movies` workload in the preceding contains and index task and queries, this step names the test procedures file `index-and-query.json`.
2. Add all operations to a file named `operations.json`.
3. Reference the new files in `workloads.json` by adding the following syntax, replacing `parts` with the relative path to each file, as shown in the following example:

    ```json
    "operations": [
        {% raw %}{{ benchmark.collect(parts="operations/*.json") }}{% endraw %}
    ]
    # Reference test procedure files in workload.json
    "test_procedures": [
        {% raw %}{{ benchmark.collect(parts="test_procedures/*.json") }}{% endraw %}
    ]
    ```

## Next steps

- For more information about configuring OpenSearch Benchmark, see [Configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/configuring-benchmark/).
- To show a list of prepackaged workloads for OpenSearch Benchmark, see the [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository.
