---
layout: default
title: Configuring
nav_order: 7
grand_parent: User guide
parent: Install and configure
redirect_from:
  - /benchmark/configuring-benchmark/
  - /benchmark/user-guide/configuring-benchmark/
  - /benchmark/tutorials/sigv4/
---

# Configuring OpenSearch Benchmark

OpenSearch Benchmark configuration data is stored in `~/.benchmark/benchmark.ini`, which is automatically created the first time OpenSearch Benchmark runs. 

The file is separated into the following sections, which you can customize based on the needs of your cluster.

## client_options

This section explains how to customize client-level settings during benchmark execution using the `--client-options` command line flag.

You can pass client-specific parameters to OpenSearch Benchmark using the `--client-options` flag. These parameters let you control low-level client behavior such as timeouts, authentication methods, and SSL settings.

The `--client-options` flag accepts a comma-separated list of key-value pairs, as shown in the following example:

```bash
--client-options=timeout:120,verify_certs:false
```

You can customize `--client-options` with the following settings.

| Option | Type | Description |
| :---- | :---- | :---- |
| `timeout` | Integer | Sets the request timeout value in seconds. |
| `verify_certs` | Boolean | Determines whether to verify SSL certificates when connecting to the OpenSearch cluster. |

This example runs a benchmark with a 2-minute timeout and disabled certificate verification:

```bash
opensearch-benchmark execute-test \
--target-hosts=https://localhost:9200 \
--pipeline=benchmark-only \
--workload=geonames \
--client-options=timeout:120,verify_certs:false
```

<!-- vale off -->
## meta
<!-- vale on -->

This section contains meta information about the configuration file.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `config.version` | Integer |  The version of the configuration file format. This property is managed by OpenSearch Benchmark and should not be changed. |

<!-- vale off -->
## system
<!-- vale on -->

This section contains global information for the current benchmark environment. This information should be identical on all machines on which OpenSearch Benchmark is installed.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `env.name` | String | The name of the benchmark environment used as metadata in metrics documents when an OpenSearch metrics store is configured. Only alphanumeric characters are allowed. Default is `local`. |
| `available.cores` | Integer | Determines the number of available CPU cores. OpenSearch Benchmark aims to create one asyncio event loop per core and distributes it to clients evenly across event loops. Defaults to the number of logical CPU cores for your cluster. |
| `async.debug` | Boolean | Enables debug mode on OpenSearch Benchmark's asyncio event loop. Default is `false`. |
| `passenv` | String | A comma-separated list of environment variable names that should be passed to OpenSearch for processing. |

<!-- vale off -->
## node
<!-- vale on -->

This section contains node-specific information that can be customized according to the needs of your cluster.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `root.dir` | String | The directory that stores all OpenSearch Benchmark data. OpenSearch Benchmark assumes control over this directory and all its subdirectories. |
| `src.root.dir` | String | The directory from which the OpenSearch source code and any OpenSearch plugins are called. Only relevant for benchmarks from [sources](#source). |

<!-- vale off -->
## source
<!-- vale on -->

This section contains more details about the OpenSearch source tree.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `remote.repo.url` | URL | The URL from which to check out OpenSearch. Default is `https://github.com/opensearch-project/OpenSearch.git`.
| `opensearch.src.subdir` | String | The local path relative to the `src.root.dir` of the OpenSearch search tree. Default is `OpenSearch`. 
| `cache` | Boolean | Enables OpenSearch's internal source artifact cache, `opensearch*.tar.gz`, and any plugin zip files. Artifacts are cached based on their Git revision. Default is `true`. |
| `cache.days` | Integer | The number of days that an artifact should be kept in the source artifact cache. Default is `7`. |

<!-- vale off -->
## benchmarks
<!-- vale on -->

This section contains the settings that can be customized in the OpenSearch Benchmark data directory.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `local.dataset.cache` | String | The directory in which benchmark datasets are stored. Depending on the benchmarks that are run, this directory may contain hundreds of GB of data. Default path is `$HOME/.benchmark/benchmarks/data`. |

<!-- vale off -->
## results_publishing
<!-- vale on -->

This section defines how benchmark metrics are stored.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `datastore.type` | String | If set to `in-memory` all metrics are kept in memory while running the benchmark. If set to `opensearch` all metrics are instead written to a persistent metrics store and the data is made available for further analysis. Default is `in-memory`. |
| `sample.queue.size` | Function | The number of metrics samples that can be stored in OpenSearch Benchmark’s in-memory queue. Default is `2^20`. | 
| metrics.request.downsample.factor | Integer| (default: 1): Determines how many service time and latency samples are saved in the metrics store. By default, all values are saved. If you want to, for example. keep only every 100th sample, specify `100`. This is useful to avoid overwhelming the metrics store in benchmarks with many clients. Default is `1`. |
| `output.processingtime` | Boolean | If set to `true`, OpenSearch shows the additional metric processing time in the command line report. Default is `false`. |

<!-- vale off -->
### `datastore.type` parameters
<!-- vale on -->

When `datastore.type` is set to `opensearch`, the following reporting settings can be customized.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `datastore.host` | IP address | The hostname of the metrics store, for example, `124.340.200.22`. |
| datastore.port| Port | The port number of the metrics store, for example, `9200`. |
| `datastore.secure` | Boolean | If set to `false`, OpenSearch assumes an HTTP connection. If set to true, it assumes an HTTPS connection. |
| `datastore.ssl.verification_mode` | String | When set to the default `full`, the metrics store’s SSL certificate is checked. To disable certificate verification, set this value to `none`. |
| `datastore.ssl.certificate_authorities` | String | Determines the local file system path to the certificate authority’s signing certificate.
| `datastore.user` | Username | Sets the username for the metrics store |
| `datastore.password` | String | Sets the password for the metrics store. Alternatively, this password can be configured using the `OSB_DATASTORE_PASSWORD` environment variable, which avoids storing credentials in a plain text file. The environment variable takes precedence over the config file if both define a password. |
| `datastore.probe.cluster_version` | String | Enables automatic detection of the metrics store’s version. Default is `true`. |
| `datastore.number_of_shards` | Integer | The number of primary shards that the `opensearch-*` indexes should have. Any updates to this setting after initial index creation will only be applied to new `opensearch-*` indexes. Default is the [OpenSearch static index value]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#static-index-level-index-settings). |
| `datastore.number_of_replicas` | Integer | The number of replicas each primary shard in the datastore contains. Any updates to this setting after initial index creation will only be applied to new `opensearch-* `indexes. Default is the [OpenSearch static index value]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#static-index-level-index-settings). |

### Examples

You can use the following examples to set reporting values in your cluster.

This example defines an unprotected metrics store in the local network:

```
[results_publishing]
datastore.type = opensearch
datastore.host = 192.168.10.17
datastore.port = 9200
datastore.secure = false
datastore.user =
datastore.password =
```

This example defines a secure connection to a metrics store in the local network with a self-signed certificate:

```
[results_publishing]
datastore.type = opensearch
datastore.host = 192.168.10.22
datastore.port = 9200
datastore.secure = true
datastore.ssl.verification_mode = none
datastore.user = user-name
datastore.password = the-password-to-your-cluster
```

<!-- vale off -->
## workloads
<!-- vale on -->

This section defines how workloads are retrieved. All keys are read by OpenSearch using the syntax `<<workload-repository-name>>.url`, which you can select using the OpenSearch Benchmark CLI `--workload-repository=workload-repository-name"` option. By default, OpenSearch chooses the workload repository using the `default.url` `https://github.com/opensearch-project/opensearch-benchmark-workloads`.

<!-- vale off -->
## defaults
<!-- vale on -->

This section defines the default values of certain OpenSearch Benchmark CLI parameters.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `preserve_benchmark_candidate` | Boolean | Determines whether OpenSearch installations are preserved or wiped by default after a benchmark. To preserve an installation for a single benchmark, use the command line flag `--preserve-install`. Default is `false`. 

<!-- vale off -->
## distributions
<!-- vale on -->

This section defines how OpenSearch versions are distributed.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `release.cache` | Boolean | Determines whether newly released OpenSearch versions should be cached locally. |

## Running OpenSearch Benchmark with AWS Signature Version 4

OpenSearch Benchmark supports AWS Signature Version 4 authentication. To run OpenSearch Benchmark with AWS Signature Version 4, you need to set up an [AWS Identity and Access Management (IAM) user or role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create.html) and provide it access to the OpenSearch cluster using AWS Signature Version 4 authentication. 

Whether to use an IAM role or user depends on your test cluster's access management requirements. For more information about whether to use an IAM role or user, see [When to create an IAM user (instead of a role)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html#id_which-to-choose).

Use the following steps to set up AWS Signature Version 4:

1. Create an IAM role or user in the AWS Management Console. 

2. Set up your environment variables. If you're testing using Amazon OpenSearch Serverless, set `OSB_SERVICE` to `aoss`.

   - For an IAM user, configure the following environment variables:

   ```bash
   export OSB_AWS_ACCESS_KEY_ID=<IAM USER AWS ACCESS KEY ID>
   export OSB_AWS_SECRET_ACCESS_KEY=<IAM USER AWS SECRET ACCESS KEY>
   export OSB_REGION=<YOUR REGION>
   export OSB_SERVICE=es
   ```
   {% include copy.html %}

   - For an IAM role, configure the following environment variables:

   ```bash
   export OSB_AWS_ACCESS_KEY_ID=<IAM Role AWS ACCESS KEY ID>
   export OSB_AWS_SECRET_ACCESS_KEY=<IAM Role AWS SECRET ACCESS KEY>
   export OSB_AWS_SESSION_TOKEN=<IAM Role SESSION TOKEN>
   export OSB_REGION=<YOUR REGION>
   export OSB_SERVICE=es
   ```
   {% include copy.html %}


3. Customize and run the following `execute-test` command with the `--client-options=amazon_aws_log_in:environment` flag. This flag provides the location of your exported credentials to OpenSearch Benchmark.

   ```bash
   opensearch-benchmark execute-test \
   --target-hosts=<CLUSTER ENDPOINT> \
   --pipeline=benchmark-only \
   --workload=geonames \
   --client-options=timeout:120,amazon_aws_log_in:environment \
   ```


## Proxy configurations

OpenSearch automatically downloads all the necessary proxy data for you, including:

- OpenSearch distributions, when you specify `--distribution-version=<OPENSEARCH-VERSION>`. 
- OpenSearch source code, when you specify a Git revision number, for example, `--revision=1e04b2w`. 
- Any metadata tracked from the [OpenSearch GitHub repository](https://github.com/opensearch-project/OpenSearch).

As of OpenSearch Benchmark 0.5.0, only `http_proxy` is supported.
{: .warning}

You can use an `http_proxy` to connect OpenSearch Benchmark to a specific proxy and connect the proxy to a benchmark workload. To add the proxy: 


1. Add your proxy URL to your shell profile:

   ```
   export http_proxy=http://proxy.proxy.org:4444/
   ```

2. Source your shell profile and verify that the proxy URL is set correctly:

   ```
   source ~/.bash_profile ; echo $http_proxy
   ```

3. Configure Git to connect to your proxy by using the following command. For more information, see the [Git documentation](https://git-scm.com/docs/git-config).

   ```
   git config --global http_proxy $http_proxy
   ```

4. Use `git clone` to clone the workloads repository by using the following command. If the proxy configured correctly, the clone is successful.

   ```
   git clone http://github.com/opensearch-project/opensearch-benchmark-workloads.git
   ```

5. Lastly, verify that OpenSearch Benchmark can connect to the proxy server by checking the `/.benchmark/logs/benchmark.log` log. When OpenSearch Benchmark starts, you should see the following at the top of the log:

    ```
    Connecting via proxy URL [http://proxy.proxy.org:4444/] to the Internet (picked up from the environment variable [http_proxy]).
    ```

## Logging

Logs from OpenSearch Benchmark can be configured in the `~/.benchmark/logging.json` file. For more information about how to format the log file, see the following Python documentation:

- For general tips and tricks, use the [Python Logging Cookbook](https://docs.python.org/3/howto/logging-cookbook.html).
- For the file format, see the Python [logging configuration schema](https://docs.python.org/3/library/logging.config.html#logging-config-dictschema).
- For instructions on how to customize where the log output is written, see the [logging handlers documentation](https://docs.python.org/3/library/logging.handlers.html).

By default, OpenSearch Benchmark logs all output to `~/.benchmark/logs/benchmark.log`.







