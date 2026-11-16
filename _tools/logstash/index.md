---
layout: default
title: Logstash
nav_order: 150
has_children: true
has_toc: true
redirect_from:
  - /clients/logstash/
  - /clients/logstash/index/
  - /tools/logstash/
---

# Logstash

Logstash is an open-source, real-time event processing engine that receives events from one or more sources, processes them, and sends them to one or more destinations. For example, you can send access logs from a web server to Logstash, extract fields from each log line, and send the resulting events to OpenSearch.

Sending events to Logstash decouples event processing from your application. Your application only needs to send events to Logstash and doesn't need to know what happens to them afterward.

Logstash was originally built to process log data, but it can process any type of event, including events in XML or JSON format.

To send events to OpenSearch, install the [OpenSearch output plugin](https://github.com/opensearch-project/logstash-output-opensearch). To read data from OpenSearch into Logstash, install the [OpenSearch input plugin](https://github.com/opensearch-project/logstash-input-opensearch).

## Pipeline structure

A Logstash pipeline has three stages: inputs, filters, and outputs. Each stage uses one or more plugins. Logstash includes over 200 plugins, and you can install plugins from the community or write your own.

A pipeline configuration has the following structure:

```ruby
input {
  <input-plugin> {
    <setting> => <value>
  }
}

filter {
  <filter-plugin> {
    <setting> => <value>
  }
}

output {
  <output-plugin> {
    <setting> => <value>
  }
}
```

The stages perform the following tasks:

- `input`: Receives events, such as logs, from one or more sources. Input plugins include `tcp`, `udp`, `file`, `syslog`, `stdin`, and `http`. You can also use Beats agents to collect events and send them to Logstash.
- `filter`: Parses and enriches events. For example, the `grok` filter parses unstructured text into fields, and the `mutate` filter modifies fields. Filters run in the order in which they appear in the configuration.
- `output`: Sends the processed events to one or more destinations, such as OpenSearch, a file, `stdout`, an HTTP endpoint, a TCP or UDP socket, an email address, or Nagios.

Inputs and outputs can use codecs to decode or encode events as they enter or leave the pipeline. For example, the `json` codec parses JSON-formatted input, and the `multiline` codec combines multiple lines into a single event.

To apply plugins only to events that meet a condition, use conditional statements. For more information, see [Conditional statements]({{site.url}}{{site.baseurl}}/tools/logstash/advanced-config/#conditional-statements).

## Installing Logstash

To install Logstash, install a Logstash distribution and then install the OpenSearch plugins. The following instructions use the open-source (OSS) distribution of Logstash.

### Prerequisite

Before you install Logstash, review the [Compatibility matrix for Logstash]({{site.url}}{{site.baseurl}}/tools/#compatibility-matrix-for-logstash) and select a Logstash version that is compatible with your OpenSearch version.

### Tarball

Logstash includes a bundled JDK, so you don't need to install Java separately.

To install Logstash from a tarball, follow these steps:

1. Download the Logstash OSS tarball for your platform. In this example, the version is 8.19.23:

    ```bash
    curl -O https://artifacts.elastic.co/downloads/logstash/logstash-oss-8.19.23-linux-x86_64.tar.gz
    ```
    {% include copy.html %}

    For other platforms, see [Download Logstash OSS](https://www.elastic.co/downloads/logstash-oss).

1. Extract the files:

    ```bash
    tar -zxvf logstash-oss-8.19.23-linux-x86_64.tar.gz
    ```
    {% include copy.html %}

1. Navigate to the Logstash directory:

    ```bash
    cd logstash-8.19.23
    ```
    {% include copy.html %}

1. Install the OpenSearch output plugin:

    ```bash
    bin/logstash-plugin install logstash-output-opensearch
    ```
    {% include copy.html %}

    The command returns the following output:

    ```
    Validating logstash-output-opensearch
    Resolving mixin dependencies
    Updating mixin dependencies logstash-mixin-ecs_compatibility_support
    Bundler attempted to update logstash-mixin-ecs_compatibility_support but its version stayed the same
    Installing logstash-output-opensearch
    Installation successful
    ```

1. If you plan to read data from OpenSearch, install the OpenSearch input plugin:

    ```bash
    bin/logstash-plugin install logstash-input-opensearch
    ```
    {% include copy.html %}

The Logstash directory contains the following subdirectories:

- `bin`: Contains the binaries for starting Logstash and managing plugins.
- `config`: Contains the Logstash settings. You can store your pipeline configuration files in this directory.
- `data`: Contains data that Logstash and its plugins store between runs.

### Docker

The OpenSearch plugins are not included in the Logstash Docker images, so you need to build an image that contains them.

To run Logstash and OpenSearch in Docker, follow these steps:

1. Create a file named `Dockerfile` with the following content. In this example, the version is 8.19.23:

    ```
    FROM docker.elastic.co/logstash/logstash-oss:8.19.23
    RUN bin/logstash-plugin install logstash-output-opensearch
    RUN bin/logstash-plugin install logstash-input-opensearch
    ```
    {% include copy.html %}

1. In the directory containing the `Dockerfile`, build the image:

    ```bash
    docker build -t logstash-with-opensearch-plugins .
    ```
    {% include copy.html %}

1. Create a Docker network so that the Logstash container can connect to the OpenSearch container:

    ```bash
    docker network create opensearch-net
    ```
    {% include copy.html %}

1. Start OpenSearch on this network. Replace `<admin-password>` with a strong password for the `admin` user:

    ```bash
    docker run -d -p 9200:9200 --name opensearch --net opensearch-net -e "discovery.type=single-node" -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD=<admin-password>" opensearchproject/opensearch:latest
    ```
    {% include copy.html %}

1. Start Logstash on the same network. The following pipeline reads events from the terminal and sends them to OpenSearch:

    ```bash
    docker run -it --rm --name logstash --net opensearch-net logstash-with-opensearch-plugins -e 'input { stdin { } } output {
      opensearch {
        hosts => ["https://opensearch:9200"]
        index => "opensearch-logstash-docker-%{+YYYY.MM.dd}"
        user => "admin"
        password => "<admin-password>"
        ssl => true
        ssl_certificate_verification => false
      }
    }'
    ```
    {% include copy.html %}

    The OpenSearch demo configuration uses self-signed certificates, so this example disables certificate verification. In production, provide the certificate authority file in the `cacert` setting instead. For more information, see [Configuring the OpenSearch output plugin]({{site.url}}{{site.baseurl}}/tools/logstash/ship-to-opensearch/#configuring-the-opensearch-output-plugin).
    {: .warning }

1. When Logstash logs `Pipeline started`, enter some text in the terminal, such as `hello world`. Then press `Ctrl+C` to stop Logstash.

1. Verify that Logstash created the index:

    ```bash
    curl -k -u 'admin:<admin-password>' "https://localhost:9200/_cat/indices/opensearch-logstash-docker-*?v"
    ```
    {% include copy.html %}

    The response lists the index and its document count:

    ```bash
    health status index                                 uuid                   pri rep docs.count docs.deleted store.size pri.store.size
    yellow open   opensearch-logstash-docker-2026.10.16 6WKKD-CuTiqV7vIu8puyaA   1   1          1            0      6.9kb          6.9kb
    ```

## Processing text from the terminal

The examples in the following sections use a tarball installation and run from the Logstash directory. The `stdin` input reads events from the terminal in which Logstash is running, and the `stdout` output prints events to the same terminal.

To process text from the terminal, follow these steps:

1. Pass a pipeline configuration to Logstash using the `-e` argument. In this pipeline, `stdin` is the input plugin and `stdout` is the output plugin:

    ```bash
    bin/logstash -e "input { stdin { } } output { stdout { } }"
    ```
    {% include copy.html %}

    For more detailed logs, add the `--log.level=debug` argument.

1. When Logstash logs `Pipeline started`, enter `hello world` in the terminal. Logstash processes the text and prints the resulting event:

    ```
    {
             "event" => {
            "original" => "hello world"
        },
           "message" => "hello world",
          "@version" => "1",
        "@timestamp" => 2026-10-16T17:55:22.401258801Z,
              "host" => {
            "hostname" => "my-host"
        }
    }
    ```

    The event contains the following fields:

    - `message`: The text that you entered.
    - `event.original`: The original, unmodified input.
    - `host.hostname`: The name of the host on which Logstash is running.
    - `@timestamp`: The time at which Logstash processed the event.
    - `@version`: The event format version, which Logstash uses internally.

1. Press `Ctrl+C` to stop Logstash.

### Troubleshooting

Logstash locks its `data` directory while it's running. If another Logstash process is already using the directory, Logstash fails to start and logs the following message:

```
Logstash could not be started because there is already another instance using the configured data directory.
```

To resolve this issue, stop the other Logstash process. To run two Logstash processes at the same time, start the second process with a different data directory using the `--path.data` argument.

## Processing JSON input and writing it to a file

To define a pipeline that processes JSON input, follow these steps:

1. Create a file named `config/pipeline.conf` with the following configuration. The `json` codec parses each input line as JSON, and the `file` output writes the processed events to the `output.txt` file:

    ```ruby
    input {
      stdin {
        codec => json
      }
    }

    output {
      file {
        path => "output.txt"
      }
    }
    ```
    {% include copy.html %}

    You can give a pipeline configuration file any name and extension. By convention, pipeline configuration files use the `.conf` extension.

1. Start Logstash:

    ```bash
    bin/logstash -f config/pipeline.conf
    ```
    {% include copy.html %}

    The `config/pipeline.conf` path is relative to the Logstash directory. You can also provide an absolute path.

1. Enter a JSON object on a single line in the terminal:

    ```json
    { "amount": 10, "quantity": 2 }
    ```
    {% include copy.html %}

    The `json` codec parses each line separately. If you enter invalid JSON, for example, a JSON object that spans multiple lines, Logstash can't parse it and adds the `_jsonparsefailure` tag to the event. Logstash doesn't discard events that fail to parse, so you can process them separately, for example, by sending an email or a notification to a Slack channel.

1. In another terminal, view the `output.txt` file in the Logstash directory:

    ```bash
    cat output.txt
    ```
    {% include copy.html %}

    The file contains the event, including the parsed `amount` and `quantity` fields:

    ```json
    {"host":{"hostname":"my-host"},"@version":"1","amount":10,"quantity":2,"@timestamp":"2026-10-16T17:56:05.320077410Z","event":{"original":"{ \"amount\": 10, \"quantity\": 2 }\n"}}
    ```

To read events from a file instead of the terminal, use the `file` input plugin. The `file` input requires an absolute path:

```ruby
input {
  file {
    path => "/path/to/logstash/events-data/input_data.log"
  }
}
```
{% include copy.html %}

## Processing HTTP input

To define a pipeline that receives events over HTTP, follow these steps:

1. Replace the contents of `config/pipeline.conf` with the following configuration. The `http` input listens for HTTP requests on port 8080:

    ```ruby
    input {
      http {
        host => "127.0.0.1"
        port => 8080
      }
    }

    output {
      file {
        path => "output.txt"
      }
    }
    ```
    {% include copy.html %}

    If you don't specify the `host` and `port` settings, the `http` input listens on all network interfaces (`0.0.0.0`) on port 8080.

1. Start Logstash:

    ```bash
    bin/logstash -f config/pipeline.conf
    ```
    {% include copy.html %}

1. In another terminal, send an HTTP request containing a JSON body:

    ```bash
    curl -XPUT -H "Content-Type: application/json" -d '{"amount": 7, "quantity": 3}' http://localhost:8080
    ```
    {% include copy.html %}

    Logstash returns `ok`.

The `http` input selects a codec based on the `Content-Type` header. Because the request has a `Content-Type` of `application/json`, Logstash parses the request body as JSON even though the pipeline doesn't specify the `json` codec. If the `Content-Type` is not `application/json`, Logstash stores the request body as text in the `message` field.

Logstash adds information about the request to the event. The following event shows this information in the format that the `stdout` output prints:

```
{
      "@version" => "1",
    "@timestamp" => 2026-10-16T17:57:09.851542204Z,
         "event" => {
        "original" => "{\"amount\": 7, \"quantity\": 3}"
    },
          "host" => {
        "ip" => "127.0.0.1"
    },
    "user_agent" => {
        "original" => "curl/8.7.1"
    },
          "http" => {
        "request" => {
                 "body" => {
                "bytes" => "28"
            },
            "mime_type" => "application/json"
        },
        "version" => "HTTP/1.1",
         "method" => "PUT"
    },
           "url" => {
          "port" => 8080,
          "path" => "/",
        "domain" => "localhost"
    },
        "amount" => 7,
      "quantity" => 3
}
```

## Reloading the pipeline configuration automatically

Logstash can detect changes to the pipeline configuration file and reload the pipeline without restarting.

The `stdin` input doesn't support automatic reloading.
{: .note }

To configure automatic reloading for a pipeline that reads from a file, follow these steps:

1. Create an input file named `events-data/input_file.log` in the Logstash directory and add a line of text to it.

1. Replace the contents of `config/pipeline.conf` with the following configuration. Replace `<path-to-logstash>` with the absolute path to your Logstash directory:

    ```ruby
    input {
      file {
        path => "<path-to-logstash>/events-data/input_file.log"
        start_position => "beginning"
      }
    }

    output {
      stdout { }
    }
    ```
    {% include copy.html %}

    By default, the `file` input reads only lines added to the file after Logstash starts. Setting `start_position` to `beginning` makes Logstash read the file from the beginning the first time it processes the file.

1. Start Logstash using the `--config.reload.automatic` argument:

    ```bash
    bin/logstash -f config/pipeline.conf --config.reload.automatic
    ```
    {% include copy.html %}

    Logstash prints an event for each line in the input file.

1. Add a new line to the input file. Logstash detects the change and processes the new line as an event.

1. Change the `config/pipeline.conf` file, for example, by adding `codec => rubydebug` to the `stdout` output. Logstash detects the change, logs `Reloading pipeline`, and applies the new configuration.

To avoid processing the same lines more than once, the `file` input records its position in each file that it reads in a `sincedb` file. Logstash stores `sincedb` files in the `data/plugins/inputs/file` directory:

```bash
cat data/plugins/inputs/file/.sincedb_*
```
{% include copy.html %}

Each line in a `sincedb` file corresponds to one input file and contains the file's inode number, major and minor device numbers, the byte offset up to which Logstash has read the file, the time of the last update, and the file path:

```
51956745 0 66305 29 1792174306.332788 /opt/logstash/events-data/input_file.log
```

To process the input file from the beginning again, stop Logstash, delete the `sincedb` file, and then restart Logstash:

```bash
rm data/plugins/inputs/file/.sincedb_*
```
{% include copy.html %}
