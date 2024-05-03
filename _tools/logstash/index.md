---
layout: default
title: Logstash
nav_order: 150
has_children: true
has_toc: true
redirect_from:
  - /clients/logstash/
  - /clients/logstash/index/
---

# Logstash

Logstash is a real-time event processing engine. It's part of the OpenSearch stack which includes OpenSearch, Beats, and OpenSearch Dashboards.

You can send events to Logstash from many different sources. Logstash processes the events and sends it one or more destinations. For example, you can send access logs from a web server to Logstash. Logstash extracts useful information from each log and sends it to a destination like OpenSearch.

Sending events to Logstash lets you decouple event processing from your app. Your app only needs to send events to Logstash and doesn’t need to know anything about what happens to the events afterwards.

The open-source community originally built Logstash for processing log data but now you can process any type of events, including events in XML or JSON format.

## Structure of a pipeline

The way that Logstash works is that you configure a pipeline that has three phases⁠---inputs, filters, and outputs.

Each phase uses one or more plugins. Logstash has over 200 built-in plugins so chances are that you’ll find what you need. Apart from the built-in plugins, you can use plugins from the community or even write your own.

The structure of a pipeline is as follows:

```yml
input {
  input_plugin => {}
}

filter {
  filter_plugin => {}
}

output {
  output_plugin => {}
}
```

where:

* `input` receives events like logs from multiple sources simultaneously. Logstash supports a number of input plugins for TCP/UDP, files, syslog, Microsoft Windows EventLogs, stdin, HTTP, and so on. You can also use an open source collection of input tools called Beats to gather events. The input plugin sends the events to a filter.
* `filter` parses and enriches the events in one way or the other. Logstash has a large collection of filter plugins that modify events and pass them on to an output. For example, a `grok` filter parses unstructured events into fields and a `mutate` filter changes fields. Filters are executed sequentially.
* `output` ships the filtered events to one or more destinations. Logstash supports a wide range of output plugins for destinations like OpenSearch, TCP/UDP, emails, files, stdout, HTTP, Nagios, and so on.

Both the input and output phases support codecs to process events as they enter or exit the pipeline.
Some of the popular codecs are `json` and `multiline`. The `json` codec processes data that’s in JSON format and the `multiline` codec merges multiple line events into a single line.

You can also write conditional statements within pipeline configurations to perform certain actions, if a certain criteria is met.

## Install Logstash

To install Logstash on OpenSearch, first install Logstash on your cluster, then the OpenSearch Logstash plugin, as described in the following steps.

### Tarball

Make sure you have [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/javase-downloads.html) version 8 or 11 installed.

1. Download the Logstash tarball from [Logstash downloads](https://www.elastic.co/downloads/logstash).

2. Navigate to the downloaded folder in the terminal and extract the files. Make sure that your version of Logstash and platform matches the one downloaded:

     ```bash
     tar -zxvf logstash-8.8.2-linux-x86_64.tar.gz
     ```

3. Navigate to the `logstash-8.8.2` directory.

4. Use the following command to install the plugin:

     ```bash
     bin/logstash-plugin install logstash-output-opensearch
     ```
  
   You should receive the following output:

     ```
     Validating logstash-output-opensearch
     Resolving mixin dependencies
     Updating mixin dependencies logstash-mixin-ecs_compatibility_support
     Bundler attempted to update logstash-mixin-ecs_compatibility_support but its version stayed the same
     Installing logstash-output-opensearch
     Installation successful
     ```

You can add your pipeline configurations to the `config` directory. Logstash saves any data from the plugins in the `data` directory. The `bin` directory contains the binaries for starting Logstash and managing plugins.

### Docker

1. Pull the latest Logstash image as stated in the [Logstash downloads](https://www.elastic.co/downloads/logstash).

    ```
    docker pull docker.elastic.co/logstash/logstash:8.8.2
    ```

1. Create a Docker network:

    ```
    docker network create test
    ```

1. Start OpenSearch with this network:

    ```
    docker run -p 9200:9200 -p 9600:9600 --name opensearch --net test -e "discovery.type=single-node" opensearchproject/opensearch:1.2.0
    ```

1. Start Logstash:

    ```
    docker run -it --rm --name logstash --net test opensearchproject/logstash-oss-with-opensearch-output-plugin:7.16.2 -e 'input { stdin { } } output {
      opensearch {
        hosts => ["https://opensearch:9200"]
        index => "opensearch-logstash-docker-%{+YYYY.MM.dd}"
        user => "admin"
        password => "admin"
        ssl => true
        ssl_certificate_verification => false
      }
    }'
    ```

## Process text from the terminal

You can define a pipeline that listens for events on `stdin` and outputs events on `stdout`. `stdin` and `stdout` refer to the terminal in which you’re running Logstash.

To enter some text in the terminal and see the event data in the output:

1. Use the `-e` argument to pass a pipeline configuration directly to the Logstash binary. In this case, `stdin` is the input plugin and `stdout` is the output plugin:

    ```bash
    bin/logstash -e "input { stdin { } } output { stdout { } }"
    ```
    Add the `—debug` flag to see a more detailed output.

2. Enter "hello world" in your terminal. Logstash processes the text and outputs it back to the terminal:

    ```yml
    {
     "message" => "hello world",
     "host" => "a483e711a548.ant.amazon.com",
     "@timestamp" => 2021-05-30T05:15:56.816Z,
     "@version" => "1"
    }
    ```

    The `message` field contains your raw input. The `host` field is an IP address when you don’t run Logstash locally. `@timestamp` shows the date and time for when the event is processed. Logstash uses the `@version` field for internal processing.

3. Press `Ctrl + C` to shut down Logstash.

### Troubleshooting

If you already have a Logstash process running, you’ll get an error. To fix this issue:

1. Delete the `.lock` file from the `data` directory:

    ```bash
    cd data
    rm -rf .lock
    ```

2. Restart Logstash.

## Process JSON or HTTP input and output it to a file

To define a pipeline that handles JSON requests:

1. Open the `config/pipeline.conf` file in any text editor you like. You can create a pipeline configuration file with any extension, the `.conf` extension is a Logstash convention. Add the `json` codec to accept JSON as the input and the `file` plugin to output the processed events to a `.txt` file:

    ```yml
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

    To process inputs from a file, add an input file to the `events-data` directory and then pass its path to the `file` plugin at the input:

    ```yml
    input {
      file {
        path => "events-data/input_data.log"
      }
    }
    ```

2. Start Logstash:

    ```bash
    $ bin/logstash -f config/pipeline.conf
    ```

    `config/pipeline.conf` is a relative path to the `pipeline.conf` file. You can use an absolute path as well.

3. Add a JSON object in the terminal:

    ```json
    { "amount": 10, "quantity": 2}
    ```

    The pipeline only handles a single line of input. If you paste some JSON that spans multiple lines, you’ll get an error.

4. Check that the fields from the JSON object are added to the `output.txt` file:

    ```json
    $ cat output.txt

    {
      "@version": "1",
      "@timestamp": "2021-05-30T05:52:52.421Z",
      "host": "a483e711a548.ant.amazon.com",
      "amount": 10,
      "quantity": 2
    }
    ```

    If you type in some invalid JSON as the input, you'll see a JSON parsing error. Logstash doesn't discard the invalid JSON because you still might want to do something with it. For example, you can trigger an email or send a notification to a Slack channel.

To define a pipeline that handles HTTP requests:

1. Use the `http` plugin to send events to Logstash through HTTP:

    ```yml
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

    If you don’t specify any options, the `http` plugin binds to `localhost` and listens on port 8080.

2. Start Logstash:

    ```bash
    $ bin/logstash -f config/pipeline.conf
    ```

3. Use Postman to send an HTTP request. Set `Content-Type` to an HTTP header with a value of `application/json`:

    ```json
    PUT 127.0.0.1:8080

    {
      "amount": 10,
      "quantity": 2
    }
    ```

    Or, you can use the `curl` command:

    ```bash
    curl -XPUT -H "Content-Type: application/json" -d ' {"amount": 7, "quantity": 3 }' http://localhost:8080 (http://localhost:8080/)
    ```

    Even though we haven't added the `json` plugin to the input, the pipeline configuration still works because the HTTP plugin automatically applies the appropriate codec based on the `Content-Type` header.
    If you specify a value of `applications/json`, Logstash parses the request body as JSON.

    The `headers` field contains the HTTP headers that Logstash receives:

    ```json
    {
      "host": "127.0.0.1",
      "quantity": "3",
      "amount": 10,
      "@timestamp": "2021-05-30T06:05:48.135Z",
      "headers": {
        "http_version": "HTTP/1.1",
        "request_method": "PUT",
        "http_user_agent": "PostmanRuntime/7.26.8",
        "connection": "keep-alive",
        "postman_token": "c6cd29cf-1b37-4420-8db3-9faec66b9e7e",
        "http_host": "127.0.0.1:8080",
        "cache_control": "no-cache",
        "request_path": "/",
        "content_type": "application/json",
        "http_accept": "*/*",
        "content_length": "41",
        "accept_encoding": "gzip, deflate, br"
      },
    "@version": "1"
    }
    ```


## Automatically reload the pipeline configuration

You can configure Logstash to detect any changes to the pipeline configuration file or the input log file and automatically reload the configuration.

The `stdin` plugin doesn’t supporting automatic reloading.
{: .note }

1. Add an option named `start_position` with a value of `beginning` to the input plugin:

    ```yml
    input {
      file {
        path => "/Users/<user>/Desktop/logstash7-12.1/events-data/input_file.log"
        start_position => "beginning"
      }
    }
    ```

    Logstash only processes any new events added to the input file and ignores the ones that it has already processed to avoid processing the same event more than once on restart.

    Logstash records its progress in a file that's referred to as a `sinceDB` file. Logstash creates a `sinceDB` file for each file that it watches for changes.

2. Open the `sinceDB` file to check how much of the input files are processed:

    ```bash
    cd data/plugins/inputs/file/
    ls -al

    -rw-r--r--  1 user  staff   0 Jun 13 10:50 .sincedb_9e484f2a9e6c0d1bdfe6f23ac107ffc5

    cat .sincedb_9e484f2a9e6c0d1bdfe6f23ac107ffc5

    51575938 1 4 7727
    ```

    The last number in the `sinceDB` file (7727) is the byte offset of the last known event processed.

5. To process the input file from the beginning, delete the `sinceDB` file:

    ```yml
    rm .sincedb_*
    ```

2. Start Logstash with a `—-config.reload.automatic` argument:

    ```bash
    bin/logstash -f config/pipeline.conf --config.reload.automatic
    ```

    The `reload` option only reloads if you add a new line at the end of the pipeline configuration file.

    Sample output:

    ```yml
    {
       "message" => "216.243.171.38 - - [20/Sep/2017:19:11:52 +0200] \"GET /products/view/123 HTTP/1.1\" 200 12798 \"https://codingexplained.com/products\" \"Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)\"",
       "@version" => "1",
          "host" => "a483e711a548.ant.amazon.com",
          "path" => "/Users/kumarjao/Desktop/odfe1/logstash-7.12.1/events-data/input_file.log",
       "@timestamp" => 2021-06-13T18:03:30.423Z
    }
    {
       "message" => "91.59.108.75 - - [20/Sep/2017:20:11:43 +0200] \"GET /js/main.js HTTP/1.1\" 200 588 \"https://codingexplained.com/products/view/863\" \"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0\"",
      "@version" => "1",
          "host" => "a483e711a548.ant.amazon.com",
          "path" => "/Users/kumarjao/Desktop/odfe1/logstash-7.12.1/events-data/input_file.log",
    "@timestamp" => 2021-06-13T18:03:30.424Z
    }
    ```

7. Add a new line to the input file.
    - Logstash immediately detects the change and processes the new line as an event.

8. Make a change to the `pipeline.conf` file.
    - Logstash immediately detects the change and reloads the modified pipeline.
