---
layout: default
title: Send events to Opensearch
parent: Logstash
nav_order: 220
---

# Send events to Opensearch

You can send Logstash events to an Opensearch cluster and then visualize your log data with Kibana.

Make sure you have Logstash, Opensearch, and Kibana installed.
{: .note }

## Opensearch output plugin

To run the Opensearch output plugin, add the following configuration in your `pipeline.conf` file:

```yml
output {
  opensearch {
    hosts       => "https://localhost:9200"
    user        => "admin"
    password    => "admin"
    index       => "logstash-logs-%{+YYYY.MM.dd}"
    ssl_certificate_verification => false
  }
}
```


## Sample walkthrough

1.  Open the `config/pipeline.conf` file and add in the following configuration:

    ```yml
    input {
      stdin {
        codec => json
      }

      http {
        host => "127.0.0.1"
        port => 8080
      }
    }

    output {
      opensearch {
        hosts       => "https://localhost:9200"
        user        => "admin"
        password    => "admin"
        index       => "logstash-logs-%{+YYYY.MM.dd}"
        ssl_certificate_verification => false
      }
    }
    ```

2. Start Logstash:

    ```bash
    $ bin/logstash -f config/pipeline.conf --config.reload.automatic
    ```

    `config/pipeline.conf` is a relative path to the `pipeline.conf` file. You can use an absolute path as well.

3. Add a JSON object in the terminal:

    ```json
    { "amount": 10, "quantity": 2}
    ```

4. Open Opensearch and search for the processed event:

    ```json
    GET _cat/indices?v

    health | status | index | uuid | pri | rep | docs.count | docs.deleted | store.size | pri.store.size
    green | open | logstash-logs-2021.07.01 | iuh648LYSnmQrkGf70pplA | 1 | 1 | 1 | 0 | 10.3kb | 5.1kb
    ```
